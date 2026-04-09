import { _decorator, Component, director,Node } from "cc";
const { ccclass } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
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
            case "LOCKED":
                console.log("[DiaryInteractable] 触发 DIARY_LOCKED -> 提示请找到密码")
                return
            case "UNLOCKED":
                console.log("[DiaryInteractable] 触发 DIARY_OPEN -> 打开日记")
                console.log("[DiaryInteractable] 已打开日记")
                return
        }
    }


}