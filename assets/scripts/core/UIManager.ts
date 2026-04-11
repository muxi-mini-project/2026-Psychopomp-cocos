import { _decorator, Component, director, Node } from 'cc';
import { SceneViewManager } from './SceneViewManager';
import { IntroCutscene } from '../view/IntroCutscene';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    private static _instance: UIManager = null;

    @property(Node)
    fullscreenLayer: Node = null;

    @property(Node)
    gameLayer: Node = null;

    @property(Node)
    mainMenu: Node = null;

    @property(Node)
    pauseMenu: Node = null;

    @property(Node)
    gameOverScreen: Node = null;

    @property(Node)
    inventoryPanel: Node = null;

    @property(Node)
    dialogPanel: Node = null;

    @property(Node)
    videoPlayer: Node = null;

    @property(Node)
    introCutscene: Node = null;

    @property(Node)
    sceneContainer: Node = null;

    public static get instance(): UIManager {
        return this._instance;
    }

    onLoad() {
        if (UIManager._instance) {
            this.node.destroy();
            return;
        }
        UIManager._instance = this;
        director.addPersistRootNode(this.node);

        this._setupEventListeners();
        this._initUI();
    }

    private _setupEventListeners(): void {
        director.on("SHOW_FULLSCREEN", this.showFullscreenUI, this);
        director.on("HIDE_FULLSCREEN", this.hideFullscreenUI, this);
        director.on("SHOW_GAME_UI", this.showGameUI, this);
        director.on("HIDE_GAME_UI", this.hideGameUI, this);
        director.on("SHOW_MAIN_MENU", this.showMainMenu, this);
        director.on("HIDE_MAIN_MENU", this.hideMainMenu, this);
        director.on("SHOW_PAUSE_MENU", this.showPauseMenu, this);
        director.on("HIDE_PAUSE_MENU", this.hidePauseMenu, this);
        director.on("SHOW_GAME_OVER", this.showGameOver, this);
        director.on("HIDE_GAME_OVER", this.hideGameOver, this);
        director.on("INVENTORY_UPDATE", this.updateInventoryUI, this);
        director.on("INTRO_START", this.playVideo, this);
        director.on("DIALOGUE_START", this.showDialogUI, this);
        director.on("DIALOGUE_END", this.hideDialogUI, this);
        director.on("DIALOGUE_HIDE", this.hideDialogUI, this);
    }

    private _initUI(): void {
        this.fullscreenLayer.active = false;
        this.gameLayer.active = false;
    }

    public showFullscreenUI(): void {
        if (this.fullscreenLayer) {
            this.fullscreenLayer.active = true;
        }
        if (this.gameLayer) {
            this.gameLayer.active = false;
        }
    }

    public hideFullscreenUI(): void {
        if (this.fullscreenLayer) {
            this.fullscreenLayer.active = false;
        }
    }

    public showGameUI(): void {
        // 隐藏所有 fullscreen 层的内容
        if (this.fullscreenLayer) {
            this.fullscreenLayer.active = false;
        }
        if (this.videoPlayer) {
            this.videoPlayer.active = false;
        }
        if (this.introCutscene) {
            this.introCutscene.active = false;
        }

        // 显示游戏层
        if (this.gameLayer) {
            this.gameLayer.active = true;
        }
        if (this.inventoryPanel) {
            this.inventoryPanel.active = true;
        }
    }

    public hideGameUI(): void {
        if (this.gameLayer) {
            this.gameLayer.active = false;
        }
    }

    public showMainMenu(): void {
        console.log("[UIManager] showMainMenu called, fullscreenLayer:", this.fullscreenLayer, "mainMenu:", this.mainMenu);
        this.showFullscreenUI();
        if (this.mainMenu) {
            this.mainMenu.active = true;
        }
        // 隐藏游戏层相关内容
        if (this.gameLayer) {
            this.gameLayer.active = false;
        }
        if (this.inventoryPanel) {
            this.inventoryPanel.active = false;
        }
        // 清除场景预制体
        SceneViewManager.instance.clearScene();
    }

    public hideMainMenu(): void {
        if (this.mainMenu) {
            this.mainMenu.active = false;
        }
    }

    public showPauseMenu(): void {
        console.log("[UIManager] showPauseMenu called, gameLayer:", this.gameLayer, "pauseMenu:", this.pauseMenu);
        if (this.gameLayer) {
            this.gameLayer.active = true;
        }
        if (this.pauseMenu) {
            this.pauseMenu.active = true;
        }
    }

    public hidePauseMenu(): void {
        if (this.pauseMenu) {
            this.pauseMenu.active = false;
        }
    }


    public showGameOver(): void {
        this.showFullscreenUI();
        if (this.gameOverScreen) {
            this.gameOverScreen.active = true;
        }
    }

    public hideGameOver(): void {
        if (this.gameOverScreen) {
            this.gameOverScreen.active = false;
        }
    }

    public showIntroCutscene(): void {
        if (this.fullscreenLayer) {
            this.fullscreenLayer.active = true;
        }
        if (this.introCutscene) {
            this.introCutscene.active = true;
            // 重置并重新播放开场动画
            const cutsceneComp = this.introCutscene.getComponent(IntroCutscene);
            if (cutsceneComp) {
                cutsceneComp.resetAndPlay();
            }
        }
        if (this.gameLayer) {
            this.gameLayer.active = false;
        }
    }

    public hideIntroCutscene(): void {
        if (this.introCutscene) {
            this.introCutscene.active = false;
        }
        if (this.fullscreenLayer) {
            this.fullscreenLayer.active = false;
        }
    }

    public playVideo(videoId: string): void {
        console.log(`[UIManager] playVideo called, videoId: ${videoId}`);
        // 清除所有 fullscreen 层的内容
        if (this.videoPlayer) {
            this.videoPlayer.active = false;
        }
        if (this.introCutscene) {
            this.introCutscene.active = false;
        }
        if (this.fullscreenLayer) {
            this.fullscreenLayer.active = true;
        }
        if (this.gameLayer) {
            this.gameLayer.active = false;
        }

        // 播放新视频
        if (this.videoPlayer) {
            this.videoPlayer.active = true;
            console.log(`[UIManager] playVideo: 发射 VIDEO_PLAY, videoId: ${videoId}`);
            director.emit("VIDEO_PLAY", videoId);
        } else {
            console.log(`[UIManager] playVideo: videoPlayer 为空!`);
        }
    }

    public hideVideoPlayer(): void {
        if (this.videoPlayer) {
            this.videoPlayer.active = false;
        }
    }

    public hideVideoPlayer(): void {
        if (this.videoPlayer) {
            this.videoPlayer.active = false;
        }
    }

    public onVideoEnded(): void {
        director.emit("INTRO_VIDEO_COMPLETE");
    }

    public updateInventoryUI(): void {
        // 仅更新 UI，不应再次发出事件
        console.log("[UIManager] updateInventoryUI");
    }

    public showDialogUI(): void {
        if (this.gameLayer) {
            this.gameLayer.active = true;
        }
        if (this.dialogPanel) {
            this.dialogPanel.active = true;
        }
    }

    public hideDialogUI(): void {
        if (this.dialogPanel) {
            this.dialogPanel.active = false;
        }
    }

    onDestroy() {
        director.off("SHOW_FULLSCREEN", this.showFullscreenUI, this);
        director.off("HIDE_FULLSCREEN", this.hideFullscreenUI, this);
        director.off("SHOW_GAME_UI", this.showGameUI, this);
        director.off("HIDE_GAME_UI", this.hideGameUI, this);
        director.off("SHOW_MAIN_MENU", this.showMainMenu, this);
        director.off("HIDE_MAIN_MENU", this.hideMainMenu, this);
        director.off("SHOW_PAUSE_MENU", this.showPauseMenu, this);
        director.off("HIDE_PAUSE_MENU", this.hidePauseMenu, this);
        director.off("SHOW_GAME_OVER", this.showGameOver, this);
        director.off("HIDE_GAME_OVER", this.hideGameOver, this);
        director.off("INVENTORY_UPDATE", this.updateInventoryUI, this);
        director.off("INTRO_START", this.playVideo, this);
        director.off("DIALOGUE_START", this.showDialogUI, this);
        director.off("DIALOGUE_END", this.hideDialogUI, this);
        director.off("DIALOGUE_HIDE", this.hideDialogUI, this);
    }
}
