import { _decorator, Component, Node, Button, Color, Sprite, director, log, error } from 'cc';
import { ItemInventory } from './ItemInventory';
import { ItemData } from './ItemData';

const { ccclass, property } = _decorator;

export enum InteractionType {
    PICK_ITEM = 'PICK_ITEM',//物品拾取
    TRIGGER_DIALOGUE = 'TRIGGER_DIALOGUE',//触发对话
    USE_ITEM = 'USE_ITEM',//使用道具
    SWITCH_SCENE = 'SWITCH_SCENE'//场景切换
}
console.log('[全局验证] ClickManager 脚本已加载！');

@ccclass('ClickManager')
export class ClickManager extends Component {
    // 单例模式，方便全局调用
    public static instance: ClickManager | null = null;

    @property(ItemInventory)
    public inventory: ItemInventory | null = null;

    // 当前选中的道具（用于物品栏使用逻辑）
    private selectedItem: ItemData | null = null;
    onLoad() {
        console.log('[ClickManager] 开始初始化 → 当前节点名：', this.node.name);

        // 修复：先判断单例是否为 null，再检查节点是否相同
        if (ClickManager.instance && ClickManager.instance !== this) {
            console.warn('[ClickManager] 发现重复节点，销毁当前节点 → 节点名：', this.node.name);
            this.node.destroy();
        } else {
            ClickManager.instance = this;
            // 设为常驻节点，跨场景不销毁
            director.addPersistRootNode(this.node);
            console.log('[ClickManager] 单例初始化成功！instance：', ClickManager.instance);
        }
    }
    //物品拾取点击
    public onPickItem(itemData: ItemData) {
        if (!this.inventory) return;
        this.inventory.pickItem(itemData);
    }

    //剧情节点点击
    public onTriggerDialogue(dialogueId: string) {
        console.log(`触发剧情：${dialogueId}`);
        // 这里调用你的 DialogueManager 显示对话
        // DialogueManager.instance?.showDialogue(dialogueId);
    }

    //物品栏使用点击
    public selectItemForUse(itemData: ItemData) {
        this.selectedItem = itemData;
        console.log(`选中道具：${itemData.itemName}`);
    }

    public tryUseItemOnTarget(targetNode: Node, targetType: string) {
        if (!this.selectedItem) {
            console.log('未选中任何道具');
            return;
        }
        console.log(`尝试使用${this.selectedItem.itemName}在${targetNode.name}上，目标类型：${targetType}`);
        // 这里你可以添加具体的使用逻辑，比如根据targetType判断是否匹配，触发不同的效果等
        // 使用后清除选中状态
        this.selectedItem = null;
    }

    //场景切换点击
    public onSwitchScene(sceneName: string) {
        log(`[ClickManager] 尝试直接加载场景: ${sceneName}`);

        // 直接调用加载API，不依赖构建列表，用于测试
        director.loadScene(sceneName, (err) => {
            if (err) {
                error(`[ClickManager] 加载场景失败:`, err);
                // 如果失败，尝试用绝对路径加载，比如 'assets/scenes/start_scene.scene'
                director.loadScene('assets/scenes/start_scene.scene', (err2) => {
                    if (err2) {
                        error(`[ClickManager] 用绝对路径也失败了:`, err2);
                    }
                });
            } else {
                log(`[ClickManager] 场景 ${sceneName} 加载成功！`);
            }
        });
    }
}