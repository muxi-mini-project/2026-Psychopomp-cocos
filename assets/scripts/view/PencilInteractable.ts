import { _decorator, Component, director, Node } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_MODAL: "UI_MODAL",
} as const;

@ccclass("PencilInteract")
export class PencilInteract extends Component {
    private readonly interactableId = "point_pencil";

    onEnable() {
        // 监听交互结果
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);

        // 监听当前节点点击
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);

        console.log("[PencilInteract] onEnable -> 注册结果监听 + 点击监听");
    }

    onDisable() {
        // 移除交互结果监听
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);

        // 移除当前节点点击
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);

        console.log("[PencilInteract] onDisable -> 移除结果监听 + 点击监听");
    }

    /**
     * 点击当前节点时，发给 InteractableManager 统一处理
     */
    private onClick() {
        console.log(`[PencilInteract] 点击节点 -> emit INTERACTABLE_CLICK: ${this.interactableId}`);

        director.emit(event.INTERACTABLE_CLICK, this.interactableId);
    }

    /**
     * 接收 InteractableManager 计算后的交互结果
     */
    private onTriggered(result: any) {
        console.log("[PencilInteract] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(
                `[PencilInteract] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`
            );
            return;
        }

        switch (result?.code) {
            case "PICK_PENCIL":
                console.log("[PencilInteract] 触发 PICK_PENCIL -> 获得铅笔");

                director.emit(event.UI_MODAL, {
                    title: "铅笔",
                    content: "获得铅笔",
                    okText: "确定",
                });

                console.log("[PencilInteract] 已完成弹窗");
                return;

            default:
        }
    }
}
