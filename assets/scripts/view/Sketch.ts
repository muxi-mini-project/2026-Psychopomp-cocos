import { _decorator, Component, Label, Button, tween, Vec3, director, Node, input } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Sketch')
export class Sketch extends Component {

    @property(Node)
    sketchNode1: Node = null

    @property(Node)
    sketchNode01: Node = null

    @property(Node)
    sketchNode2: Node = null

    @property(Node)
    sketchNode02: Node = null

    onLoad() {
        this.sketchNode1.on('click', this.onClick1, this)
        this.sketchNode2.on('click', this.onClick2, this)
    }

    onClick1() {
        //移开
        tween(this.sketchNode1)
            .to(0.2, { position: new Vec3(-100, -30, 0) }, { easing: 'smooth' })
            .start()//位置待定

        tween(this.sketchNode01)
            .to(0.2, { position: new Vec3(-200, -50, 0) }, { easing: 'smooth' })
            .start()//位置待定
    }

    onClick2() {
        //放大后缩小
        tween(this.sketchNode2)
            .to(0.2, { position: new Vec3(80, 35, 0) }, { easing: 'smooth' })
            .start()//位置待定
        tween(this.sketchNode02)
            .to(0.2, { position: new Vec3(100, 85, 0) }, { easing: 'smooth' })
            .start()//位置待定
    }
}
