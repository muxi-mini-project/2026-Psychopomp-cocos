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
        console.log("XuanZhiInteract onEnable -> 注册监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("XuanZhiInteract onDisable -> 移除监听");
    }

    private onTriggered(result: any) {
        console.log("[XuanZhiInteract]收到交互事件", result)
        if (result?.interactableId !== this.interactableId) {
            console.log(`[XuanZhiInteract] 交互点不匹配:current=${result?.interactableId},target=${this.interactableId}`)        // TODO: 检查是否已经完成过该交

            return;
        }
        switch (result?.code) {
            case "PICK_XUANZHI":
                console.log("[XuanZhiInteract] 触发 PICK_XUANZHI -> 打开宣纸弹窗")
                director.emit(event.UI_MODAL, {
                    title: "宣纸",
                    content: `宣纸上好像有什么淡淡的痕迹...`,
                    okText: "确定",
                });
                console.log("[XuanZhiInteract] 已完成弹窗");
                return;

            case "XUANZHI_NEED_WATER":
                console.log("[XuanZhiInteract] 触发 XUANZHI_NEED_WATER -> 弹出提示")
                director.emit(event.UI_TOAST, "请先使宣纸上色");
                console.log("[XuanZhiInteract] 已弹出提示")
                return;
            
        }
    }
}

