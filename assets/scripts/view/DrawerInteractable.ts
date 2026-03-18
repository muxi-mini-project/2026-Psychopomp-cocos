import { _decorator, Component, director,Node, TiledObjectGroup } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass("DrawerInteractable")
export class DrawerInteractable extends Component {
    private readonly interactableId = "point_drawer";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("DrawerInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("DrawerInteractable onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log('DrawerInteractable onClick -> 点击事件,emit INTERACTABLE_CLICK: ${this.interactableId}');
        director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId });
    }

    private onTriggered(result: any) {
        console.log("[DrawerInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[DrawerInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_DRAWER_MID":
                console.log("[DrawerInteractable] 触发 ENTER_DRAWER_MID -> 打开抽屉中景");
                console.log("[DrawerInteractable] 已切换抽屉中景");
                return;
        }
    }
}

