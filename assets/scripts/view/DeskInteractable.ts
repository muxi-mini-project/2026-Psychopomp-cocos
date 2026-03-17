import { _decorator, Component, director,Node } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
    SCENE_VISUAL: "SCENE_VISUAL"
} as const;

@ccclass("DeskInteractable")
export class DeskInteractable extends Component {
    private readonly interactableId = "point_desk";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("DeskInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("DeskInteractable onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log('DeskInteractable onClick -> 点击事件,emit INTERACTABLE_CLICK: ${this.interactableId}');
        director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId });
    }

    private onTriggered(result: any) {
        console.log("[DeskInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[DeskInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_DESK":
                console.log("[DeskInteractable] 触发 ENTER_DESK -> 打开书桌特写");
                director.emit(event.SCENE_VISUAL, "deskCloseBg");
                console.log("[DeskInteractable] 已切换书桌特写");
                return;
        }
    }
}

