import { _decorator, Component, Label, Button, Color, tween, input, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('DiaryCube')
export class DiaryCube extends Component {

    @property(Label)
    displayLabel: Label = null

    private index = 0

    onLoad() {
        this.node.on('click', this.onClick, this)
    }

    onClick() {
        //放大后缩小
        tween(this.node)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start()
        this.index++
        if (this.index > 9) this.index = 0
        this.displayLabel.string = this.index.toString()
    }

}