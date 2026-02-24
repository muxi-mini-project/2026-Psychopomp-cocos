import { _decorator, Component, director, Node } from 'cc';
import { Interactable } from '../components/Interactable';
const { ccclass } = _decorator;

@ccclass('InteractableManager')
export class InteractableManager extends Component {
    private static _instance: InteractableManager = null;
    private _interactables: Map<string, Node> = new Map();

    public static get instance(): InteractableManager {
        return this._instance;
    }

    onLoad() {
        if (InteractableManager._instance) {
            this.node.destroy();
            return;
        }
        InteractableManager._instance = this;
        director.addPersistRootNode(this.node);

        director.on("INTERACTABLE_CLICK", this._onInteractableClick, this);
    }

    public registerInteractable(node: Node, id: string, type: string): void {
        this._interactables.set(id, node);

        // 通过 Interactable 组件设置属性
        const interactable = node.getComponent('Interactable') as unknown as Interactable;
        if (interactable) {
            interactable.setInteractableId(id);
            interactable.interactableType = type;
        }
    }

    public handleClick(interactableId: string): void {
        const config = this._getInteractableConfig(interactableId);
        if (!config) return;

        const type = config.type;

        switch (type) {
            case "dialogue":
                DialogManager.instance.showDialogue(config.dialogueId);
                break;

            case "pick_item":
                DataManager.instance.addItem(config.itemId);
                break;

            case "scene_switch":
                SceneViewManager.instance.switchToScene(config.targetScene);
                break;

            case "subscene":
                SceneViewManager.instance.enterSubscene(config.targetSubscene);
                break;

            case "animation":
                director.emit("PLAY_ANIMATION", config.animation);
                break;

            case "custom":
                director.emit(config.eventName, config.eventData);
                break;
        }

        director.emit("INTERACTABLE_CLICKED", interactableId);
    }

    public setState(interactableId: string, state: any): void {
        DataManager.instance.setInteractableState(interactableId, state);
    }

    public getState(interactableId: string): any {
        return DataManager.instance.getInteractableState(interactableId);
    }

    public show(interactableId: string): void {
        const node = this._interactables.get(interactableId);
        if (node) node.active = true;
    }

    public hide(interactableId: string): void {
        const node = this._interactables.get(interactableId);
        if (node) node.active = false;
    }

    private _onInteractableClick(interactableId: string): void {
        this.handleClick(interactableId);
    }

    private _getInteractableConfig(interactableId: string): any {
        const sceneConfig = DataManager.instance.getSceneConfig(
            SceneViewManager.instance.getCurrentSceneId()
        );
        if (!sceneConfig?.interactables) return null;

        const isSubscene = SceneViewManager.instance.isInSubscene();
        const subscenes = sceneConfig.subscenes || [];
        let targetList = sceneConfig.interactables;

        if (isSubscene) {
            const subsceneId = SceneViewManager.instance.getCurrentSubsceneId();
            const subscene = subscenes.find((s: any) => s.id === subsceneId);
            targetList = subscene?.interactables || [];
        }

        return targetList.find((i: any) => i.id === interactableId);
    }

    onDestroy() {
        director.off("INTERACTABLE_CLICK", this._onInteractableClick, this);
        this._interactables.clear();
    }
}

import { DataManager } from './DataManager';
import { DialogManager } from './DialogManager';
import { SceneViewManager } from './SceneViewManager';
