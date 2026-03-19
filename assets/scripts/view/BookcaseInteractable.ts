import { _decorator, Component, director, Node, EventTouch } from "cc";
const { ccclass, property } = _decorator;
import { TwoBooksPopController } from "./TwoBooksPopController";


@ccclass("BookcaseInteractable")
export class BookcaseInteractable extends Component {

    @property(TwoBooksPopController)
    public popupController: TwoBooksPopController | null = null;
    private readonly interactableId = "point_bookcase";


    onEnable() {
        //director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this.onclick, this)
        console.log("BookcaseInteractable onEnable -> 注册监听 点击节点");
    }

    onDisable() {
        //director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this.onclick, this)
        console.log("BookcaseInteractable onDisable -> 移除监听");
    }
    private onclick() {
        // director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId });
        if (!this.popupController) {
            console.error("[BookcaseInteractable] popupController 没有绑定");
            return;
        }
        this.popupController.openOptions();
        console.log(`BookcaseInteractable onclick -> 点击节点: ${this.interactableId}`)
    }

    
}
