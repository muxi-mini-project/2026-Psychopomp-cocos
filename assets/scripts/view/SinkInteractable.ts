import { _decorator, Component, director, Node } from "cc";
const { ccclass } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",

} as const
@ccclass('SinkInteractable')
export class SinkInteractable extends Component {
    private readonly interactableId = "point_sink"

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[SinkInteractable] onEnable -> 注册交互监听,点击监听")

    }
    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[SinkInteractable] onDisable -> 注销交互监听，点击监听")
    }

    private onClick() {
        director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId })
        console.log(`[SinkInteractable] 点击水池`)
    }

    private onTriggered(result: any) {
        console.log("[SinkInteractable] 收到交互事件:", result)
        if (result.interactableId !== this.interactableId) {
            console.log(`[SinkInteractable] 交互点不匹配:current=${result?.interactableId},target=${this.interactableId}`)
            return
        }
        switch (result?.code) {
            case "ENTER_SINK":
                console.log("[SinkInteractable] 收到交互事件:ENTER_SINK -> 打开水池特写")
                return
        }

    }
}




