import { _decorator,Component,director,Node } from "cc";
const { ccclass } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass("LeftArrow_bathroom_to_bedroom")
export class RightArrow extends Component {
    private readonly interactableId = "point_leftArrow_bathroom_to_bedroom";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("[LeftArrow] onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("[LeftArrow] onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log(`[LeftArrow] onClick -> 点击事件`);
        // 不再发送 INTERACTABLE_CLICK，由标准 Interactable 组件发送
    }

    private onTriggered(result: any) {
        console.log("[LeftArrow] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[LeftArrow] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_BEDROOM_TO_BATHROOM":
                console.log("[LeftArrow] 触发 ENTER_BEDROOM_TO_BATHROOM -> 返回卫生间门口");
                return;
        }
    }
}

