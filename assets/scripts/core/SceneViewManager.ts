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
        console.log(`[SceneViewManager] initializeSceneNodes container: ${container?.name}, sceneContainer: ${UIManager.instance?.sceneContainer?.name}`);

        if (!this._currentSceneNode) {
            this._currentSceneNode = new Node("CurrentScene");
            container.addChild(this._currentSceneNode);
            console.log(`[SceneViewManager] _currentSceneNode 已创建，父节点: ${container?.name}`);
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
        console.log(`[SceneViewManager] loadScene 开始: ${sceneId}`);
        this._clearAllScenes();

        const config = DataManager.instance.getSceneConfig(sceneId);
        if (!config) {
            console.error(`[SceneViewManager] 场景配置不存在: ${sceneId}`);
            return;
        }

        console.log(`[SceneViewManager] 加载 prefab: ${config.prefab}`);
        this._currentSceneId = sceneId;
        DataManager.instance.setCurrentScene(sceneId);

        ResourceManager.instance.loadScene(config.prefab).then((prefab) => {
            console.log(`[SceneViewManager] prefab 加载成功: ${config.prefab}`);
            const node = instantiate(prefab);
            node.name = sceneId;
            this._currentSceneNode.addChild(node);

            // 预加载相邻场景
            this.preloadNextScenes();

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
        if (this._preloadedSceneMap.has(sceneId)) {
            console.log(`[SceneViewManager] preloadSceneForSwitch: ${sceneId} 已在缓存中`);
            return;
        }

        const config = DataManager.instance.getSceneConfig(sceneId);
        const prefabPath = config?.prefab || sceneId;
        console.log(`[SceneViewManager] preloadSceneForSwitch: 开始预加载 ${sceneId}, path: ${prefabPath}`);

        ResourceManager.instance.loadScene(prefabPath).then((prefab) => {
            const node = instantiate(prefab);
            node.name = sceneId;
            console.log(`[SceneViewManager] 预加载实例化: ${sceneId}, children: ${node.children?.length}, active: ${node.active}`);
            this._preloadedSceneMap.set(sceneId, node);
        }).catch((err) => {
            console.error(`[SceneViewManager] 预加载失败: ${sceneId}`, err);
        });
    }

    public switchToScene(sceneId: string): void {
        console.log(`[SceneViewManager] switchToScene: ${sceneId}`);
        if (this._transitioning) {
            console.log(`[SceneViewManager] 正在切换中，忽略`);
            return;
        }
        if (this._currentSceneId === sceneId) {
            console.log(`[SceneViewManager] 已是当前场景: ${sceneId}`);
            return;
        }

        this._transitioning = true;
        director.emit("SCENE_SWITCH_START", sceneId);

        const config = DataManager.instance.getSceneConfig(sceneId);
        const prefabPath = config?.prefab || sceneId;
        console.log(`[SceneViewManager] prefabPath: ${prefabPath}`);

        let node: Node | null = null;

        if (this._preloadedSceneMap.has(sceneId)) {
            console.log(`[SceneViewManager] 从预加载缓存获取: ${sceneId}`);
            node = this._preloadedSceneMap.get(sceneId);
        } else {
            console.log(`[SceneViewManager] 异步加载 prefab: ${prefabPath}`);
            ResourceManager.instance.loadScene(prefabPath).then((prefab) => {
                console.log(`[SceneViewManager] prefab 加载成功，开始实例化`);
                node = instantiate(prefab);
                node.name = sceneId;
                this._doSwitch(sceneId, node);
            }).catch((err) => {
                console.error(`[SceneViewManager] 异步加载失败: ${prefabPath}`, err);
                this._transitioning = false;
            });
            return;
        }

        this._doSwitch(sceneId, node);
    }

    private _doSwitch(sceneId: string, node: Node): void {
        console.log(`[SceneViewManager] _doSwitch 开始: ${sceneId}, node: ${node}`);
        console.log(`[SceneViewManager] _currentSceneNode: ${this._currentSceneNode?.name}, parent: ${this._currentSceneNode?.parent?.name}`);
        this._clearCurrentScene();
        node.parent = this._currentSceneNode;
        console.log(`[SceneViewManager] 节点已添加，node.parent: ${node.parent?.name}, children count: ${this._currentSceneNode?.children?.length}`);
        node.active = true;
        console.log(`[SceneViewManager] node.active = true, node.children: ${node.children?.length}`);

        this._currentSceneId = sceneId;
        DataManager.instance.setCurrentScene(sceneId);  // 同步到存档
        this._preloadedSceneMap.delete(sceneId);

        director.emit("SCENE_SWITCH_COMPLETE", sceneId);
        this._emitSceneReady();

        this._transitioning = false;
        console.log(`[SceneViewManager] _doSwitch 完成`);
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

    public clearScene(): void {
        this._clearCurrentScene();
    }

    private _clearAllScenes(): void {
        this._clearCurrentScene();
    }

    onDestroy() {
        this._clearAllScenes();
    }
}
