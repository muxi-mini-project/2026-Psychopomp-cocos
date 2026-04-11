import { _decorator, Component, director, Node, tween, Sprite, Color } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
} as const;



@ccclass("DiaryHiddenContentInteract")
export class DiaryHiddenContentInteract extends Component {
    private readonly interactableId = "point_diary_hidden_content";
    private sprite: Sprite | null = null;

    protected onLoad(): void {
        this.sprite = this.node.getComponent(Sprite)
        if (this.sprite) {
            this.sprite.color = new Color(255, 255, 255, 0);
        }
    }

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("[DiaryHiddenContentInteract] onEnable -> 注册结果监听 + 点击监听");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("[DiaryHiddenContentInteract] onDisable -> 移除结果监听 + 点击监听");
    }

    private onClick() {
        console.log(`[DiaryHiddenContentInteract] 点击节点 -> emit INTERACTABLE_CLICK: ${this.interactableId}`);
        director.emit(event.INTERACTABLE_CLICK, this.interactableId);
    }

    private onTriggered(result: any) {
        console.log("[DiaryHiddenContentInteract] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[DiaryHiddenContentInteract] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "DIARY_HIDDEN_CONTENT_REVEALED":
                console.log("[DiaryHiddenContentInteract] 触发 DIARY_HIDDEN_CONTENT_REVEALED -> 触发动画")
                this.playAnimation();
                return;
            case "NORMAL_HINT":
                console.log("[DiaryHiddenContentInteract] 触发 NORMAL_HINT -> 触发文字提示")
                return;

        }
    }

    private playAnimation() {

        if (!this.sprite) {
            console.warn("[DiaryHiddenContentInteract] 无 Sprite，无法淡入");
            return;
        }
        tween(this.sprite)
            .to(0.5, { color: new Color(255, 255, 255, 255) })
            .call(() => {
                console.log("[DiaryHiddenContentInteract] 淡入完成");
            })
            .start();
    }
}