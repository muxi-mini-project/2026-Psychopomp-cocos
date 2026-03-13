import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_OPENED: "UI_OPENED",
    UI_TOAST: "UI_TOAST",
} as const;

@ccclass("PhoneInteract")
export class PhoneInteract extends Component {
    private readonly interactableId = "point_phone";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
    }

    private onTriggered(result: any) {
        if (result?.interactableId !== this.interactableId) return;

        switch (result?.code) {
            case "PHONE_LOCKED":
                 director.emit(event.UI_TOAST, "手机还没解锁");
                return;

            case "PHONE_OPEN":
                // 解锁后打开手机内容页
                director.emit(event.UI_OPENED, "phoneCloseBg");
                return;

            case "PHONE_PASSWORD":
                director.emit(event.UI_OPENED, "phonePasswordBg");
                return;

            default:
                return;
        }
    }
}
