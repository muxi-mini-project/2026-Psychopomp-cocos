import { _decorator, Component, director } from 'cc';
import { ResourceManager } from './ResourceManager';
import { DataManager } from './DataManager';
import { SceneViewManager } from './SceneViewManager';
const { ccclass } = _decorator;

export enum GameState {
    GAMEPLAY = "GAMEPLAY",
    PAUSED = "PAUSED",
    DIALOGUE = "DIALOGUE"
}

export const GameEvent = {
    STATE_CHANGED: 'GAME_STATE_CHANGED'
};

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;
    private _currentState: GameState = GameState.GAMEPLAY;
    private _initialized: boolean = false;

    public static get instance(): GameManager {
        return this._instance;
    }

    public get currentState(): GameState {
        return this._currentState;
    }

    onLoad() {
        if (GameManager._instance) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
        director.addPersistRootNode(this.node);

        // 监听动画完成事件
        director.on("INTRO_COMPLETE", this._onIntroComplete, this);
        director.on("ENDING_COMPLETE", this._onEndingComplete, this);

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
        const loaded = DataManager.instance.loadGame("auto_save");

        if (!loaded) {
            // 无存档 → 新游戏
            this._startNewGame();
        } else {
            // 有存档 → 检查动画状态
            this._resumeGame();
        }
    }

    private _startNewGame(): void {
        DataManager.instance.startNewGame();
        director.emit("INTRO_START");
    }

    private _resumeGame(): void {
        const introPlayed = DataManager.instance.getIntroPlayed();
        const endingPlayed = DataManager.instance.getEndingPlayed();

        if (!introPlayed) {
            // 开场动画未完整播放，重新播放
            director.emit("INTRO_START");
        } else if (endingPlayed) {
            // 结局已播放，回主菜单
            director.emit("SHOW_MAIN_MENU");
        } else {
            // 正常恢复游戏
            SceneViewManager.instance.initializeFromSave();
            this.setState(GameState.GAMEPLAY);
        }
    }

    private _onIntroComplete(): void {
        DataManager.instance.setIntroPlayed(true);
        DataManager.instance.saveGame("auto_save", true);

        // 进入游戏
        SceneViewManager.instance.initializeFromSave();
        this.setState(GameState.GAMEPLAY);
    }

    private _onEndingComplete(): void {
        DataManager.instance.setEndingPlayed(true);
        DataManager.instance.saveGame("auto_save", true);

        // 结局动画播放完成，回主菜单
        director.emit("SHOW_MAIN_MENU");
    }

    public setState(newState: GameState): void {
        if (this._currentState === newState) return;

        const oldState = this._currentState;
        this._currentState = newState;

        director.emit(GameEvent.STATE_CHANGED, newState, oldState);
    }

    private _onStartNewGame(_data: { slotId?: string }): void {
        DataManager.instance.startNewGame();
        DataManager.instance.saveGame("auto_save", true);
        const sceneConfig = DataManager.instance.getSceneConfig("scene_intro");
        const startScene = sceneConfig?.startScene || "scene_intro";
        SceneViewManager.instance.loadScene(startScene);
    }

    private _onLoadGame(data: { slotId: string }): void {
        if (data?.slotId && DataManager.instance.loadGame(data.slotId)) {
            SceneViewManager.instance.initializeFromSave();
        }
    }

    private _onPauseGame(): void {
        this.setState(GameState.PAUSED);
    }

    private _onResumeGame(): void {
        this.setState(GameState.GAMEPLAY);
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
        director.off("INTRO_COMPLETE", this._onIntroComplete, this);
        director.off("ENDING_COMPLETE", this._onEndingComplete, this);
        director.off("START_NEW_GAME", this._onStartNewGame, this);
        director.off("LOAD_GAME", this._onLoadGame, this);
        director.off("PAUSE_GAME", this._onPauseGame, this);
        director.off("RESUME_GAME", this._onResumeGame, this);
        director.off("QUIT_TO_MENU", this._onQuitToMenu, this);
        director.off("INTERACTABLE_TRIGGERED", this._onInteractableTriggered, this);
        director.off("SCENE_READY", this._onSceneReady, this);
    }
}
