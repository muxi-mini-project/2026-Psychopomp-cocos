import { _decorator, Component, director, Node } from 'cc';
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
    menuPanel: Node = null;

    @property(Node)
    dialogPanel: Node = null;

    @property(Node)
    videoPlayer: Node = null;

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

        // 对话系统事件
        director.on("DIALOGUE_START", this.showDialogUI, this);
        director.on("DIALOGUE_END", this.hideDialogUI, this);
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
        if (this.gameLayer) {
            this.gameLayer.active = true;
        }
        if (this.fullscreenLayer) {
            this.fullscreenLayer.active = false;
        }

        this._showInventoryPanel();
        this._showMenuPanel();
    }

    public hideGameUI(): void {
        if (this.gameLayer) {
            this.gameLayer.active = false;
        }
    }

    public showMainMenu(): void {
        this.showFullscreenUI();
        if (this.mainMenu) {
            this.mainMenu.active = true;
        }
    }

    public hideMainMenu(): void {
        if (this.mainMenu) {
            this.mainMenu.active = false;
        }
    }

    public showPauseMenu(): void {
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

    public playVideo(videoId: string): void {
        this.showFullscreenUI();
        if (this.videoPlayer) {
            // TODO: 视频播放器组件
            // const videoComp = this.videoPlayer.getComponent(VideoPlayer);
            // videoComp.play(videoId);
        }
    }

    public onVideoEnded(): void {
        director.emit("CUTSCENE_END");
    }

    public updateInventoryUI(): void {
        if (this.inventoryPanel) {
            // TODO: 物品栏UI组件
            // const items = InventoryManager.instance.getInventoryList();
            // this.inventoryPanel.updateItems(items);
        }
    }

    private _showInventoryPanel(): void {
        if (this.inventoryPanel) {
            this.inventoryPanel.active = true;
        }
    }

    private _showMenuPanel(): void {
        if (this.menuPanel) {
            this.menuPanel.active = true;
        }
    }

    public showDialogUI(): void {
        if (this.dialogPanel) {
            this.dialogPanel.active = true;
        }
    }

    public hideDialogUI(): void {
        if (this.dialogPanel) {
            this.dialogPanel.active = false;
        }
    }

    public showToast(message: string): void {
        // TODO: 提示组件
        console.log(`[Toast] ${message}`);
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

        // 对话系统事件清理
        director.off("DIALOGUE_START", this.showDialogUI, this);
        director.off("DIALOGUE_END", this.hideDialogUI, this);
    }
}
