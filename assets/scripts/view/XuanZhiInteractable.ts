import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_OPENED: "UI_OPENED",
    UI_TOAST: "UI_TOAST",
    UI_MODAL: "UI_MODAL",
} as const;

@ccclass("XuanZhiInteract")
export class XuanZhiInteract extends Component {
    private readonly interactableId = "point_xuanZhi";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
    }

    private onTriggered(result: any) {
        if (result?.interactableId !== this.interactableId) return;

        switch (result?.code) {
            case "PICK_XUANZHI":
                director.emit(event.UI_MODAL, {
                    title: "宣纸",
                    content: `宣纸上好像有什么淡淡的痕迹...`,
                    okText: "确定",
                });
                return;

            case "XUANZHI_NEED_WATER":
                director.emit(event.UI_TOAST, "请先使宣纸上色");
                return;
        }
    }


}

