import { _decorator, Component, Node, Sprite, SpriteFrame, Vec2 } from "cc";
const { ccclass, property } = _decorator;
// import { DataManager } from "../core/DataManager";

@ccclass('FrameCloseup')
export class FrameCloseup extends Component {

    @property({ type: Sprite, tooltip: "相框贴图" })
    public FrameSprite: Sprite | null = null;

    @property({ type: SpriteFrame, tooltip: "相框关闭贴图" })
    public closeFrame: SpriteFrame | null = null;   // 关闭状态相框

    @property({ type: SpriteFrame, tooltip: "相框打开贴图" })
    public openFrame: SpriteFrame | null = null;    // 打开状态相框

    @property(Node)
    public keyNode: Node | null = null;

    @property(Node)
    public backToDeskClose: Node | null = null;

    @property(Node)
    public frameRoot: Node | null = null;

    @property(Node)
    public deskCloseNode: Node | null = null;

    private keyFlag = "FRAME_KEY_PICKED"
    private opened = false;


    onLoad() {
        //this.node.on(Node.EventType.TOUCH_END,this.onClickbackToDeskClose,this)
        console.log("[FrameClose] onLoad");
        if (this.FrameSprite && this.closeFrame) {
            this.FrameSprite.spriteFrame = this.closeFrame;
        }
        // TODO:如果钥匙已经拿过，直接隐藏
        // if (this.keyNode) {
        //     this.keyNode.active = !DataManager.instance.getBool(this.keyFlag);
        // }
    }

    onEnable() {
        // 点击相框本体 -> 打开
        this.node.on(Node.EventType.TOUCH_END, this.onClickFrame, this);

        // 点击钥匙 -> 拾取
        this.keyNode?.on(Node.EventType.TOUCH_END, this.onClickKey, this);

        // 点击返回 -> 只有拿到钥匙才能返回
        this.backToDeskClose?.on(Node.EventType.TOUCH_END, this.onClickBack, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClickFrame, this);
        this.keyNode?.off(Node.EventType.TOUCH_END, this.onClickKey, this);
        this.backToDeskClose?.off(Node.EventType.TOUCH_END, this.onClickBack, this);
    }

    private onClickFrame() {
        console.log("[FrameCloseup] 点击相框");

        if (this.opened) return;

        this.opened = true;

        if (this.FrameSprite && this.openFrame) {
            this.FrameSprite.spriteFrame = this.openFrame;
        }

        // TODO:只有没拿过钥匙时才显示
        // if (this.keyNode && !DataManager.instance.getBool(this.keyFlag)) {
        //     this.keyNode.active = true;
        // }

        console.log("[FrameCloseup] 相框已打开");
    }


    private onClickKey() {
        console.log("[FrameCloseup] 点击钥匙");

        // 隐藏钥匙
        if (this.keyNode) {
            this.keyNode.active = false;
        }

        // 记录拿到钥匙
       // DataManager.instance.setFlag(this.keyFlag, true);

        // 如果你有背包系统，可以顺手加
       // DataManager.instance.addItem("key");

        console.log("[FrameCloseup] 已拾取钥匙");
    }
    // onDestroy() {
    //     this.node.off(Node.EventType.TOUCH_END, this.onClickbackToDeskClose, this);
    // }
    // private onClickbackToDeskClose() {
    //     console.log("[FrameCloseup] 点击关闭状态相框");
    //    if (this.FrameSprite && this.openFrame) {
    //         this.FrameSprite.spriteFrame = this.openFrame;
    //     }

    //     if (this.targetNode) {
    //         this.targetNode.active = true;
    //     }
    //     console.log("[FrameCloseup] 相框已打开，显示钥匙:");
    //     if(this.backToDeskClose){
    //         this.frameNode.active = false;
    //     }
    // }
    private onClickBack() {
       // TODO:const keyPicked = DataManager.instance.getBool(this.keyFlag);

        // 没拿钥匙，不允许返回
        // if (!keyPicked) {
        //     console.log("[FrameCloseup] 还没拿钥匙，不能返回");
        //     return;
        // }

        console.log("[FrameCloseup] 已拿钥匙，返回 deskClose");

        if (this.frameRoot) {
            this.frameRoot.active = false;
        }

        if (this.deskCloseNode) {
            this.deskCloseNode.active = true;
        }
    }
}
