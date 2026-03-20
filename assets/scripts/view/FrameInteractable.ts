import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

// const event = {
//     INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
//     INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
// } as const;

@ccclass("FrameInteractable")
export class FrameInteractable extends Component {
    private readonly interactableId = "point_frame";
    @property(Node)
    public ENTER_FRAME_NODE: Node | null = null;

    onEnable() {
        //director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("FrameInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        //director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("FrameInteractable onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log('DeskInteractable onClick -> 点击事件,emit INTERACTABLE_CLICK: ${this.interactableId}');
        if (this.ENTER_FRAME_NODE) {
            this.ENTER_FRAME_NODE.active = true;
        }
        // director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId });
    }

    private onTriggered(result: any) {
        console.log("[FrameInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[FrameInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_FRAMECLOSE":
                console.log("[FrameInteractable] 触发 ENTER_FRAME -> 打开相框特写");
                console.log("[DeskInteractable] 已切换相框特写");
                return;
        }
    }
}

