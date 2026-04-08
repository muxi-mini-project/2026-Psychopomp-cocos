import { _decorator, Component, director, Node, instantiate } from 'cc';
import { DataManager } from './DataManager';
import { ResourceManager } from './ResourceManager';
import { UIManager } from './UIManager';
const { ccclass } = _decorator;

@ccclass('SceneViewManager')
export class SceneViewManager extends Component {
    private static _instance: SceneViewManager = null;

    private _currentSceneNode: Node = null;
    private _currentSceneId: string | null = null;
    private _preloadedSceneMap: Map<string, Node> = new Map();
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
    }

    protected start(): void {
        this.initializeSceneNodes();
    }

    private initializeSceneNodes(): void {
        const container = UIManager.instance?.sceneContainer ?? this.node;

        if (!this._currentSceneNode) {
            this._currentSceneNode = new Node("CurrentScene");
            container.addChild(this._currentSceneNode);
        }
    }

    /**
     * 从存档初始化场景（游戏启动时调用）
     */
    public initializeFromSave(): void {
        const currentScene = DataManager.instance.getCurrentScene();
        if (!currentScene || currentScene === "") {
            console.log("[SceneViewManager] 当前无场景（开场阶段）");
            return;
        }
        this.loadScene(currentScene);

        // 预加载相邻场景（不阻塞）
        this.preloadNextScenes();
    }

    public loadScene(sceneId: string, onComplete?: () => void): void {
        this._clearAllScenes();

        const config = DataManager.instance.getSceneConfig(sceneId);
        if (!config) {
            console.error(`[SceneViewManager] 场景配置不存在: ${sceneId}`);
            return;
        }

        this._currentSceneId = sceneId;
        DataManager.instance.setCurrentScene(sceneId);

        ResourceManager.instance.loadScene(sceneId).then((prefab) => {
            const node = instantiate(prefab);
            node.name = sceneId;
            this._currentSceneNode.addChild(node);

            // 发送 SCENE_READY 事件，包含当前 flag
            this._emitSceneReady();

            if (onComplete) {
                onComplete();
            }
        });
    }

    /**
     * 发送 SCENE_READY 事件
     */
    private _emitSceneReady(): void {
        const flags = DataManager.instance.getAllFlags();
        director.emit("SCENE_READY", {
            sceneId: this._currentSceneId,
            flags: flags,
        });
    }

    public preloadSceneForSwitch(sceneId: string): void {
        if (this._preloadedSceneMap.has(sceneId)) return;

        ResourceManager.instance.loadScene(sceneId).then((prefab) => {
            const node = instantiate(prefab);
            node.name = sceneId;
            this._preloadedSceneMap.set(sceneId, node);
        });
    }

    public switchToScene(sceneId: string): void {
        if (this._transitioning) return;
        if (this._currentSceneId === sceneId) return;

        this._transitioning = true;
        director.emit("SCENE_SWITCH_START", sceneId);

        let node: Node | null = null;

        if (this._preloadedSceneMap.has(sceneId)) {
            node = this._preloadedSceneMap.get(sceneId);
        } else {
            ResourceManager.instance.loadScene(sceneId).then((prefab) => {
                node = instantiate(prefab);
                node.name = sceneId;
                this._doSwitch(sceneId, node);
            });
            return;
        }

        this._doSwitch(sceneId, node);
    }

    private _doSwitch(sceneId: string, node: Node): void {
        this._clearCurrentScene();
        node.parent = this._currentSceneNode;
        node.active = true;

        this._currentSceneId = sceneId;
        this._preloadedSceneMap.delete(sceneId);

        director.emit("SCENE_SWITCH_COMPLETE", sceneId);
        this._emitSceneReady();

        this._transitioning = false;
        this.preloadNextScenes();
    }

    public getCurrentSceneId(): string {
        return this._currentSceneId;
    }

    public preloadNextScenes(): void {
        const config = DataManager.instance.getSceneConfig(this._currentSceneId);
        const preloadList = config?.preloadNext || [];

        this._preloadedSceneMap.clear();

        preloadList.forEach((sceneId: string) => {
            this.preloadSceneForSwitch(sceneId);
        });
    }

    private _clearCurrentScene(): void {
        this._currentSceneNode.removeAllChildren();
    }

    private _clearAllScenes(): void {
        this._clearCurrentScene();
    }

    onDestroy() {
        this._clearAllScenes();
    }
}
