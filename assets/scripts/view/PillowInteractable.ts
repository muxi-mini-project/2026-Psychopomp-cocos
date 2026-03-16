import { _decorator,Component,director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED",
    SCENE_VISUAL:"SCENE_VISUAL"
}as const
@ccclass('PillowInteractable')
export class PillowInteractable extends Component {
    private readonly interactableId = "point_pillow"
    onEnable(){
        console.log("PillowInteractable onEnable -> 注册监听")
        director.on(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)
    }
    onDisable(){
        console.log("PillowInteractable onDisable -> 注销监听")
        director.off(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)
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
