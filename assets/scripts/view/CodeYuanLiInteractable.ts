import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_OPEN: "UI_OPEN",
} as const;

@ccclass("CodeYuanLiInteractable")
export class CodeYuanLiInteractable extends Component {
    private readonly interactableId = "point_codeYuanLi";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("CodeYuanLiInteractable onEnable -> 注册监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("CodeYuanLiInteractable onDisable -> 移除监听");
    }

    private onTriggered(result: any) {
        console.log("[CodeYuanLiInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[CodeYuanLiInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_CODEYUANLI":
                console.log("[CodeYuanLiInteractable] 触发 ENTER_CODEYUANLI -> 打开原理图特写");
                director.emit(event.UI_OPEN, "codeYuanLiCloseBg");
                console.log("[CodeYuanLiInteractable] 已打开原理图特写");
                return;

            case "OPEN_CODEYUANLI":
                console.log("[CodeYuanLiInteractable] 触发 OPEN_CODEYUANLI -> 打开原理图内容页");
                director.emit(event.UI_OPEN, "codeYuanLiContentBg");
                console.log("[CodeYuanLiInteractable] 已打开原理图内容页");
                return;
        }
    }
}

