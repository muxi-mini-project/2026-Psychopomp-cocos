import { _decorator, Component, director, Node } from "cc";
const { ccclass } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const
@ccclass('RightDrawerInteractable')
export class RightDrawerInteractable extends Component {
    private readonly interactableId = "point_rightDrawer"

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[RightDrawerInteractable] onEnable -> 注册监听，点击监听")

    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[RightDrawerInteractable] onDisable -> 取消监听，点击监听")
    }

    private onClick() {
        console.log(`[RightDrawerInteractable] 点击节点 -> emit INTERACTABLE_CLICK: ${this.interactableId}`)
        director.emit(event.INTERACTABLE_CLICK, this.interactableId)
    }

    private onTriggered(result: any) {
        if (result?.interactableId !== this.interactableId) {
            console.log(`交互点不匹配:current=${result?.interactableId},target=${this.interactableId}`)
            return
        }

        switch (result?.code) {
            case "LOCKED_RIGHTDRAWER":
                console.log("[RightDrawerInteractable] 未解锁 ")
                director.emit("DIALOGUE_REQUEST", { dialogueId: result.data.dialogueId })
                return
            case "OPEN_RIGHTDRAWER":
                console.log("[RightDrawerInteractable] 打开右抽屉特写")
                return
        }
    }
}