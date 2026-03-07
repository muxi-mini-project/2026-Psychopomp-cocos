import { _decorator, Component, director, Prefab, SpriteFrame, resources, assetManager, JsonAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    private static _instance: ResourceManager = null;

    private _loadProgress: number = 0;
    private _isLoading: boolean = false;
    private _loadedScenes: Set<string> = new Set();
    private _loadedVideos: Set<string> = new Set();

    public static get instance(): ResourceManager {
        return this._instance;
    }

    onLoad() {
        if (ResourceManager._instance) {
            this.node.destroy();
            return;
        }
        ResourceManager._instance = this;
        director.addPersistRootNode(this.node);
    }

    public init(onComplete: () => void): void {
        this._loadProgress = 0;
        this._isLoading = true;

        resources.loadDir('data', (err, assets) => {
            if (err) {
                console.error("[ResourceManager] 核心配置加载失败", err);
                this._isLoading = false;
                return;
            }

            this._loadProgress = 1;
            this._isLoading = false;
            console.log("[ResourceManager] 核心配置加载完成");

            if (onComplete) {
                onComplete();
            }
        });
    }

    public preloadScene(sceneId: string, onComplete: () => void): void {
        if (this._loadedScenes.has(sceneId)) {
            console.log(`[ResourceManager] 场景已加载: ${sceneId}`);
            if (onComplete) {
                onComplete();
            }
            return;
        }

        this._loadProgress = 0;
        this._isLoading = true;

        resources.load(`prefabs/scenes/${sceneId}`, Prefab, (err, asset) => {
            if (err) {
                console.error(`[ResourceManager] 场景预加载失败: ${sceneId}`, err);
                this._isLoading = false;
                return;
            }

            this._loadedScenes.add(sceneId);
            this._loadProgress = 1;
            this._isLoading = false;
            console.log(`[ResourceManager] 场景预加载完成: ${sceneId}`);

            if (onComplete) {
                onComplete();
            }
        });
    }

    public loadScene(sceneId: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load(`prefabs/scenes/${sceneId}`, Prefab, (err, asset) => {
                if (err) {
                    console.error(`[ResourceManager] 场景加载失败: ${sceneId}`, err);
                    reject(err);
                    return;
                }

                this._loadedScenes.add(sceneId);
                resolve(asset as Prefab);
            });
        });
    }

    public loadBackground(bgPath: string): Promise<SpriteFrame> {
        return new Promise((resolve, reject) => {
            resources.load(`textures/backgrounds/${bgPath}`, SpriteFrame, (err, asset) => {
                if (err) {
                    console.error(`[ResourceManager] 背景加载失败: ${bgPath}`, err);
                    reject(err);
                    return;
                }
                resolve(asset as SpriteFrame);
            });
        });
    }

    public releaseScene(sceneId: string): void {
        if (this._loadedScenes.has(sceneId)) {
            const path = `prefabs/scenes/${sceneId}`;
            assetManager.resources.release(path);
            this._loadedScenes.delete(sceneId);
            console.log(`[ResourceManager] 场景资源已释放: ${sceneId}`);
        }
    }

    public loadVideo(videoId: string, onComplete: () => void): void {
        if (this._loadedVideos.has(videoId)) {
            console.log(`[ResourceManager] 视频已加载: ${videoId}`);
            if (onComplete) {
                onComplete();
            }
            return;
        }

        this._loadProgress = 0;
        this._isLoading = true;

        resources.load(`videos/${videoId}`, (err, asset) => {
            if (err) {
                console.error(`[ResourceManager] 视频加载失败: ${videoId}`, err);
                this._isLoading = false;
                return;
            }

            this._loadedVideos.add(videoId);
            this._loadProgress = 1;
            this._isLoading = false;
            console.log(`[ResourceManager] 视频加载完成: ${videoId}`);

            if (onComplete) {
                onComplete();
            }
        });
    }

    public releaseVideo(videoId: string): void {
        if (this._loadedVideos.has(videoId)) {
            const path = `videos/${videoId}`;
            assetManager.resources.release(path);
            this._loadedVideos.delete(videoId);
            console.log(`[ResourceManager] 视频资源已释放: ${videoId}`);
        }
    }

    public getLoadProgress(): number {
        return this._loadProgress;
    }

    public loadConfig<T>(path: string, onComplete: (data: T) => void): void {
        resources.load(`data/${path}`, JsonAsset, (err, asset) => {
            if (err) {
                console.error(`[ResourceManager] 配置加载失败: ${path}`, err);
                return;
            }
            onComplete(asset.json as T);
        });
    }

    public isLoading(): boolean {
        return this._isLoading;
    }

    public isSceneLoaded(sceneId: string): boolean {
        return this._loadedScenes.has(sceneId);
    }

    public isVideoLoaded(videoId: string): boolean {
        return this._loadedVideos.has(videoId);
    }

    onDestroy() {
        this._loadedScenes.clear();
        this._loadedVideos.clear();
    }
}
