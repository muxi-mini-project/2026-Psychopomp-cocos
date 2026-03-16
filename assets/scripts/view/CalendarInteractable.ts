import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    SCENE_VISUAL: "SCENE_VISUAL"
} as const;

@ccclass("CalendarInteractable")
export class CalendarInteractable extends Component {
    private readonly interactableId = "point_calendar";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("CalendarInteractable onEnable -> 注册监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        console.log("CalendarInteractable onDisable -> 移除监听");
    }

    private onTriggered(result: any) {
        console.log("[CalendarInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[CalendarInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_CALENDAR":
                console.log("[CalendarInteractable] 触发 ENTER_CALENDAR -> 打开日历特写");
                director.emit(event.SCENE_VISUAL, "calendarCloseBg");
                console.log("[CalendarInteractable] 已切换日历特写");
                return;
        }
    }
}

