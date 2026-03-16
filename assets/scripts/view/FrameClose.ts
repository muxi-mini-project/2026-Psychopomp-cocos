import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass('FrameCloseup')
export class FrameCloseup extends Component {

    @property(Node)
    closeFrameNode: Node | null = null;   // 关闭状态相框

    @property(Node)
    openFrameNode: Node | null = null;    // 打开状态相框

    @property(Node)
    keyNode: Node | null = null;          // 钥匙

    @property(Node)
    clickMaskNode: Node | null = null;    // 背景点击区域

    private isOpened = false;             // 相框是否已打开
    private isKeyTaken = false;           // 钥匙是否已拿走

    onEnable() {
        console.log("[FrameCloseup] onEnable 打开相框特写");

        this.initView();
    }

    private initView() {
        this.isOpened = false;

        if (this.closeFrameNode) {
            this.closeFrameNode.active = true;
        }

        if (this.openFrameNode) {
            this.openFrameNode.active = false;
        }

        if (this.keyNode) {
            this.keyNode.active = !this.isKeyTaken;
        }

        console.log("[FrameCloseup] 初始化完成:", {
            isOpened: this.isOpened,
            isKeyTaken: this.isKeyTaken
        });
    }

    
    onClickClosedFrame() {
        console.log("[FrameCloseup] 点击关闭状态相框");

        if (this.isOpened) {
            console.log("[FrameCloseup] 相框已经打开，忽略本次点击");
            return;
        }

        this.isOpened = true;

        if (this.closeFrameNode) {
            this.closeFrameNode.active = false;
        }

        if (this.openFrameNode) {
            this.openFrameNode.active = true;
        }

        if (this.keyNode) {
            this.keyNode.active = !this.isKeyTaken;
        }

        console.log("[FrameCloseup] 相框已打开，显示钥匙:", !this.isKeyTaken);
    }

    
    onClickKey() {
        console.log("[FrameCloseup] 点击钥匙");

        if (!this.isOpened) {
            console.log("[FrameCloseup] 相框未打开，不能拾取钥匙");
            return;
        }

        if (this.isKeyTaken) {
            console.log("[FrameCloseup] 钥匙已经被拿走了");
            return;
        }

        this.isKeyTaken = true;

        if (this.keyNode) {
            this.keyNode.active = false;
        }

        console.log("[FrameCloseup] 钥匙已拾取，钥匙隐藏");

      
    }

    /**
     * 点击背景
     * 效果：关闭特写界面
     */
    onClickBackground() {
        console.log("[FrameCloseup] 点击背景，关闭相框特写界面");

        this.node.active = false;

    }
}
