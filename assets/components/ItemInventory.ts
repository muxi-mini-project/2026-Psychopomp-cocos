import { _decorator, Component, Node, Sprite, Color, Vec3 } from 'cc';
import { ItemData } from './ItemData';
import { Slot } from './Slot';
import { ClickManager } from './ClickManager';
const { ccclass, property } = _decorator;

@ccclass('ItemInventory')
export class ItemInventory extends Component {
    @property({ type: [Slot], displayName: "固定物品栏" })
    public fixedSlots: Slot[] = [];

    onLoad() {
        // 1. 强制背包根节点显示在屏幕右侧（自动适配画布）
        this.node.active = true;
        // 2. 遍历所有物品栏，强制加背景+激活+定位
        this.fixedSlots.forEach((slot, index) => {
            // 强制激活
            slot.node.active = true;
            slot.clearIcon(); // 确保初始状态为空
            // 强制添加Sprite组件（背景）
            let slotSprite = slot.node.getComponent(Sprite);
            if (!slotSprite) {
                slotSprite = slot.node.addComponent(Sprite);
            }
            console.log(`[Inventory] 物品栏${index + 1}已常驻：${slot.node.name}，位置：${slot.node.getWorldPosition()}`);
        });
    }

    // 拾取物品：填充到第一个空物品栏
    public pickItem(itemData: ItemData): boolean {
        if (!itemData || !itemData.icon) {
            console.error("[Inventory] 物品图标为空！请给物品的ItemData绑定SpriteFrame");
            return false;
        }

        // 找第一个空物品栏
        const emptySlot = this.fixedSlots.find(slot => slot.isEmpty);
        if (!emptySlot) {
            console.log("[Inventory] 物品栏已满！");
            return false;
        }

        // 填充图标（物品栏框体已常驻，仅改图标）
        emptySlot.fillIcon(itemData.icon);
        // 隐藏场景物品
        itemData.node.active = false;
        itemData.isPickable = false;
        console.log(`[Inventory] 物品填充到${emptySlot.node.name}`);
        return true;
    }
    public removeItem(itemData: ItemData): boolean {
        const slot = this.fixedSlots.find(s =>
            s.iconSprite?.spriteFrame === itemData.icon
        );
        if (slot) {
            slot.clearIcon();
            return true;
        }
        return false;
    }

    // 物品栏点击事件（绑定到每个slot的Button）
    public onSlotClick(slot: Slot) {
        if (slot.isEmpty) return;
        // 从slot的spriteFrame反推出ItemData（或直接在slot中存ItemData引用）
        const itemData = this.getItemDataFromSlot(slot);
        if (itemData) {
            ClickManager.instance?.selectItemForUse(itemData);
        }
    }

    private getItemDataFromSlot(slot: Slot): ItemData | null {
        // 这里可以根据项目结构实现，例如：
        // 1. slot中直接引用ItemData
        // 2. 或通过spriteFrame的name去全局查找
        return null;
    }
}