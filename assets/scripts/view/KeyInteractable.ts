import { _decorator, Component, director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_MODAL: "UI_MODAL"
}as const
@ccclass('KeyInteractable')
export class KeyInteractable extends Component {
    private readonly interactableId = "point_key"

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
                console.log("KeyInteractable onEnable -> 注册监听")
    }
    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
                console.log("KeyInteractable onDisable -> 取消监听")
    }
    private onTriggered(result: any) {
        console.log("[KeyInteractable] 收到交互事件", result);
        if (result.id !== this.interactableId){
            console.log(`[KeyInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return}
        switch (result?.code) {
            case "PICK_KEY":
                console.log("[KeyInteractable] 触发 PICK_KEY -> 获得钥匙")
                director.emit(event.UI_MODAL,
                    {
                        title: "钥匙",
                        content: "你找到了一把钥匙",
                        okText: "确定"
                    }
                )
                console.log("[KeyInteractable] 已完成弹窗")
                return
        }

    }
}