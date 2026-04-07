import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CalendarInteractable")
export class CalendarInteractable extends Component {

    @property({ type: Node, tooltip: "日历目标节点" })
    private readonly target: Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("CalendarInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("CalendarInteractable onDisable -> 移除监听");
    }
    
    protected start(): void {
        if (this.target) {
            this.target.active = false;
        }
    }

    private onClick() {
        if (this.target) {
            this.target.active = true
        }
        console.log("[CalendarInteractable] 打开日历特写")
    }
}

