import { _decorator, Component, director, Node, instantiate } from 'cc';
import { DataManager } from './DataManager';
import { ResourceManager } from './ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('SceneViewManager')
export class SceneViewManager extends Component {
    private static _instance: SceneViewManager = null;

    @property(Node)
    currentSceneNode: Node = null;

    @property(Node)
    nextSceneNode: Node = null;

    @property(Node)
    transitionNode: Node = null;

    private _currentSceneId: string | null = null;
    private _currentSubsceneId: string | null = null;
    private _preloadedSceneId: string | null = null;
    private _transitioning: boolean = false;

    public static get instance(): SceneViewManager {
        return this._instance;
    }

    onLoad() {
        if (SceneViewManager._instance) {
            this.node.destroy();
            return;
        }
        SceneViewManager._instance = this;
        director.addPersistRootNode(this.node);

        if (!this.currentSceneNode) {
            this.currentSceneNode = new Node("CurrentScene");
            this.node.addChild(this.currentSceneNode);
        }
        if (!this.nextSceneNode) {
            this.nextSceneNode = new Node("NextScene");
            this.nextSceneNode.active = false;
            this.node.addChild(this.nextSceneNode);
        }
        if (!this.transitionNode) {
            this.transitionNode = new Node("Transition");
            this.transitionNode.active = false;
            this.node.addChild(this.transitionNode);
        }
    }

    public loadScene(sceneId: string): void {
        this._clearAllScenes();

        const config = DataManager.instance.getSceneConfig(sceneId);
        if (!config) {
            console.error(`[SceneViewManager] 场景配置不存在: ${sceneId}`);
            return;
        }

        this._currentSceneId = sceneId;
        this._currentSubsceneId = null;

        ResourceManager.instance.loadScene(sceneId).then((prefab) => {
            const node = instantiate(prefab);
            node.name = sceneId;
            this.currentSceneNode.addChild(node);
            director.emit("SCENE_LOAD_COMPLETE", sceneId);
        });
    }

    public preloadSceneForSwitch(sceneId: string): void {
        if (this._preloadedSceneId === sceneId) return;

        ResourceManager.instance.loadScene(sceneId).then((prefab) => {
            this._clearNextScene();
            const node = instantiate(prefab);
            node.name = sceneId;
            this.nextSceneNode.addChild(node);
            this.nextSceneNode.active = false;
            this._preloadedSceneId = sceneId;
        });
    }

    public switchToScene(sceneId: string, transitionType: string = "fade"): void {
        if (this._transitioning) return;

        const currentId = this._currentSceneId;
        if (currentId === sceneId) return;

        this._transitioning = true;
        director.emit("SCENE_SWITCH_START", sceneId);

        if (this._preloadedSceneId !== sceneId) {
            this.preloadSceneForSwitch(sceneId);
        }

        director.emit("TRANSITION_OUT_START");
        this._doTransitionOut(() => {
            this._completeSwitch(sceneId, transitionType);
        });
    }

    private _completeSwitch(sceneId: string, transitionType: string): void {
        this._clearCurrentScene();

        this.nextSceneNode.children.forEach(child => {
            child.parent = this.currentSceneNode;
            child.active = true;
        });
        this.nextSceneNode.active = false;

        this._currentSceneId = sceneId;
        this._currentSubsceneId = null;
        this._preloadedSceneId = null;

        director.emit("SCENE_SWITCH_COMPLETE", sceneId);

        director.emit("TRANSITION_IN_START");
        this._doTransitionIn(() => {
            this._transitioning = false;
            this.preloadNextScenes();
        });
    }

    private _doTransitionOut(onComplete: () => void): void {
        this.transitionNode.active = true;
        director.emit("TRANSITION_OUT", onComplete);
    }

    private _doTransitionIn(onComplete: () => void): void {
        this.transitionNode.active = true;
        director.emit("TRANSITION_IN", onComplete);
    }

    public enterSubscene(subsceneId: string): void {
        const sceneConfig = DataManager.instance.getSceneConfig(this._currentSceneId);
        const subscene = sceneConfig?.subscenes?.find((s: any) => s.id === subsceneId);

        if (!subscene) {
            console.warn(`[SceneViewManager] 子场景不存在: ${subsceneId}`);
            return;
        }

        this._currentSubsceneId = subsceneId;
        DataManager.instance.enterSubscene(subsceneId);

        director.emit("SUBSCENE_ENTER", subsceneId);

        ResourceManager.instance.loadScene(subscene.prefab).then((prefab) => {
            this._clearNextScene();
            const node = instantiate(prefab);
            node.name = subsceneId;
            this.nextSceneNode.addChild(node);
            this.nextSceneNode.active = true;
            this.currentSceneNode.active = false;
        });
    }

    public exitSubscene(): void {
        if (!this._currentSubsceneId) return;

        director.emit("SUBSCENE_EXIT", this._currentSubsceneId);

        this.nextSceneNode.active = false;
        this.currentSceneNode.active = true;
        this._clearNextScene();

        this._currentSubsceneId = null;
        DataManager.instance.exitSubscene();
    }

    public getCurrentSceneId(): string {
        return this._currentSceneId;
    }

    public isInSubscene(): boolean {
        return this._currentSubsceneId !== null;
    }

    public getCurrentSubsceneId(): string | null {
        return this._currentSubsceneId;
    }

    public preloadNextScenes(): void {
        const config = DataManager.instance.getSceneConfig(this._currentSceneId);
        const preloadList = config?.preloadNext || [];

        preloadList.forEach((sceneId: string) => {
            if (sceneId !== this._preloadedSceneId) {
                this.preloadSceneForSwitch(sceneId);
            }
        });
    }

    private _clearCurrentScene(): void {
        this.currentSceneNode.removeAllChildren();
    }

    private _clearNextScene(): void {
        this.nextSceneNode.removeAllChildren();
    }

    private _clearAllScenes(): void {
        this._clearCurrentScene();
        this._clearNextScene();
    }

    onDestroy() {
        this._clearAllScenes();
    }
}
