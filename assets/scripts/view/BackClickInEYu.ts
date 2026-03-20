import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackClickInEYu")
export class BackClickInEYu extends Component {
    @property(Node)
    public closeTarget: Node | null = null; 

    @property(Node)
    public openTarget: Node | null = null; 
    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick() {
        console.log("[CloseTargetOnClick] 点击 back -> 关闭目标节点");

        if (this.closeTarget) {
            this.closeTarget.active = false;
            this.openTarget.active = true;
        }
    }
}
