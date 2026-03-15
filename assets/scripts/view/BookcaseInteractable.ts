import { _decorator,Component,director } from "cc";
const { ccclass, property } = _decorator;
const event ={
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED",
    UI_OPEN:"UI_OPEN",
    SCENE_VISUAL:"SCENE_VISUAL"

}
@ccclass('BookcaseInteractable')
export class BookcaseInteractable extends Component {
    private readonly interactableId = "point_bookcase"
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
            //进入书柜特写
            case "ENTER_BOOKCASE":
                director.emit(event.SCENE_VISUAL,"bookcaseCloseBg")
                return
            //弹选项
            case "OPEN_TWOBOOKS_IN_BOOKCASE":
                director.emit(event.UI_OPEN,"twoBooksCloseBg")
                return
        }
    }

}