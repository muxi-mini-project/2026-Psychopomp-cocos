import { _decorator, Component, director,Node } from "cc";
const { ccclass, property } = _decorator;
import {DataManager} from "../core/DataManager"

@ccclass('KeyInteractable')
export class KeyInteractable extends Component {
    private readonly itemId = "key"
    private readonly flagId = "PICK_KEY"

    onLoad () {
        if(DataManager.instance.getBool(this.flagId)){
            this.node.active = false
        }
    }

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END,this.onClick,this)
                console.log("KeyInteractable onEnable -> 注册监听,点击监听")
    }
    onDisable() {
        this.node.off(Node.EventType.TOUCH_END,this.onClick,this)
                console.log("KeyInteractable onDisable -> 取消监听，点击监听")
    }

    private onClick() {
        console.log(`[KeyInteractable] 收到点击事件emit INTERACTABLE_CLICK: ${this.itemId}`)
        director.emit("ADD_ITEM_REQUEST", { itemId: this.itemId })
        this.node.active = false
    }
   
}