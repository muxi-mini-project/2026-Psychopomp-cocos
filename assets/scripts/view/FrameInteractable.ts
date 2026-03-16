import { _decorator, Component, director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_TOAST: "UI_TOAST",
    UI_OPEN: "UI_OPEN",
    UI_MODAL: "UI_MODAL",
} as const
@ccclass('FrameInteractable')
export class FrameInteractable extends Component {
    private readonly interactableId = "point_frame"
    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        console.log("[FrameInteractable] onEnable -> 开始监听")
    }
    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        console.log("[FrameInteractable] onDisable -> 停止监听")
    }
    private onTriggered(result: any) {
        console.log("[FrameInteractable] 收到事件:", result)
        if (result?.interactableId !== this.interactableId) {
            console.log("[FrameInteractable] interactableId 不匹配，忽略:", result?.interactableId);
            return
        }
        switch (result?.code) {
            case "LOCKED_FRAME":
                director.emit(event.UI_TOAST, "请先解锁手机")
                console.log("[FrameInteractable] 相框锁定，提示先解锁手机")
                return
            case "OPEN_FRAME_CLOSEUP":
                console.log("[FrameInteractable] 打开相框特写界面");
                director.emit(event.UI_OPEN, "frameCloseup");
                return;
        }

    }

}