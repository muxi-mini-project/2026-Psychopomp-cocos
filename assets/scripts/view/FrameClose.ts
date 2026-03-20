import { _decorator, Component, director, Node, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass('FrameCloseup')
export class FrameCloseup extends Component {

    @property({ type: Sprite, tooltip: "关闭状态贴图（子节点）" })
    private readonly closeSprite: Sprite | null = null;

    @property({ type: Sprite, tooltip: "打开状态贴图（子节点）" })
    private readonly openSprite: Sprite | null = null;

    private readonly flagId = "FRAME_KEY_PICKED";
    private _opened = false;

    protected onLoad(): void {
        if (this.closeSprite) {
            this.closeSprite.node.active = true;
        }
        if (this.openSprite) {
            this.openSprite.node.active = false;
        }
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onClickFrame, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onClickFrame, this);
    }

    private onClickFrame(): void {
        if (this._opened) return;

        this._opened = true;

        if (this.closeSprite) {
            this.closeSprite.node.active = false;
        }
        if (this.openSprite) {
            this.openSprite.node.active = true;
        }

        director.emit("ADD_ITEM_REQUEST", { itemId: "frame_key" });
        director.emit("SET_FLAG_REQUEST", { name: this.flagId, value: true });
    }

    public resetFrame(): void {
        this._opened = false;
        if (this.closeSprite) {
            this.closeSprite.node.active = true;
        }
        if (this.openSprite) {
            this.openSprite.node.active = false;
        }
    }
}
