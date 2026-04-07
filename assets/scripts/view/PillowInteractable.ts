import { _decorator,Component,director,Node } from "cc";
import { DataManager } from "../core/DataManager";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
} as const;

@ccclass('PillowInteractable')
export class PillowInteractable extends Component {
   
    private readonly interactableId = "point_pillow"

    onEnable(){
        if (DataManager.instance.getBool("PILLOW_MOVED")) {
            this.node.active = false
        } 
        director.on(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)  
        this.node.on(Node.EventType.TOUCH_END,this.onClick,this)     
        console.log("PillowInteractable onEnable -> 注册监听,点击监听")
    }

    onDisable(){
        director.off(event.INTERACTABLE_TRIGGERED,this.onTriggered,this) 
        this.node.off(Node.EventType.TOUCH_END,this.onClick,this)
        console.log("PillowInteractable onDisable -> 注销监听，点击监听")
    }

    private onClick(){
        console.log('PillowInteractable 点击节点 -> emit INTERACTABLE_CLICK: ${this.interactableId}')
        this.node.active = false
    }

    private onTriggered(result:any){
        console.log("PillowInteractable onTriggered -> 触发交互",result)

        if(result?.interactableId !== this.interactableId){
            console.log('[PillowInteractable]交互对象不匹配:current=${result?.interactableId},target=${this.interactableId}')
        }

        switch (result?.code) {
            case "OPEN_PILLOW":
            console.log("[PillowInteractable]触发 OPEN_PILLOW -> 移开枕头")
            return
        }
    }


}
