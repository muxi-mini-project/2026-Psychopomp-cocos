import { _decorator, Component, director } from 'cc';
import { DataManager } from './DataManager';
import { SceneViewManager } from './SceneViewManager';
import { InventoryManager } from './InventoryManager';
import { DialogManager } from './DialogManager';
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
    /** flag检查列表（AND逻辑） */
    flags?: { name: string; value: boolean }[];
    /** 需要的物品 */
    requireItem?: string;
}

export interface InteractableResult {
    setFlags?: { name: string; value: boolean }[];
    pickItem?: string;
    consumeItem?: string;  // 消耗物品（从物品栏移除）
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
        director.on("ADD_ITEM_REQUEST", this._onAddItemRequest, this);
    }

    public handleClick(interactableId: string): void {
        const currentSceneId = SceneViewManager.instance.getCurrentSceneId();
        const config = this._getInteractableConfig(interactableId);
        console.log(`[InteractableManager] handleClick - interactableId: ${interactableId}, currentScene: ${currentSceneId}, config:`, config);
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

        // 检查 flags 条件列表（AND逻辑）
        if (condition.flags && condition.flags.length > 0) {
            for (const flagCheck of condition.flags) {
                const currentValue = DataManager.instance.getBool(flagCheck.name);
                if (currentValue !== flagCheck.value) {
                    return false;
                }
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
            console.log("[InteractableManager] 设置 flag:", result.setFlags);
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

        // 消耗物品（可消耗物品使用后移除）
        if (result.consumeItem) {
            console.log(`[InteractableManager] 消耗物品: ${result.consumeItem}`);
            DataManager.instance.removeItem(result.consumeItem);
        }

        // 切换场景
        if (result.switchScene) {
            console.log(`[InteractableManager] 切换场景: ${result.switchScene}`);
            triggerResult.switchedScene = result.switchScene;
            SceneViewManager.instance.switchToScene(result.switchScene);
        }

        // 自动触发对话（当 data 包含 dialogueId 时）
        if (result.data && typeof result.data.dialogueId === 'string') {
            DialogManager.instance.showDialogue(result.data.dialogueId);
        }

        return triggerResult;
    }

    private _emitResult(result: InteractableTriggerResult): void {
        console.log("[InteractableManager] _emitResult:", result);
        director.emit("INTERACTABLE_TRIGGERED", result);
    }

    private _onInteractableClick(data: string | { interactableId: string }): void {
        console.log("[InteractableManager] _onInteractableClick 收到数据:", data);
        // 兼容两种事件格式：直接传 string 或传 { interactableId: string }
        const interactableId = typeof data === 'string' ? data : data?.interactableId;
        if (!interactableId) {
            console.warn("[InteractableManager] INTERACTABLE_CLICK 事件缺少 interactableId");
            return;
        }
        console.log("[InteractableManager] 调用 handleClick:", interactableId);
        this.handleClick(interactableId);
    }

    private _onSetFlagRequest(data: { name: string; value: boolean }): void {
        if (data && data.name !== undefined) {
            DataManager.instance.setFlag(data.name, data.value ?? true);
        }
    }

    private _onAddItemRequest(data: { itemId: string }): void {
        if (data?.itemId) {
            DataManager.instance.addItem(data.itemId);
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
        director.off("ADD_ITEM_REQUEST", this._onAddItemRequest, this);
    }
}
