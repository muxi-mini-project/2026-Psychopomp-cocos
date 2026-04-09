import { _decorator, Component, Node, tween, UIOpacity, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("WaterInteractable")
export class WaterInteractable extends Component {
    @property(Node)
    public paperDry: Node | null = null;

    @property(Node)
    public paperWet: Node | null = null;

    private readonly flagId = "XUANZHI_WET";

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("点击水池近景 开启监听");
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("点击水池近景 关闭监听");
    }

    private onClick() {
        console.log("[WaterInteractable] 点击水池");

        this.playWetAnimation();
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
                        director.emit("SET_FLAG_REQUEST", { name: this.flagId, value: true });
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
