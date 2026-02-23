import { _decorator, Component, Sprite, SpriteFrame, Vec3, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Slot')
export class Slot extends Component {
    @property({ type: Sprite, displayName: "图标节点" })
    public iconSprite: Sprite | null = null;

    // 确保物品栏框体永久显示
    onLoad() {
        this.node.active = true; // 强制激活框体
        const iconUITransform = this.iconSprite.node.getComponent(UITransform);
        if (iconUITransform) {
            iconUITransform.setAnchorPoint(0.5, 0.5); // 锚点居中
            this.iconSprite.node.setPosition(Vec3.ZERO); // 位置居中
        }
    }

    public get isEmpty(): boolean {
        return !this.iconSprite || !this.iconSprite.spriteFrame;
    }

    // 填充物品图标（仅改SpriteFrame，不隐藏节点）
    public fillIcon(icon: SpriteFrame | null) {
        if (!this.iconSprite) return;
        this.iconSprite.spriteFrame = icon;
        console.log(`[Slot] ${this.node.name} 图标填充：${!!icon}`);
        if (icon) {
            // 1. 强制居中（核心修复）
            const iconUITransform = this.iconSprite.node.getComponent(UITransform);
            const slotUITransform = this.node.getComponent(UITransform);
            if (iconUITransform && slotUITransform) {
                // 锚点居中
                iconUITransform.setAnchorPoint(0.5, 0.5);
                // 位置居中（物品栏正中心）
                this.iconSprite.node.setPosition(Vec3.ZERO);

                // 2. 自动缩放：按物品栏尺寸缩小图标
                const slotSize = slotUITransform.contentSize; // 获取物品栏框体尺寸（比如80x80）
                const iconTargetSize = {
                    width: slotSize.width * 0.5,
                    height: slotSize.height * 0.5
                }
                iconUITransform.setContentSize(iconTargetSize.width, iconTargetSize.height);

                console.log(`[Slot] ${this.node.name} 图标已居中缩放，尺寸：${iconTargetSize.width}x${iconTargetSize.height}`);
            }
        } else {
            // 清空时重置尺寸
            const iconUITransform = this.iconSprite.node.getComponent(UITransform);
            if (iconUITransform) {
                iconUITransform.setContentSize(60, 60);
            }
        }
    }
    public clearIcon() {
        this.fillIcon(null);
    }
}