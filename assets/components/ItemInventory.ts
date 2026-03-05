import { _decorator, Component, director, Node, Sprite } from 'cc'
const { ccclass, property } = _decorator
import { Slot } from './Slot'

@ccclass('ItemInventory')
export class ItemInventory extends Component {
    @property({ type: Node })
    slots: Node[] = []

    onLoad() {
        //监听拾取道具事件
        director.on('PICK_UP_ITEM', this.onPickupItem, this)
    }

    //判断物品栏是否空闲，若有空位则添加物品图标
    onPickupItem(data: { itemId: string, iconSprite: Sprite }) {
        for (let i = 0; i < this.slots.length; i++) {
            const slotNode = this.slots[i]
            const slot = slotNode.getComponent(Slot)

            if (slot && slot.isEmpty()) {
                const iconNode = new Node('ItemIcon')
                const sprite = iconNode.addComponent(Sprite)
                sprite.spriteFrame = data.iconSprite.spriteFrame
                iconNode.setParent(slotNode)
                iconNode.setScale(1, 1, 1)
                slot.setItemIcon(iconNode, data.itemId)
                director.emit('ITEM_ADDED', {
                    itemId: data.itemId,
                    iconNode: iconNode
                })
                return
            }
        }
        console.log('物品栏已满！')
    }
}