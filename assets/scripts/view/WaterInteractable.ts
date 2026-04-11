import { _decorator, Component, Node, tween, UIOpacity, director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass("WaterInteractable")
export class WaterInteractable extends Component {
    @property(Node)
    public paperDry: Node | null = null;

    @property(Node)
    public paperWet: Node | null = null;

    private readonly interactableId = "point_water";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
<<<<<<<< HEAD:assets/scripts/view/WaterInteractable.ts
        console.log("[WaterInteractable] onEnable -> 注册监听，点击监听");
        
========
        console.log("点击水池近景 开启监听");
>>>>>>>> feature/bathroom-scene-interactive:assets/scripts/view/Sink.ts
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("[WaterInteractable] onDisable -> 注册监听，点击监听");
    }

    private onClick() {
        console.log(`[WaterInteractable] onClick -> 点击事件`);
        // 不再发送 INTERACTABLE_CLICK，由标准 Interactable 组件发送
    }

    private onTriggered(result: any) {
        console.log("[WaterInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[WaterInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "XUANZHI_WET":
                console.log("[WaterInteractable] 触发 XUANZHI_WET -> 播放动画");
                this.playWetAnimation();
                return;
            case "NORMAL_HINT":
                console.log("[WaterInteractable] 触发 NORMAL_HINT -> 播放提示")
        }
    }

    private playWetAnimation(): void {
        if (!this.paperDry || !this.paperWet) {
            console.warn("[WaterInteractable] paperDry 或 paperWet 未绑定");
            return;
        }

        let dryOpacity = this.paperDry.getComponent(UIOpacity);
        if (!dryOpacity) {
            dryOpacity = this.paperDry.addComponent(UIOpacity);
        }
        dryOpacity.opacity = 0;
        this.paperDry.active = true;

        let wetOpacity = this.paperWet.getComponent(UIOpacity);
        if (!wetOpacity) {
            wetOpacity = this.paperWet.addComponent(UIOpacity);
        }
        wetOpacity.opacity = 0;
        this.paperWet.active = true;

        tween(dryOpacity)
            .to(0.5, { opacity: 255 })
            .call(() => {
                tween(dryOpacity)
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        this.paperDry!.active = false;
                        console.log("[WaterInteractable] 宣纸已打湿");
                    })
                    .start();

                tween(wetOpacity)
                    .to(0.5, { opacity: 255 })
                    .start();
            })
            .start();
    }
}
