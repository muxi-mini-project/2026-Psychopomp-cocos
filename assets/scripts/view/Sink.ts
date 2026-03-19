import { _decorator, Component, Node, Vec3, tween, UIOpacity } from "cc";
import { DataManager } from "../core/DataManager";
const { ccclass, property } = _decorator;

@ccclass("WaterInteractable")
export class WaterInteractable extends Component {
    @property(Node)
    public paperDry: Node | null = null;

    @property(Node)
    public paperWet: Node | null = null;

    private readonly flagSelected = "XUANZHI_SELECTED";
    private readonly flagWet = "XUANZHI_WET";

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick() {
        console.log("[WaterInteractable] 点击水池");

        const isSelected = DataManager.instance.getBool(this.flagSelected);

        if (!isSelected) {
            console.log("[WaterInteractable] 没选宣纸 -> 无反应");
            return;
        }

        if (DataManager.instance.getBool(this.flagWet)) {
            console.log("[WaterInteractable] 宣纸已经湿过");
            return;
        }

        this.playWetAnimation();
    }

    private playWetAnimation() {
        if (!this.paperDry || !this.paperWet) {
            console.warn("[WaterInteractable] paperDry 或 paperWet 未绑定");
            return;
        }

        this.paperDry.active = true;
        this.paperWet.active = false;

        // 起始状态：稍微靠上、略小、半透明
        this.paperDry.setPosition(0, 40, 0);
        this.paperDry.setScale(new Vec3(0.85, 0.85, 1));

        let opacity = this.paperDry.getComponent(UIOpacity);
        if (!opacity) {
            opacity = this.paperDry.addComponent(UIOpacity);
        }
        opacity.opacity = 180;

        tween(this.paperDry)
            .to(
                0.9,
                {
                    position: new Vec3(0, 0, 0),
                    scale: new Vec3(1, 1, 1),
                },
                { easing: "sineOut" }
            )
            .call(() => {
                this.paperDry!.active = false;
                this.paperWet!.active = true;

                DataManager.instance.setFlag(this.flagWet, true);
                DataManager.instance.setFlag(this.flagSelected, false);

                console.log("[WaterInteractable] 宣纸已打湿");
            })
            .start();

        tween(opacity)
            .to(0.9, { opacity: 255 })
            .start();
    }
}
