import { _decorator,Component,director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED",
    UI_TOAST:"UI_TOAST",
    UI_OPEN:"UI_OPEN",
    SCENE_VISUAL:"SCENE_VISUAL"
}as const
@ccclass('RightDrawerInteractable')
export class RightDrawerInteractable extends Component {
    private readonly interactableId = "point_rightDrawer"
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
            case "LOCKED_RIGHTDRAWER":
                 director.emit(event.UI_TOAST,"请先找到钥匙")
                 return
            case"OPEN_RIGHTDRAWER":
                director.emit(event.SCENE_VISUAL,"rightDrawerCloseBg")
                return
            // case "PICK_DIARY":
            //     director.emit(event.UI_OPEN,"diaryLockedBg")
            //     return
        }

    }

}