import { _decorator,Component,director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED",
    UI_TOAST:"UI_TOAST",
    UI_OPEN:"UI_OPEN",
    UI_MODAL:"UI_MODAL",
}as const
@ccclass('FrameInteractable')
export class FrameInteractable extends Component {
    private readonly interactableId = "point_frame"
    onEnable(){
        director.on(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)
    }
     onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)
    }
    private onTriggered(result:any){
        if(result?.id !== this.interactableId)
            return
        switch(result?.code){
            case "LOCKED_FRAME":
                 director.emit(event.UI_TOAST,"请先解锁手机")
                 return
            case"OPEN_FRAME_WITHOUT_KEY":
                director.emit(event.UI_OPEN,"frameCloseWithoutKeyBg")
                return
            case "OPEN_FRAME_WITH_KEY":
                director.emit(event.UI_OPEN,"frameOpenWithKeyBg")
                return
        }

    }

}