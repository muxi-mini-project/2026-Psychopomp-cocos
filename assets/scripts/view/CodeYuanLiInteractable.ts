import { _decorator,Component,director } from "cc";
const { ccclass} = _decorator;
const event = {
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED",
    UI_OPEN:"UI_OPEN",
}as const
@ccclass('CodeYuanLiInteractable')
export class CodeYuanLiInteractable extends Component {
    private readonly interactableId = "point_codeYuanLi"
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
            case "ENTER_CODEYUANLI":
                director.emit(event.UI_OPEN,"codeYuanLiCloseBg")
                return
            case "OPEN_CODEYUANLI":
                director.emit(event.UI_OPEN,"codeYuanLiContentBg")
                return
        }
    }


}
