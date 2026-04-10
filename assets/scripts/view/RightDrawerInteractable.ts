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
        console.log(`[RightDrawerInteractable] 点击节点`);
        // 不再发送 INTERACTABLE_CLICK，由标准 Interactable 组件发送
    }

    private onTriggered(result: any) {
        if (result?.interactableId !== this.interactableId) {
            console.log(`交互点不匹配:current=${result?.interactableId},target=${this.interactableId}`)
            return
        }

        switch (result?.code) {
            case "UNLOCKED":
                console.log("[RightDrawerInteractable] 解锁右抽屉，并打开右抽屉特写")
                return
            case "OPEN":
                console.log("[RightDrawerInteractable] 打开右抽屉特写")
                return
            case "LOCKED":
                console.log("[RightDrawerInteractable] 播放文字提示")
                return
        }
    }
}