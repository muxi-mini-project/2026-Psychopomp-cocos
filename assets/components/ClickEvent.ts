import { _decorator, Component, Node, Button, Enum } from 'cc';
import { ItemInventory } from './ItemInventory';
import { ItemData } from './ItemData';
import { ClickManager, InteractionType } from './ClickManager';

const { ccclass, property } = _decorator;

console.log('[全局验证] ClickEvent 脚本已加载！');

@ccclass('ClickEvent')
export class ClickEvent extends Component {

    // 这里是关键修复！！！
    @property({
        type: Enum(InteractionType),
        displayName: '交互类型'
    })
    public interactionType: InteractionType = InteractionType.TRIGGER_DIALOGUE;

    @property({ displayName: '关联ID' })
    public targetId: string = '';

    @property({ displayName: '目标类型' })
    public targetType: string = '';

    onLoad() {
        // 保留原有绑定代码
        let button = this.node.getComponent(Button);
        if (!button) {
            button = this.node.addComponent(Button);
            console.warn('[ClickEvent] 节点无Button组件，已自动添加 → 节点名：', this.node.name);
        }
        this.node.off(Button.EventType.CLICK, this.onClicked, this);
        this.node.on(Button.EventType.CLICK, this.onClicked, this);
        console.log('[ClickEvent] 按钮事件绑定完成 → 节点名：', this.node.name);
    }

    private onClicked() {
        console.log('[ClickEvent] 按钮被点击！→ 交互类型：', this.interactionType, '关联ID：', this.targetId);

        // 重新获取单例（关键！确保拿到最新初始化的单例）
        const manager = ClickManager.instance;
        if (!manager) {
            console.error('[ClickEvent] 错误：ClickManager 单例仍不存在！');
            return;
        }

        // 确认单例拿到后，打印日志
        console.log('[ClickEvent] 成功获取 ClickManager 单例 → 开始执行交互逻辑');

        switch (this.interactionType) {
            case InteractionType.SWITCH_SCENE:
                console.log('[ClickEvent] 调用场景切换 → 目标场景：', this.targetId);
                manager.onSwitchScene(this.targetId);
                break;
            case InteractionType.TRIGGER_DIALOGUE:
                manager.onTriggerDialogue(this.targetId);
                break;
            case InteractionType.PICK_ITEM:
                const itemData = this.node.getComponent(ItemData);
                if (itemData && itemData.isPickable) {
                    manager.onPickItem(itemData);
                } else {
                    console.error('[ClickEvent] 拾取物品失败：缺少ItemData或物品不可拾取 → 节点名：', this.node.name);
                }
                break;
            case InteractionType.USE_ITEM:
                manager.tryUseItemOnTarget(this.node, this.targetType);
                break;
            default:
                console.warn('[ClickEvent] 未处理的交互类型：', this.interactionType);
        }
    }
}