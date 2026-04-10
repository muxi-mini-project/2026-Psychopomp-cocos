import { _decorator, Component, director } from 'cc';
import { ResourceManager } from './ResourceManager';
import { DataManager } from './DataManager';
import { SceneViewManager } from './SceneViewManager';
import { UIManager } from './UIManager';
import { ItemInventory } from '../components/ItemInventory';
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
        const currentScene = DataManager.instance.getCurrentScene();

        console.log(`[GameManager] _resumeGame introPlayed: ${introPlayed}, endingPlayed: ${endingPlayed}, currentScene: ${currentScene}`);

        if (!introPlayed) {
            console.log("[GameManager] _resumeGame: 发射 INTRO_START");
            director.emit("INTRO_START");
        } else if (endingPlayed) {
            console.log("[GameManager] _resumeGame: 发射 SHOW_MAIN_MENU");
            director.emit("SHOW_MAIN_MENU");
        } else {
            console.log("[GameManager] _resumeGame: 直接进入游戏");
            UIManager.instance.showGameUI();
            // 恢复物品栏
            const inventory = UIManager.instance.gameLayer?.getComponentInChildren(ItemInventory);
            if (inventory) {
                console.log("[GameManager] 调用 restoreInventory");
                inventory.restoreInventory();
            }
            this._enterGame();
        }
    }

    private _onIntroVideoComplete(): void {
        console.log("[GameManager] INTRO_VIDEO_COMPLETE received");
        const hasCutscene = DataManager.instance.getBool("HAS_INTRO_CUTSCENE");
        console.log("[GameManager] hasCutscene:", hasCutscene);

        if (hasCutscene) {
            console.log("[GameManager] 显示开场对话");
            UIManager.instance.hideVideoPlayer();
            UIManager.instance.showIntroCutscene();
        } else {
            console.log("[GameManager] 无开场对话，直接进入游戏");
            // 无开场对话，视频结束后直接进入游戏
            DataManager.instance.setIntroPlayed(true);
            DataManager.instance.saveGame("auto_save", true);
            UIManager.instance.showGameUI();
            this._enterGame();
        }
    }

    private _onIntroComplete(): void {
        // 整个开场（视频+对话）结束，进入游戏
        console.log("[GameManager] _onIntroComplete 开始");
        DataManager.instance.setIntroPlayed(true);
        DataManager.instance.saveGame("auto_save", true);
        UIManager.instance.hideIntroCutscene();
        console.log("[GameManager] _onIntroComplete: 调用 showGameUI");
        UIManager.instance.showGameUI();
        DataManager.instance.setCurrentScene("scene_bedroom");
        console.log("[GameManager] _onIntroComplete: 调用 _enterGame");
        this._enterGame();
    }

    private _onEndingComplete(): void {
        DataManager.instance.setEndingPlayed(true);
        DataManager.instance.saveGame("auto_save", true);

        // 结局动画播放完成，回主菜单
        director.emit("SHOW_MAIN_MENU");
    }

    private _enterGame(): void {
        const currentScene = DataManager.instance.getCurrentScene();
        console.log(`[GameManager] _enterGame 调用, currentScene: ${currentScene}`);
        if (currentScene && currentScene !== "") {
            console.log(`[GameManager] _enterGame: 调用 SceneViewManager.loadScene: ${currentScene}`);
            SceneViewManager.instance.loadScene(currentScene);
        } else {
            console.warn("[GameManager] _enterGame: 无当前场景数据!");
        }
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

        console.log(`[GameManager] _onLoadGame slotId: ${data?.slotId}`);
        console.log(`[GameManager] _onLoadGame data:`, data);
        const loaded = data?.slotId && DataManager.instance.loadGame(data.slotId);
        console.log(`[GameManager] loadGame result: ${loaded}`);

        if (loaded) {
            // 有存档，正常恢复游戏
            console.log("[GameManager] 有存档，执行 _resumeGame");
            this._resumeGame();
        } else {
            // 无存档，执行新游戏逻辑
            console.log("[GameManager] 没有找到存档，开始新游戏");
            DataManager.instance.startNewGame();
            console.log("[GameManager] 发射 INTRO_START");
            director.emit("INTRO_START");
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
        console.log(`[GameManager] INTERACTABLE_TRIGGERED changedFlags:`, result?.changedFlags);

        if (!result?.changedFlags?.length) {
            console.log("[GameManager] 没有 changedFlags，不存档");
            return;
        }

        // flag 变化时自动存档
        console.log("[GameManager] flag 变化，保存存档");
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
        console.log("[GameManager] _onSceneReady 保存存档");
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
