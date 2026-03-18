import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackInKey")
export class BackInKey extends Component {
    @property(Node)
    public target: Node | null = null; 
    @property(Node)
    public keyNode: Node | null = null; 

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick() {
        console.log("[BackInKeyOnClick] 点击 back -> 关闭目标节点");

        if (this.target && this.keyNode.active === false) {
            this.target.active = false;
        }
    }
}