import { _decorator, Component, director,Node } from "cc";
const { ccclass, property} = _decorator;


@ccclass("LeftDrawerInteractable")
export class LeftDrawerInteractable extends Component {
    @property(Node)
    public leftDrawerCloseNode:Node|null = null;
    private readonly interactableId = "point_leftDrawer";

    onEnable() {
        //director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("LeftDrawerInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        //director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("LeftDrawerInteractable onDisable -> 移除监听，点击监听");
    }

    private onClicked() {
        console.log('LeftDrawerInteractable onClicked -> 点击事件 emit INTERACTABLE_CLICK: ${this.interactableId}');
        if (this.leftDrawerCloseNode) {
            this.leftDrawerCloseNode.active =  true
        }
        //director.emit(event.INTERACTABLE_CLICK, this.interactableId);
    }

    
}
