import { _decorator, Component, director, Vec3, tween, Node, Sprite } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Slot')
export class Slot extends Component {
    @property
    itemId: string = ""

    @property(Node)
    bgNode: Node | null = null

    ItemIcon: Node | null = null

    originalScale: Vec3 = new Vec3(1, 1, 1)
    originalColor: any = null

    isSelected = false
    currentTween: any = null

    onLoad() {
        this.originalScale = new Vec3(1, 1, 1)
        this.node.on('click', this.onItemClick, this)
    }

    //Todo:获取物品图标组件
    setItemIcon(iconNode: Node, itemId: string) {
        this.ItemIcon = iconNode
        this.itemId = itemId
        this.originalScale = iconNode.scale.clone()
    }


    onItemClick() {
        if (!this.ItemIcon) return //没有图标就不响应点击
        if (this.isSelected) {
            this.isSelected = false
            director.emit("ITEM_DESELECTED", this.itemId)
            if (this.currentTween) this.currentTween.stop()

            tween(this.ItemIcon)
                .to(0.18, { scale: this.originalScale.clone() })
                .start()

        } else {
            this.isSelected = true

            this.playSelectAnimation(() => {
                director.emit("ITEM_SELECTED", this.itemId)
            })
        }
    }

    playSelectAnimation(callback?: Function) {
        if (this.currentTween) this.currentTween.stop()

        this.currentTween = tween(this.ItemIcon)
            .to(0.18, { scale: new Vec3(1.28, 1.28, 1.28) })
            .call(() => {
                this.startBreathAnimation()
                if (callback) callback()
            })
            .start()
    }

    startBreathAnimation() {
        this.currentTween = tween(this.ItemIcon)
            .to(0.8, { scale: new Vec3(1.25, 1.25, 1.25) })
            .to(0.8, { scale: new Vec3(1.28, 1.28, 1.28) })
            .union()
            .repeatForever()
            .start()
    }


    //物品使用后销毁节点
    destroyItemIcon() {
        if (this.currentTween) this.currentTween.stop()
        //Todo:接受销毁节点的通知并执行销毁逻辑
        this.ItemIcon.destroy()
        this.ItemIcon = null
        this.isSelected = false
        director.emit("ITEM_USED", this.itemId)//通知系统物品已使用
    }
    isEmpty() {
        return this.ItemIcon === null
    }
}