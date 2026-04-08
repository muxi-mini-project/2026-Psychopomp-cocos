import { _decorator, Component, Label, Button, tween, Vec3, director } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PhoneLock')
export class PhoneLock extends Component {

    onLoad() {
        director.on("PHONE_PWD_FAIL", this.LabelActive, this)
        director.on("CLEAR_FAIL", this.LabelDeactive, this)
        this.node.active = false
    }

    LabelActive() {
        this.node.active = true
    }

    LabelDeactive() {
        console.log("隐藏提示")
        this.node.active = false
    }

    onDestroy() {
        director.off("PHONE_PWD_FAIL", this.LabelActive, this)
        director.off("CLEAR_FAIL", this.LabelDeactive, this)
    }
}