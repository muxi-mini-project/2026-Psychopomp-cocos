import { _decorator, Component, director,Node } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass("BedInteractable")
export class BedInteractable extends Component {
    private readonly interactableId = "point_bed";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("[BedInteractable] onEnable -> 注册监听,点击节点");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("[BedInteractable] onDisable -> 移除监听，点击节点");
    }

    private onClick() {
        console.log(`[BedInteract] 点击节点`);
        // 不再发送 INTERACTABLE_CLICK，由标准 Interactable 组件发送
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
                return;
        }
    }
}

