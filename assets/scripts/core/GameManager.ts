import { _decorator, Component, director } from 'cc';
import { ResourceManager } from './ResourceManager';
import { DataManager } from './DataManager';
import { SceneViewManager } from './SceneViewManager';
const { ccclass } = _decorator;

export enum GameState {
    INIT = "INIT",
    MENU = "MENU",
    INTRO_INTERACT = "INTRO_INTERACT",
    CUTSCENE = "CUTSCENE",
    GAMEPLAY = "GAMEPLAY",
    PAUSED = "PAUSED",
    DIALOGUE = "DIALOGUE",
    SUBSCENE = "SUBSCENE",
    GAME_OVER = "GAME_OVER"
}

export const GameEvent = {
    STATE_CHANGED: 'GAME_STATE_CHANGED'
};

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;
    private _currentState: GameState = GameState.INIT;
    private _initialized: boolean = false;

    public static get instance(): GameManager {
        return this._instance;
    }

    public get currentState(): GameState {
        return this._currentState;
    }

    public get isInputAllowed(): boolean {
        return this._currentState === GameState.GAMEPLAY ||
               this._currentState === GameState.DIALOGUE ||
               this._currentState === GameState.INTRO_INTERACT;
    }

    onLoad() {
        if (GameManager._instance) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
        director.addPersistRootNode(this.node);
    }

    start() {
        if (this._initialized) return;
        this._initialized = true;

        ResourceManager.instance.init(() => {
            this.setState(GameState.MENU);
        });
    }

    public setState(newState: GameState): void {
        if (this._currentState === newState) return;

        this._onExitState(this._currentState);
        const oldState = this._currentState;
        this._currentState = newState;

        director.emit(GameEvent.STATE_CHANGED, newState, oldState);
        this._onEnterState(newState);
    }

    private _onEnterState(state: GameState): void {
        switch (state) {
            case GameState.INIT:
                break;

            case GameState.MENU:
                director.emit("SHOW_FULLSCREEN");
                director.emit("SHOW_MAIN_MENU");
                break;

            case GameState.INTRO_INTERACT:
                director.emit("HIDE_FULLSCREEN");
                director.emit("SHOW_GAME_UI");
                break;

            case GameState.CUTSCENE:
                director.emit("HIDE_GAME_UI");
                break;

            case GameState.GAMEPLAY:
                director.emit("SHOW_GAME_UI");
                break;

            case GameState.DIALOGUE:
                director.emit("SHOW_GAME_UI");
                break;

            case GameState.SUBSCENE:
                break;

            case GameState.PAUSED:
                director.emit("SHOW_PAUSE_MENU");
                break;

            case GameState.GAME_OVER:
                director.emit("SHOW_GAME_OVER");
                break;
        }
    }

    private _onExitState(state: GameState): void {
        switch (state) {
            case GameState.MENU:
                director.emit("HIDE_MAIN_MENU");
                break;

            case GameState.PAUSED:
                director.emit("HIDE_PAUSE_MENU");
                break;

            case GameState.GAME_OVER:
                director.emit("HIDE_GAME_OVER");
                break;
        }
    }

    public startNewGame(): void {
        DataManager.instance.startNewGame();
        const sceneConfig = DataManager.instance.getSceneConfig("scene_intro");
        const startScene = sceneConfig?.startScene || "scene_intro";
        SceneViewManager.instance.loadScene(startScene);
    }

    public loadGame(slotId: string): boolean {
        if (DataManager.instance.loadGame(slotId)) {
            const sceneId = DataManager.instance.getCurrentScene();
            SceneViewManager.instance.loadScene(sceneId);
            return true;
        }
        return false;
    }

    public pause(): void {
        this.setState(GameState.PAUSED);
    }

    public resume(): void {
        this.setState(GameState.GAMEPLAY);
    }

    public quitToMenu(): void {
        this.setState(GameState.MENU);
    }
}
