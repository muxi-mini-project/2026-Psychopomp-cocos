import { _decorator, Component, Sprite, SpriteFrame, tween, Vec3, director } from 'cc'
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
        // 点击放大动画（保留，手感更好）
        tween(this.node)
            .to(0.1, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.1, { scale: Vec3.ONE })
            .start()

        // 数字 +1，0-9循环
        this.index++
        if (this.index > 9) this.index = 0

        // 直接切换图片，无滚动
        this.updateSprite()
    }

    // 直接切换当前数字贴图
    updateSprite() {
        if (this.numberSprite && this.numberFrames[this.index]) {
            this.numberSprite.spriteFrame = this.numberFrames[this.index]
        }
    }

    onDestroy() {
        this.node.off('click', this.onClick, this)
        director.off("DIARY_CUBE_RESET", this.resetIndex, this)
    }
}