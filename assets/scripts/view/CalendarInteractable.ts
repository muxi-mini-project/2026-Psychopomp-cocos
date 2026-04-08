import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

// const event = {
//     INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
//     INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
//     SCENE_VISUAL: "SCENE_VISUAL"
// } as const;

@ccclass("CalendarInteractable")
export class CalendarInteractable extends Component {
    @property(Node)
    public calendarCloseNode: Node | null = null;
    private readonly interactableId = "point_calendar";

    onEnable() {
        //director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("CalendarInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        //director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("CalendarInteractable onDisable -> 移除监听");
    }

    private onClick() {
        console.log(`CalendarInteractable 点击节点 emit INTERACTABLE_CLICK: ${this.interactableId}`)
        if (this.calendarCloseNode) {
            this.calendarCloseNode.active = true
            //director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId })
        }

        // private onTriggered(result: any) {
        //     console.log("[CalendarInteractable] 收到交互事件", result);

        //     if (result?.interactableId !== this.interactableId) {
        //         console.log(`[CalendarInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
        //         return;
        //     }

        //     switch (result?.code) {
        //         case "ENTER_CALENDAR":
        //             console.log("[CalendarInteractable] 触发 ENTER_CALENDAR -> 打开日历特写");
        //             //director.emit(event.SCENE_VISUAL, "calendarCloseBg");
        //             console.log("[CalendarInteractable] 已切换日历特写");
        //             return;
        //     }
        // }
    }
}

