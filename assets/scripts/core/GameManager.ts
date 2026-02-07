import { _decorator, Component, Node, director, game, Game } from 'cc';
// import { DataManager } from './DataManager'; 
// import { UIManager } from '../ui/UIManager';

const { ccclass, property } = _decorator;


export enum GameState {
    INIT = "INIT",           // 初始化（加载资源）
    MENU = "MENU",           // 主菜单/标题界面
    CUTSCENE = "CUTSCENE",   // 剧情动画中（如手托蝴蝶，不可操作）
    GAMEPLAY = "GAMEPLAY",   // 正常解谜游戏
    PAUSED = "PAUSED",       // 暂停（打开设置界面）
    DIALOGUE = "DIALOGUE",   // 对话中（点击仅用于过文字）
    GAME_OVER = "GAME_OVER"  // 结局
}


export const GameEvent = {
    STATE_CHANGED: 'GAME_STATE_CHANGED'
};

@ccclass('GameManager')
export class GameManager extends Component {
    
    // 单例模式
    private static _instance: GameManager = null;

    public static get instance(): GameManager {
        if (!this._instance) {
            console.error("GameManager 尚未初始化！请确保它挂载在初始场景的根节点上。");
        }
        return this._instance;
    }

    private _currentState: GameState = GameState.INIT;

    public get currentState(): GameState {
        return this._currentState;
    }

    onLoad() {
        if (GameManager._instance === null) {
            GameManager._instance = this;

            director.addPersistRootNode(this.node);
            
            console.log("[GameManager] 初始化成功，已设为常驻节点。");
        } else {
            console.warn("[GameManager] 检测到重复实例，正在销毁...");
            this.node.destroy();
            return;
        }

        this.initManagers();
    }

    start() {
        // 游戏启动，默认进入菜单
        this.setState(GameState.MENU);
    }

    private initManagers() {
        console.log("[GameManager] 正在初始化子系统...");
        // DataManager.instance.init();
        // AudioManager.instance.init();
    }

    /**
     * 切换游戏状态的唯一入口
     * @param newState 目标状态
     */
    public setState(newState: GameState) {
        if (this._currentState === newState) return;

        this.onExitState(this._currentState);

        const oldState = this._currentState;
        this._currentState = newState;
        console.log(`[GameManager] 状态切换: ${oldState} -> ${newState}`);

        this.onEnterState(newState);

        // 发送全局事件，通知 UI 和 场景脚本
        director.emit(GameEvent.STATE_CHANGED, newState);
    }

    /**
     * 处理进入某个状态时的逻辑
     */
    private onEnterState(state: GameState) {
        switch (state) {
            case GameState.INIT:
                // TODO: 开始预加载资源
                break;
            case GameState.MENU:
                // TODO: 显示主菜单 UI
                // UIManager.instance.showMenu();
                break;
            case GameState.CUTSCENE:
                // TODO: 禁用玩家操作，隐藏 HUD
                console.log("进入动画模式，禁止交互");
                break;
            case GameState.GAMEPLAY:
                // TODO: 允许操作，显示道具栏
                console.log("进入游戏模式，允许交互");
                break;
            case GameState.PAUSED:
                // TODO: 冻结时间，弹出暂停窗
                break;
        }
    }

    /**
     * 处理退出某个状态时的逻辑
     */
    private onExitState(state: GameState) {
        switch (state) {
            case GameState.MENU:
                // TODO: 隐藏主菜单
                break;
            case GameState.CUTSCENE:
                // TODO: 动画结束，恢复某些设置
                break;
            // ...
        }
    }

    public get isInputAllowed(): boolean {
        return this._currentState === GameState.GAMEPLAY || this._currentState === GameState.DIALOGUE;
    }
}