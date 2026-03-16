import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    SCENE_VISUAL: "SCENE_VISUAL"
} as const;

@ccclass("BedInteractable")
export class BedInteractable extends Component {
    private readonly interactableId = "point_bed";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("BedInteractable onEnable -> 注册监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("BedInteractable onDisable -> 移除监听");
    }

    private onTriggered(result: any) {
        console.log("[BedInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[BedInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_BED":
                console.log("[BedInteractable] 触发 ENTER_BED -> 打开床特写");
                director.emit(event.SCENE_VISUAL, "bedClose");
                console.log("[BedInteractable] 已切换床特写");
                return;
        }
    }
}

