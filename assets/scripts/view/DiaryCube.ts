import { _decorator, Component, Sprite, SpriteFrame, tween, Vec3, director, Node, UITransform } from 'cc'
const { ccclass, property } = _decorator

@ccclass('DiaryCube')
export class DiaryCube extends Component {

    @property(Sprite)
    numberSprite: Sprite = null

    @property(SpriteFrame)
    numberFrames: SpriteFrame[] = []

    public index = 0

    onLoad() {
        this.node.on('click', this.onClick, this)
        this.updateSprite()
        director.on("DIARY_CUBE_RESET", this.resetIndex, this)
    }

    resetIndex() {
        this.index = 0
        this.updateSprite()
    }

    getNumber() {
        return this.index;
    }

    onClick() {
        // 点击缩放动画
        tween(this.node)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start()

        // 数字 +1
        const oldIndex = this.index
        this.index++
        if (this.index > 9) this.index = 0

        // 滚动切换效果
        this.playRollAnimation(oldIndex, this.index)
    }

    playRollAnimation(oldIdx: number, newIdx: number) {
        if (!this.numberSprite || !this.numberFrames[oldIdx] || !this.numberFrames[newIdx]) return

        const sprNode = this.numberSprite.node
        const uiTransform = sprNode.getComponent(UITransform)
        if (!uiTransform) return

        const h = uiTransform.height

        // 显示旧图
        this.numberSprite.spriteFrame = this.numberFrames[oldIdx]

        // 创建临时节点
        const tempNode = new Node()
        const tempUi = tempNode.addComponent(UITransform)
        const tempSpr = tempNode.addComponent(Sprite)

        tempSpr.spriteFrame = this.numberFrames[newIdx]
        tempUi.setContentSize(uiTransform.contentSize)
        tempNode.setPosition(0, h, 0)
        sprNode.parent.addChild(tempNode)

        // 旧图滑出
        tween(sprNode)
            .to(0.25, { position: new Vec3(0, -h, 0) })
            .start()

        // 新图滑入
        tween(tempNode)
            .to(0.25, { position: new Vec3(0, 0, 0) })
            .call(() => {
                this.numberSprite.spriteFrame = this.numberFrames[newIdx]
                sprNode.setPosition(Vec3.ZERO)
                tempNode.destroy()
            })
            .start()
    }

    updateSprite() {
        if (this.numberSprite && this.numberFrames[this.index]) {
            this.numberSprite.spriteFrame = this.numberFrames[this.index]
            this.numberSprite.node.setPosition(Vec3.ZERO)
        }
    }

    onDestroy() {
        this.node.off('click', this.onClick, this)
        director.off("DIARY_CUBE_RESET", this.resetIndex, this)
    }
}