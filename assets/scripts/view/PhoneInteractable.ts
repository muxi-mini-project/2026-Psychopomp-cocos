import { _decorator, Component, director,Node } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass("PhoneInteract")
export class PhoneInteract extends Component {
    private readonly interactableId = "point_phone";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END,this.onClick,this)
        console.log("PhoneInteract onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END,this.onClick,this)
        console.log("PhoneInteract onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log('PhoneInteract 点击节点 -> emit INTERACTABLE_CLICK: ${this.interactableId');
        director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId });
    }

    private onTriggered(result: any) {
        console.log("[PhoneInteract] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[PhoneInteract] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {

            case "PHONE_OPEN":
                console.log("[PhoneInteract] 触发 PHONE_OPEN -> 打开手机内容页");
                director.emit("SCENE_SWITCH_REQUEST", { sceneId: "phoneClose" });
                //TODO：打开手机内容页
                console.log("[PhoneInteract] 已打开手机内容页");
                return;

            case "PHONE_BEIWANGLU":
                console.log("已查看备忘录");
                return;
        }
    }
}
