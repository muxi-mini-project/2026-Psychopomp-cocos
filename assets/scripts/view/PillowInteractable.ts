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
        director.on(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)
    }
    onDisable(){
        director.off(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)
    }
    private onTriggered(result:any){
        if(result?.interactableId !== this.interactableId)
            return
        switch(result?.code){
            case "OPEN_PILLOW":
                director.emit(event.SCENE_VISUAL,"codeYuanLiAriseBg")
                return
        }
    }


}
