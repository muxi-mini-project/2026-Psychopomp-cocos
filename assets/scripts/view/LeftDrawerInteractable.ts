import { _decorator,Component,director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED",
    SCENE_VISUAL:"SCENE_VISUAL"
}as const
@ccclass('LeftDrawerInteractable')
export class LeftDrawerInteractable extends Component {
    private readonly interactableId = "point_leftDrawer"

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    private onTriggered(result:any) {
        if(result.id !== this.interactableId) 
            return
        switch(result?.code){
            case "ENTER_LEFTDRAWER":
                director.emit(event.SCENE_VISUAL,"leftDrawerCloseBg")
                return
        }

    }


}