import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('StoryManager')
export class StoryManager extends Component {
    private static _instance: StoryManager = null;
    private _currentChapterId: string = "";
    private _currentNodeId: string = "";
    private _chapterConfig: any = null;

    public static get instance(): StoryManager {
        return this._instance;
    }

    onLoad() {
        if (StoryManager._instance) {
            this.node.destroy();
            return;
        }
        StoryManager._instance = this;
        director.addPersistRootNode(this.node);
    }

    public startChapter(chapterId: string): void {
        ResourceManager.instance.loadConfig(`chapters`, (config: any) => {
            const chapter = config.chapters?.[chapterId];
            if (!chapter) {
                console.error(`[StoryManager] 章节不存在: ${chapterId}`);
                return;
            }

            this._chapterConfig = chapter;
            this._currentChapterId = chapterId;
            this._currentNodeId = chapter.nodes?.[0]?.id || "";

            DataManager.instance.setCurrentChapter(chapterId);
            director.emit("CHAPTER_STARTED", chapterId);
            console.log(`[StoryManager] 章节开始: ${chapterId}`);
        });
    }

    public advance(triggerEvent?: string): void {
        if (!this._chapterConfig || !this._currentNodeId) return;

        const nodes = this._chapterConfig.nodes;
        const currentNode = nodes.find((n: any) => n.id === this._currentNodeId);
        if (!currentNode?.onComplete) return;

        const nextNodeId = currentNode.onComplete;
        this._executeNode(nextNodeId);
    }

    private _executeNode(nodeId: string): void {
        if (nodeId === "chapter_complete") {
            this._completeChapter();
            return;
        }

        const nodes = this._chapterConfig.nodes;
        const node = nodes.find((n: any) => n.id === nodeId);
        if (!node) {
            console.warn(`[StoryManager] 节点不存在: ${nodeId}`);
            return;
        }

        this._currentNodeId = nodeId;
        DataManager.instance.setCurrentStoryNode(nodeId);
        director.emit("STORY_NODE_STARTED", nodeId);

        switch (node.type) {
            case "scene_load":
                SceneViewManager.instance.loadScene(node.targetScene);
                break;

            case "cutscene":
                ResourceManager.instance.loadVideo(node.video, () => {
                    director.emit("CUTSCENE_END");
                });
                break;

            case "dialogue":
                DialogManager.instance.showDialogue(node.dialogueId);
                break;

            case "flag_set":
                DataManager.instance.setFlag(node.flag, node.value);
                break;

            case "wait":
                this._waitForCondition(node);
                break;
        }
    }

    private _waitForCondition(node: any): void {
        if (node.waitType === "flag") {
            const checkFlag = () => {
                if (DataManager.instance.getBool(node.flag)) {
                    director.off("FLAG_CHANGED", checkFlag);
                    this.advance();
                }
            };
            director.on("FLAG_CHANGED", checkFlag);
        } else {
            this.advance();
        }
    }

    private _completeChapter(): void {
        director.emit("CHAPTER_COMPLETED", this._currentChapterId);
        this._currentChapterId = "";
        this._currentNodeId = "";
        this._chapterConfig = null;
    }

    public jumpToNode(nodeId: string): void {
        this._executeNode(nodeId);
    }

    public getCurrentChapter(): string {
        return this._currentChapterId;
    }

    public getCurrentNode(): string {
        return this._currentNodeId;
    }

    public getFlag(key: string, defaultValue?: any): any {
        return DataManager.instance.getFlag(key, defaultValue);
    }

    public setFlag(key: string, value: any): void {
        DataManager.instance.setFlag(key, value);
        director.emit("FLAG_CHANGED", key, value);
    }
}

import { ResourceManager } from './ResourceManager';
import { SceneViewManager } from './SceneViewManager';
import { DialogManager } from './DialogManager';
import { DataManager } from './DataManager';
