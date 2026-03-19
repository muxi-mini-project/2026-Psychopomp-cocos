import { _decorator, Component, Node, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass('FrameCloseup')
export class FrameCloseup extends Component {

    @property({type:Sprite, tooltip: "相框贴图"})
    FrameSprite: Sprite | null = null;

    @property({type:Sprite, tooltip: "相框关闭贴图"})
    closeFrameNode: SpriteFrame | null = null;   // 关闭状态相框

    @property({type:Sprite, tooltip: "相框打开贴图"})
    openFrameNode: SpriteFrame | null = null;    // 打开状态相框

    @property(Node)
    targetNode: Node | null = null;          


     onLoad(){
        this.node.on(Node.EventType.TOUCH_END,this.onClickClosedFrame,this)
        console.log("[FrameClose] onLoad");
        this.FrameSprite.spriteFrame = this.closeFrameNode;
    }
    // onEnable() {
    //     console.log("[FrameCloseup] onEnable 打开相框特写");
    // }

    onClickClosedFrame() {
        console.log("[FrameCloseup] 点击关闭状态相框");
        this.FrameSprite.spriteFrame = this.openFrameNode;
        this.targetNode.active = true;
        console.log("[FrameCloseup] 相框已打开，显示钥匙:");
    }

}
