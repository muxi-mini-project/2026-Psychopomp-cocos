import { _decorator, Component, Label, Button, tween, Vec3, director } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PhoneLock')
export class PhoneLock extends Component {

    onLoad() {
        director.on("FAIL", this.LabelActive, this)
        director.on("CLEAR_FAIL", this.LabelDeactive, this)
        console.log("PhoneLock onLoad,监听FAIL事件")
        this.node.active = false
    }

    LabelActive() {
        console.log("收到FAIL事件，显示提示")
        this.node.active = true
    }

    LabelDeactive() {
        console.log("隐藏提示")
        this.node.active = false
    }

    onDestroy() {
        director.off("FAIL", this.LabelActive, this)
        director.off("CLEAR_FAIL", this.LabelDeactive, this)
    }
}