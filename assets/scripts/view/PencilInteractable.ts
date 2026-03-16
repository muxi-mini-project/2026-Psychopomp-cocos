import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_MODAL: "UI_MODAL",
} as const;

@ccclass("PencilInteract")
export class PencilInteract extends Component {
    private readonly interactableId = "point_pencil";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("PencilInteract onEnable -> 注册监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("PencilInteract onDisable -> 移除监听");
    }

    private onTriggered(result: any) {
        console.log("[PencilInteract] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[PencilInteract] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "PICK_PENCIL":
                console.log("[PencilInteract] 触发 PICK_PENCIL -> 获得铅笔");
                director.emit(event.UI_MODAL, {
                    title: "铅笔",
                    content: "获得铅笔",
                    okText: "确定",
                });
                console.log("[PencilInteract] 已完成弹窗");
                return;
        }
    }
}

