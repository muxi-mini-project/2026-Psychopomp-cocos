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
    }
    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    private onTriggered(result: any) {
        if (result.id !== this.interactableId)
            return
        switch (result?.code) {
            case "PICK_KEY":
                director.emit(event.UI_MODAL,
                    {
                        title: "钥匙",
                        content: "你找到了一把钥匙",
                        okText: "确定"
                    }
                )
                return
        }

    }


}