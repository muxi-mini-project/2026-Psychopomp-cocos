import { _decorator, Component, director,Node } from "cc";
const { ccclass, property } = _decorator;
//import {dataManager} from "../manager/manager";
// const event = {
//     INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
//     INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
// }as const
@ccclass('KeyInteractable')
export class KeyInteractable extends Component {
    private readonly itemId = "point_key"

    onEnable() {
        //director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        this.node.on(Node.EventType.TOUCH_END,this.onClick,this)
                console.log("KeyInteractable onEnable -> 注册监听,点击监听")
    }
    onDisable() {
        //director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        this.node.off(Node.EventType.TOUCH_END,this.onClick,this)
                console.log("KeyInteractable onDisable -> 取消监听，点击监听")
    }

    private onClick() {
        console.log(`[KeyInteractable] 收到点击事件emit INTERACTABLE_CLICK: ${this.itemId}`)
        director.emit("ADD_ITEM_REQUEST", { itemId: this.itemId })
        this.node.active = false
        //director.emit(event.INTERACTABLE_CLICK, this.interactableId)
    }
    // private onTriggered(result: any) {
    //     console.log("[KeyInteractable] 收到交互事件", result);
    //     if (result.id !== this.interactableId){
    //         console.log(`[KeyInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
    //         return}
    //     switch (result?.code) {
    //         case "PICK_KEY":
    //             console.log("[KeyInteractable] 已完成弹窗")
    //             return
    //     }

    // }
}