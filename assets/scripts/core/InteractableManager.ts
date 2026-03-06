import { _decorator, Component, director, Node } from 'cc';
import { Interactable } from '../components/Interactable';
import { DataManager } from './DataManager';
import { SceneViewManager } from './SceneViewManager';
import { InventoryManager } from './InventoryManager';
const { ccclass } = _decorator;

export interface InteractableConfig {
    id: string;
    states: InteractableState[];
}

export interface InteractableState {
    id: string;
    condition?: InteractableCondition;
    result: InteractableResult;
}

export interface InteractableCondition {
    flag?: string;
    flagValue?: boolean;
    requireItem?: string;
}

export interface InteractableResult {
    setFlags?: { name: string; value: boolean }[];
    pickItem?: string;
    switchScene?: string;
    code: string;
    data?: any;
}

export interface InteractableTriggerResult {
    interactableId: string;
    stateId: string;
    code: string;
    data?: any;
    changedFlags?: { name: string; value: boolean }[];
    pickedItem?: string;
    switchedScene?: string;
}

@ccclass('InteractableManager')
export class InteractableManager extends Component {
    private static _instance: InteractableManager = null;
    private _interactables: Map<string, Node> = new Map();

    public static get instance(): InteractableManager {
        return this._instance;
    }

    protected onLoad(): void {
        if (InteractableManager._instance) {
            this.node.destroy();
            return;
        }
        InteractableManager._instance = this;
        director.addPersistRootNode(this.node);

        director.on("INTERACTABLE_CLICK", this._onInteractableClick, this);
        director.on("SET_FLAG_REQUEST", this._onSetFlagRequest, this);
    }

    public registerInteractable(node: Node, id: string): void {
        this._interactables.set(id, node);

        const interactable = node.getComponent('Interactable') as unknown as Interactable;
        if (interactable) {
            interactable.setInteractableId(id);
        }
    }

    public unregisterInteractable(id: string): void {
        this._interactables.delete(id);
    }

    public handleClick(interactableId: string): void {
        const config = this._getInteractableConfig(interactableId);
        if (!config || !config.states || config.states.length === 0) {
            console.warn(`[InteractableManager] 交互点配置不存在或无状态: ${interactableId}`);
            return;
        }

        const matchingState = this._findMatchingState(config);
        if (!matchingState) {
            console.warn(`[InteractableManager] 未找到匹配状态: ${interactableId}`);
            return;
        }

        const result = this._executeResult(matchingState.result, interactableId, matchingState.id);

        this._emitResult(result);
    }

    private _findMatchingState(config: InteractableConfig): InteractableState | null {
        for (const state of config.states) {
            if (this._checkCondition(state.condition)) {
                return state;
            }
        }
        return null;
    }

    private _checkCondition(condition?: InteractableCondition): boolean {
        if (!condition) return true;

        // 检查 flag 条件
        if (condition.flag !== undefined) {
            const currentValue = DataManager.instance.getBool(condition.flag);
            const expectedValue = condition.flagValue ?? true;
            if (currentValue !== expectedValue) {
                return false;
            }
        }

        // 检查物品条件
        if (condition.requireItem) {
            const selectedItem = InventoryManager.instance.getSelectedItem();
            if (selectedItem !== condition.requireItem) {
                return false;
            }
        }

        return true;
    }

    private _executeResult(result: InteractableResult, interactableId: string, stateId: string): InteractableTriggerResult {
        const triggerResult: InteractableTriggerResult = {
            interactableId,
            stateId,
            code: result.code,
            data: result.data,
            changedFlags: [],
        };

        // 设置 flag
        if (result.setFlags && result.setFlags.length > 0) {
            for (const flag of result.setFlags) {
                DataManager.instance.setFlag(flag.name, flag.value);
                triggerResult.changedFlags!.push(flag);
            }
        }

        // 拾取物品
        if (result.pickItem) {
            DataManager.instance.addItem(result.pickItem);
            triggerResult.pickedItem = result.pickItem;
        }

        // 切换场景
        if (result.switchScene) {
            triggerResult.switchedScene = result.switchScene;
        }

        return triggerResult;
    }

    private _emitResult(result: InteractableTriggerResult): void {
        director.emit("INTERACTABLE_TRIGGERED", result);
    }

    private _onInteractableClick(interactableId: string): void {
        this.handleClick(interactableId);
    }

    private _onSetFlagRequest(data: { name: string; value: boolean }): void {
        if (data && data.name !== undefined) {
            DataManager.instance.setFlag(data.name, data.value ?? true);
        }
    }


    private _getInteractableConfig(interactableId: string): InteractableConfig | null {
        const sceneConfig = DataManager.instance.getSceneConfig(
            SceneViewManager.instance.getCurrentSceneId()
        );
        if (!sceneConfig?.interactables) return null;

        return sceneConfig.interactables.find((i: { id: string }) => i.id === interactableId) as InteractableConfig ?? null;
    }

    protected onDestroy(): void {
        director.off("INTERACTABLE_CLICK", this._onInteractableClick, this);
        director.off("SET_FLAG_REQUEST", this._onSetFlagRequest, this);
        this._interactables.clear();
    }
}
