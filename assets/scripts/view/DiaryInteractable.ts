import { _decorator, Component, director,Node } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
    UI_OPEN: "UI_OPEN",
    UI_TOAST: "UI_TOAST",
    UI_MODAL: "UI_MODAL"
} as const
@ccclass('DiaryInteractable')
export class DiaryInteractable extends Component {
    private readonly interactableId = "point_diary"
    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("DiaryInteractable onEnable -> 注册监听,点击监听")
    }
    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("DiaryInteractable onDisable -> 注销监听，点击监听")
    }
    private onClick() {
           console.log('DiaryInteractable onClick -> 点击事件,emit INTERACTABLE_CLICK: ${this.interactableId}')
           director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId })
    }
    private onTriggered(result: any) {
        console.log("DiaryInteractable onTriggered -> 收到交互事件", result)
        if (result?.interactableId !== this.interactableId) {
            console.log(`[DiaryInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`)
            return
        }
        switch (result?.code) {
            case "DIARY_LOCKED":
                console.log("[DiaryInteractable] 触发 DIARY_LOCKED -> 提示请找到密码")
                director.emit(event.UI_TOAST, "请找到密码")
                console.log("[DiaryInteractable] 已弹出提示")
                return
            case "DIARY_OPEN":
                console.log("[DiaryInteractable] 触发 DIARY_OPEN -> 打开日记")
                director.emit(event.UI_OPEN, "diaryCloseBg")
                console.log("[DiaryInteractable] 已打开日记")
                return
            case "DIARY_COVER":
                console.log("[DiaryInteractable] 触发 DIARY_COVER -> 打开日记本封面")
                director.emit(event.UI_OPEN, "diaryCoverBg")
                console.log("[DiaryInteractable] 已打开日记本封面")
                return
            case "DIARY_BLANK":
                console.log("[DiaryInteractable] 触发 DIARY_BLANK -> 打开空白日记")
                director.emit(event.UI_OPEN, "diaryBlankBg");
                console.log("[DiaryInteractable] 已打开空白日记")
                return;

        }
    }


}