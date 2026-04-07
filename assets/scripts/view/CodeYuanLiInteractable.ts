import { _decorator, Component, Node } from "cc";
const { ccclass , property } = _decorator;

@ccclass("CodeYuanLiInteractable")
export class CodeYuanLiInteractable extends Component {
    @property(Node)
    public CodeYuanLiNode: Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("CodeYuanLiInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("CodeYuanLiInteractable onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log('CodeYuanLiInteractable onClick -> 点击事件，emit INTERACTABLE_CLICK: ${this.interactableId}');
        if(this.CodeYuanLiNode){
            this.CodeYuanLiNode.active = true;
        }
    }
}

