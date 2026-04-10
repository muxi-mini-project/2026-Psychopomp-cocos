import { _decorator, Component, Sprite, Color, tween, director, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Sketch')
export class Sketch extends Component {

    @property(Node)
    sketchNode1: Node = null

    @property(Node)
    sketchNode2: Node = null

    @property(Node)
    writing: Node = null

    onLoad() {
        this.sketchNode1.on('click', this.onClick1, this)
        this.sketchNode2.on('click', this.onClick2, this)
    }

    onClick1() {
        // 淡出动画播完 再隐藏
        tween(this.sketchNode1.getComponent(Sprite))
            .to(0.5, { color: new Color(255, 255, 255, 0) })
            .call(() => {
                this.sketchNode1.active = false
                this.checkAllSketchHidden()
            })
            .start()
    }

    onClick2() {
        tween(this.sketchNode2.getComponent(Sprite))
            .to(0.5, { color: new Color(255, 255, 255, 0) })
            .call(() => {
                this.sketchNode2.active = false
                this.checkAllSketchHidden()
            })
            .start()
    }

    checkAllSketchHidden() {
        if (!this.sketchNode1.active && !this.sketchNode2.active) {
            this.writing.on('click', this.onClickWriting, this)
        }
    }

    onClickWriting() {
        console.log('writing appear')
        director.emit('writing_appear')
    }
}