import { _decorator,Component,director,Node } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK:"INTERACTABLE_CLICK",
    SCENE_VISUAL:"SCENE_VISUAL"
}as const
@ccclass('PillowInteractable')
export class PillowInteractable extends Component {
    private readonly interactableId = "point_pillow"
    onEnable(){
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
        director.emit(event.INTERACTABLE_CLICK,this.interactableId)
    }
    private onTriggered(result:any){
        console.log("PillowInteractable onTriggered -> 触发交互",result)
        if(result?.interactableId !== this.interactableId){
            console.log('[PillowInteractable]交互对象不匹配:current=${result?.interactableId},target=${this.interactableId}')
        }
        switch(result?.code){
            case "OPEN_PILLOW":
            console.log("[PillowInteractable]触发 OPEN_PILLOW -> 打开枕头")
                director.emit(event.SCENE_VISUAL,"codeYuanLiAriseBg")
                console.log("[PillowInteractable] 已切换贴图 枕头特写")
                return
        }
    }


}
