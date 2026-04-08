import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HomeToNote")

export class HomeToNote extends Component {
    @property({ type: Node, tooltip: "备忘录节点" })
    public NoteNode: Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("HomeToNote开启监听");


    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("HomeToNote关闭监听");
    }
    onClicked() {
        if (this.NoteNode) {
            this.NoteNode.active = true;
            console.log("点击了备忘录 节点");

        }
    }
}