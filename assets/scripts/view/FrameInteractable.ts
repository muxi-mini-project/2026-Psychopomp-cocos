import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

 const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
 } as const;

@ccclass("FrameInteractable")
export class FrameInteractable extends Component {
    private readonly interactableId = "point_frame";
    
    @property({type : Node , tooltip : "相框节点"})
    public frame_node: Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        console.log("[FrameInteractable] onEnable -> 注册监听,点击监听")
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
        console.log("[FrameInteractable] onDisable -> 移除监听，点击监听")
    }

    private onClick() {
        console.log('[FrameInteractable] onClick -> 点击事件');
        // 不再发送 INTERACTABLE_CLICK，由标准 Interactable 组件发送
    }

    private onTriggered(result: any) {
        console.log("[FrameInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[FrameInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_FRAMECLOSE":
                console.log("[FrameInteractable] 触发 ENTER_FRAMECLOSE -> 打开相框特写");
                if (this.frame_node) {
                    this.frame_node.active = true
                }
                console.log("[FrameInteractable] 已切换相框特写");
                return
            case "NORMAL_HINT":
                console.log("[FrameInteractable] 触发 NORMAL_HINT -> 发送显示提示事件")
                director.emit("DIALOGUE_REQUEST", { dialogueId: result.data.dialogueId })
                return
        }
    }
}

