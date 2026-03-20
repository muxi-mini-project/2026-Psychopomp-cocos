import { _decorator,Component,director,Node } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass("RightArrow")
export class RightArrow extends Component {
    private readonly interactableId = "point_rightArrow";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("RightArrow onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("RightArrow onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log(`RightArrow onClick -> 点击事件,emit INTERACTABLE_CLICK: ${this.interactableId}`);
        director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId });
    }

    private onTriggered(result: any) {
        console.log("[RightArrow] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[RightArrow] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_BEDROOM_ALL":
                console.log("[RightArrow] 触发 ENTER_BEDROOM_ALL -> 进入卧室全景");
                console.log("[RightArrow] 已切换卧室全景");
                return;
        }
    }
}

