import { _decorator, Component, Label, tween, Vec3, director } from 'cc'
const { ccclass, property } = _decorator

@ccclass('DiaryCube')
export class DiaryCube extends Component {

    @property(Label)
    displayLabel: Label = null

    public index = 0

    onLoad() {
        this.node.on('click', this.onClick, this)
        this.displayLabel.string = this.index.toString()
        director.on("DIARY_CUBE_RESET", this.resetIndex, this)
    }

    resetIndex() {
        console.log("收到DIARY_CUBE_RESET事件，重置index")
        this.index = 0
        this.displayLabel.string = this.index.toString()
    }

    onClick() {
        //放大后缩小
        tween(this.node)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start()
        this.index++
        if (this.index > 9) this.index = 0
        console.log("当前index:", this.index)
        this.displayLabel.string = this.index.toString()
    }

    onDestroy() {
        this.node.off('click', this.onClick, this)
        director.off("DIARY_CUBE_RESET", this.resetIndex, this)
    }

}