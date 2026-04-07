import { _decorator, Component, Node } from "cc";
const { ccclass,property } = _decorator;

@ccclass("PhoneInteract")
export class PhoneInteract extends Component {
    @property(Node)
    private phoneCloseNode:Node = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END,this.onClick,this)
        console.log("PhoneInteract onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END,this.onClick,this)
        console.log("PhoneInteract onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log('PhoneInteract 点击节点 -> emit INTERACTABLE_CLICK: ${this.interactableId');
        if(this.phoneCloseNode){
           this.phoneCloseNode.active = true;
        }
    }
}
