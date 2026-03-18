import { _decorator, Component, director, Node, instantiate } from 'cc';
import { DataManager } from './DataManager';
import { ResourceManager } from './ResourceManager';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('SceneViewManager')
export class SceneViewManager extends Component {
    private static _instance: SceneViewManager = null;

    @property(Node)
    private currentSceneNode: Node = null;

    @property(Node)
    private preloadedScenesNode: Node = null;

    private _currentSceneId: string | null = null;
    private readonly _preloadedScenes: Map<string, Node> = new Map();
    private _transitioning: boolean = false;

    public static get instance(): SceneViewManager {
        return this._instance;
    }

    protected onLoad(): void {
        if (SceneViewManager._instance) {
            this.node.destroy();
            return;
        }
        SceneViewManager._instance = this;
        director.addPersistRootNode(this.node);
    }

    protected start(): void {
        this.initializeSceneNodes();
    }

    private initializeSceneNodes(): void {
        const container = UIManager.instance?.sceneContainer ?? this.node;

        if (!this.currentSceneNode) {
            this.currentSceneNode = new Node("CurrentScene");
            container.addChild(this.currentSceneNode);
        }
        if (!this.preloadedScenesNode) {
            this.preloadedScenesNode = new Node("PreloadedScenes");
            this.preloadedScenesNode.active = false;
            container.addChild(this.preloadedScenesNode);
        }
    }

    public initializeFromSave(): void {
        const currentScene = DataManager.instance.getCurrentScene();
        this.loadScene(currentScene);
        this.preloadAdjacentScenes(currentScene);
    }

    public loadScene(sceneId: string, onComplete?: () => void): void {
        this.clearCurrentScene();
        this.clearAllPreloadedScenes();

        const config = DataManager.instance.getSceneConfig(sceneId);
        if (!config) {
            console.error(`[SceneViewManager] 场景配置不存在: ${sceneId}`);
            return;
        }

        this._currentSceneId = sceneId;

        ResourceManager.instance.loadScene(sceneId).then((prefab) => {
            const node = instantiate(prefab);
            node.name = sceneId;
            this.currentSceneNode.addChild(node);
            this.emitSceneReady();
            onComplete?.();
        });
    }

    private emitSceneReady(): void {
        const flags = DataManager.instance.getAllFlags();
        director.emit("SCENE_READY", { sceneId: this._currentSceneId, flags });
    }

    public preloadScene(sceneId: string): Promise<void> {
        if (this._preloadedScenes.has(sceneId)) {
            return Promise.resolve();
        }
        if (this._currentSceneId === sceneId) {
            return Promise.resolve();
        }

        return ResourceManager.instance.loadScene(sceneId).then((prefab) => {
            const node = instantiate(prefab);
            node.name = sceneId;
            node.active = false;
            this.preloadedScenesNode.addChild(node);
            this._preloadedScenes.set(sceneId, node);
        });
    }

    public preloadAdjacentScenes(sceneId: string): void {
        const config = DataManager.instance.getSceneConfig(sceneId);
        const adjacentList = config?.preloadNext ?? [];
        adjacentList.forEach((id: string) => this.preloadScene(id));
    }

    public unloadPreloadedScene(sceneId: string): void {
        const node = this._preloadedScenes.get(sceneId);
        node?.destroy();
        this._preloadedScenes.delete(sceneId);
    }

    public switchToScene(sceneId: string): void {
        if (this._transitioning) return;
        if (this._currentSceneId === sceneId) return;

        this._transitioning = true;
        director.emit("SCENE_SWITCH_START", sceneId);

        if (!this._preloadedScenes.has(sceneId)) {
            this.preloadScene(sceneId).then(() => this.completeSwitch(sceneId));
        } else {
            this.completeSwitch(sceneId);
        }
    }

    private completeSwitch(sceneId: string): void {
        this.clearCurrentScene();

        const targetNode = this._preloadedScenes.get(sceneId);
        if (targetNode) {
            targetNode.parent = this.currentSceneNode;
            targetNode.active = true;
            this._preloadedScenes.delete(sceneId);
        }

        this._currentSceneId = sceneId;
        director.emit("SCENE_SWITCH_COMPLETE", sceneId);
        this.emitSceneReady();

        this._transitioning = false;
        this.preloadAdjacentScenes(sceneId);
    }

    public getCurrentSceneId(): string {
        return this._currentSceneId;
    }

    private clearCurrentScene(): void {
        this.currentSceneNode.removeAllChildren();
    }

    private clearAllPreloadedScenes(): void {
        this._preloadedScenes.forEach((node: Node) => node.destroy());
        this._preloadedScenes.clear();
        this.preloadedScenesNode.removeAllChildren();
    }

    private clearAllScenes(): void {
        this.clearCurrentScene();
        this.clearAllPreloadedScenes();
    }

    protected onDestroy(): void {
        this.clearAllScenes();
    }
}
