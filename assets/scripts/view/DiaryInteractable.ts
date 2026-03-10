import { _decorator, Component, director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_OPEN: "UI_OPEN",
    UI_TOAST: "UI_TOAST",
    UI_MODAL: "UI_MODAL"
}as const
@ccclass('DiaryInteractable')
export class DiaryInteractable extends Component {
    private readonly interactableId = "point_diary"
    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    private onTriggered(result: any) {
        if (result?.interactableId !== this.interactableId)
            return
        switch (result?.code) {
            case "DIARY_LOCKED":
                director.emit(event.UI_TOAST, "请找到密码")
                return
            case "DIARY_OPEN":
                director.emit(event.UI_OPEN, "diaryCloseBg")
            case "DIARY_COVER":
                director.emit(event.UI_OPEN, "diaryCoverBg")
                return
            
        }
    }


}