import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tips')
export class Tips extends Component {
    @property({ displayName: "提示文本" })
    public tipText: string = ""

    onLoad() {
        //Todo:弹出提示信息的逻辑
        //监听提示事件
        this.node.on("SHOW_TIP", this.showTip, this)
    }

    showTip(tip: string) {
        //Todo:不同提示信息的接收
        console.log("提示:", tip);
        this.tipText = tip;
        const uiOpacity = this.node.getComponent(UIOpacity);
        tween(uiOpacity)
            .to(0.5, { opacity: 255 })
            .delay(2)
            .to(0.5, { opacity: 0 })
            .start();
    }

    onDestroy() {
        this.node.off("SHOW_TIP", this.showTip, this)
    }
}


