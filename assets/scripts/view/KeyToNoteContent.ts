import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("KeyToNoteContent")

export class KeyToNoteContent extends Component {
    @property({ type: Node, tooltip: "备忘录的钥匙节点" })
    public keyNode: Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("KeyToNoteContent开启监听");


    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("KeyToNoteContent关闭监听");
    }
    onClicked() {
        if (this.keyNode) {
            this.keyNode.active = true;
            console.log("点击了备忘录钥匙节点");

        }
    }
}