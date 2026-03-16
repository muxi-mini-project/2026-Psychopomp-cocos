import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    SCENE_VISUAL: "SCENE_VISUAL"
} as const;

@ccclass("LeftDrawerInteractable")
export class LeftDrawerInteractable extends Component {
    private readonly interactableId = "point_leftDrawer";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("LeftDrawerInteractable onEnable -> 注册监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("LeftDrawerInteractable onDisable -> 移除监听");
    }

    private onTriggered(result: any) {
        console.log("[LeftDrawerInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[LeftDrawerInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_LEFTDRAWER":
                console.log("[LeftDrawerInteractable] 触发 ENTER_LEFTDRAWER -> 打开左侧抽屉特写");
                director.emit(event.SCENE_VISUAL, "leftDrawerCloseBg");
                console.log("[LeftDrawerInteractable] 已切换左侧抽屉特写");
                return;
        }
    }
}
