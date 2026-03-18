import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CloseTargetOnClick")
export class CloseTargetOnClick extends Component {
    @property(Node)
    public target: Node | null = null; // calendarClose

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick() {
        console.log("[CloseTargetOnClick] 点击 back -> 关闭目标节点");

        if (this.target) {
            this.target.active = false;
        }
    }
}
