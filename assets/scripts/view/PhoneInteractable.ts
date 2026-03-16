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
        console.log("PhoneInteract onEnable -> 注册监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("PhoneInteract onDisable -> 移除监听");
    }

    private onTriggered(result: any) {
        console.log("[PhoneInteract] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[PhoneInteract] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "PHONE_LOCKED":
                console.log("[PhoneInteract] 触发 PHONE_LOCKED -> 提示手机未解锁");
                director.emit(event.UI_TOAST, "手机还没解锁");
                console.log("[PhoneInteract] 已弹出提示");
                return;

            case "PHONE_OPEN":
                console.log("[PhoneInteract] 触发 PHONE_OPEN -> 打开手机内容页");
                director.emit(event.UI_OPENED, "phoneCloseBg");
                console.log("[PhoneInteract] 已打开手机内容页");
                return;

            case "PHONE_PASSWORD":
                console.log("[PhoneInteract] 触发 PHONE_PASSWORD -> 打开手机密码页");
                director.emit(event.UI_OPENED, "phonePasswordBg");
                console.log("[PhoneInteract] 已打开手机密码页");
                return;
        }
    }
}
