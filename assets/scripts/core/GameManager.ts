import { _decorator, Component, director } from 'cc';
import { ResourceManager } from './ResourceManager';
import { DataManager } from './DataManager';
import { SceneViewManager } from './SceneViewManager';
import { UIManager } from './UIManager';
const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;
    private _initialized: boolean = false;

    public static get instance(): GameManager {
        return this._instance;
    }

    onLoad() {
        if (GameManager._instance) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
        director.addPersistRootNode(this.node);

        // 监听动画完成事件
        director.on("INTRO_VIDEO_COMPLETE", this._onIntroVideoComplete, this);
        director.on("ENDING_COMPLETE", this._onEndingComplete, this);
        director.on("INTRO_COMPLETE", this._onIntroComplete, this);

        // 监听 UI 事件
        director.on("START_NEW_GAME", this._onStartNewGame, this);
        director.on("LOAD_GAME", this._onLoadGame, this);
        director.on("PAUSE_GAME", this._onPauseGame, this);
        director.on("RESUME_GAME", this._onResumeGame, this);
        director.on("QUIT_TO_MENU", this._onQuitToMenu, this);

        // 监听交互点触发，检查结局条件
        director.on("INTERACTABLE_TRIGGERED", this._onInteractableTriggered, this);

        // 监听场景加载完成，自动存档
        director.on("SCENE_READY", this._onSceneReady, this);
    }

    start() {
        if (this._initialized) return;
        this._initialized = true;

        ResourceManager.instance.init(() => {
            this.initializeGame();
        });
    }

    public initializeGame(): void {
        // 初始化时永远先显示主菜单
        director.emit("SHOW_MAIN_MENU");
    }

    private _resumeGame(): void {
        const introPlayed = DataManager.instance.getIntroPlayed();
        const endingPlayed = DataManager.instance.getEndingPlayed();

        if (!introPlayed) {
            director.emit("INTRO_START");
        } else if (endingPlayed) {
            director.emit("SHOW_MAIN_MENU");
        } else {
            this._enterGame();
        }
    }

    private _onIntroVideoComplete(): void {
        const hasCutscene = DataManager.instance.getBool("HAS_INTRO_CUTSCENE");

        if (hasCutscene) {
            UIManager.instance.showIntroCutscene();
        } else {
            // 无开场对话，视频结束后直接进入游戏
            DataManager.instance.setIntroPlayed(true);
            DataManager.instance.saveGame("auto_save", true);
            this._enterGame();
        }
    }

    private _onIntroComplete(): void {
        // 整个开场（视频+对话）结束，进入游戏
        DataManager.instance.setIntroPlayed(true);
        DataManager.instance.saveGame("auto_save", true);
        UIManager.instance.hideIntroCutscene();
        this._enterGame();
    }

    private _onEndingComplete(): void {
        DataManager.instance.setEndingPlayed(true);
        DataManager.instance.saveGame("auto_save", true);

        // 结局动画播放完成，回主菜单
        director.emit("SHOW_MAIN_MENU");
    }

    private _enterGame(): void {
        SceneViewManager.instance.initializeFromSave();
    }

    private _onStartNewGame(_data: { slotId?: string }): void {
        director.emit("HIDE_MAIN_MENU");
        DataManager.instance.startNewGame();
        // 发出开场动画事件，由 UI 层播放视频
        // 视频播放完毕后发出 INTRO_VIDEO_COMPLETE，对话完毕后发出 INTRO_COMPLETE
        director.emit("INTRO_START");
    }

    private _onLoadGame(data: { slotId: string }): void {
        director.emit("HIDE_MAIN_MENU");
        if (data?.slotId && DataManager.instance.loadGame(data.slotId)) {
            this._resumeGame();
        }
    }

    private _onPauseGame(): void {
        // 游戏暂停逻辑
    }

    private _onResumeGame(): void {
        // 游戏恢复逻辑
    }

    private _onQuitToMenu(): void {
        director.emit("SHOW_MAIN_MENU");
    }

    private _onInteractableTriggered(result: { changedFlags?: { name: string; value: boolean }[] }): void {
        if (!result?.changedFlags?.length) return;

        // flag 变化时自动存档
        DataManager.instance.saveGame("auto_save", true);

        // 检查是否设置了结局条件且未触发
        const endingCondition = DataManager.instance.getEndingCondition();
        if (!endingCondition || endingCondition.triggered) return;

        // 检查是否满足结局条件
        if (DataManager.instance.checkEndingCondition()) {
            // 标记已触发
            endingCondition.triggered = true;
            const endingId = endingCondition.endingId || "default";
            director.emit("ENDING_START", { endingId });
        }
    }

    /**
     * 场景加载完成后自动存档
     */
    private _onSceneReady(): void {
        DataManager.instance.saveGame("auto_save", true);
    }

    protected onDestroy(): void {
        director.off("INTRO_VIDEO_COMPLETE", this._onIntroVideoComplete, this);
        director.off("ENDING_COMPLETE", this._onEndingComplete, this);
        director.off("INTRO_COMPLETE", this._onIntroComplete, this);
        director.off("START_NEW_GAME", this._onStartNewGame, this);
        director.off("LOAD_GAME", this._onLoadGame, this);
        director.off("PAUSE_GAME", this._onPauseGame, this);
        director.off("RESUME_GAME", this._onResumeGame, this);
        director.off("QUIT_TO_MENU", this._onQuitToMenu, this);
        director.off("INTERACTABLE_TRIGGERED", this._onInteractableTriggered, this);
        director.off("SCENE_READY", this._onSceneReady, this);
    }
}
