import { _decorator,Component,director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED",
    SCENE_VISUAL:"SCENE_VISUAL"
}as const
@ccclass('BedInteractable')
export class BedInteractable extends Component {
    private readonly interactableId = "point_bed"
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
            case "ENTER_BED":
                director.emit(event.SCENE_VISUAL,"bedCloseBg")
                return
        }
    }


}
