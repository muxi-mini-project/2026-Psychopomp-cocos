import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HomeToWeiXin")

export class HomeToWeiXin extends Component {
    @property({ type: Node, tooltip: "微信节点" })
    public weixinNode: Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("HomeToWeiXin开启监听");


    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("HomeToWeiXin关闭监听");
    }
    onClicked() {
        if (this.weixinNode) {
            this.weixinNode.active = true;
            console.log("点击了微信节点");

        }
    }
}