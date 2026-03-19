import { _decorator, Component, Node, Sprite, SpriteFrame,Vec2 } from "cc";
const { ccclass, property } = _decorator;

@ccclass('FrameCloseup')
export class FrameCloseup extends Component {

    @property({type:Sprite, tooltip: "相框贴图"})
    public FrameSprite: Sprite | null = null;

    @property({type:SpriteFrame, tooltip: "相框关闭贴图"})
    public closeFrame: SpriteFrame | null = null;   // 关闭状态相框

    @property({type:SpriteFrame, tooltip: "相框打开贴图"})
   public openFrame: SpriteFrame | null = null;    // 打开状态相框

    @property(Node)
    public targetNode: Node | null = null;          


     onLoad(){
        this.node.on(Node.EventType.TOUCH_END,this.onClickClosedFrame,this)
        console.log("[FrameClose] onLoad");
        if (this.FrameSprite && this.closeFrame) {
            this.FrameSprite.spriteFrame = this.closeFrame;
        }
    }
    // onEnable() {
    //     console.log("[FrameCloseup] onEnable 打开相框特写");
    // }
    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this.onClickClosedFrame, this);
    }
    private onClickClosedFrame() {
        console.log("[FrameCloseup] 点击关闭状态相框");
       if (this.FrameSprite && this.openFrame) {
            this.FrameSprite.spriteFrame = this.openFrame;
        }

        if (this.targetNode) {
            this.targetNode.active = true;
        }
        console.log("[FrameCloseup] 相框已打开，显示钥匙:");
    }

}
