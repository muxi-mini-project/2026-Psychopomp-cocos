import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TowBooksPopController")
export class TowBooksPopController extends Component {
    @property(Node)
    public popupRoot: Node | null = null;

    @property(Node)
    public optionPanel: Node | null = null;

    @property(Node)
    public bookRenJianNode: Node | null = null;

    @property(Node)
    public bookEYuNode: Node | null = null;

    @property(Node)
    public btnRenJian: Node | null = null;

    @property(Node)
    public btnEYu: Node | null = null;

    @property(Node)
    public btnBack: Node | null = null;

    onEnable() {
        this.btnRenJian?.on(Node.EventType.TOUCH_END, this.onClickA, this);
        this.btnEYu?.on(Node.EventType.TOUCH_END, this.onClickB, this);
        this.btnBack?.on(Node.EventType.TOUCH_END, this.onClickBack, this);
    }

    onDisable() {
        this.btnRenJian?.off(Node.EventType.TOUCH_END, this.onClickA, this);
        this.btnEYu?.off(Node.EventType.TOUCH_END, this.onClickB, this);
        this.btnBack?.off(Node.EventType.TOUCH_END, this.onClickBack, this);
    }

    start() {
        this.hideAll();
    }

    private hideAll() {
        if (this.popupRoot) this.popupRoot.active = false;
        if (this.optionPanel) this.optionPanel.active = false;
        if (this.bookRenJianNode) this.bookRenJianNode.active = false;
        if (this.bookEYuNode) this.bookEYuNode.active = false;
    }

    // 给书架点击事件调用
    public openOptions() {
        console.log("[BookshelfPopupController] 打开两个选项弹窗");

        if (this.popupRoot) this.popupRoot.active = true;
        if (this.optionPanel) this.optionPanel.active = true;
        if (this.bookRenJianNode) this.bookRenJianNode.active = false;
        if (this.bookEYuNode) this.bookEYuNode.active = false;
    }

    private onClickA() {
        console.log("[BookshelfPopupController] 点击 A");

        if (this.optionPanel) this.optionPanel.active = false;
        if (this.bookRenJianNode) this.bookRenJianNode.active = true;
        if (this.bookEYuNode) this.bookEYuNode.active = false;
    }

    private onClickB() {
        console.log("[BookshelfPopupController] 点击 B");

        if (this.optionPanel) this.optionPanel.active = false;
        if (this.bookRenJianNode) this.bookRenJianNode.active = false;
        if (this.bookEYuNode) this.bookEYuNode.active = true;
    }

    private onClickBack() {
        console.log("[BookshelfPopupController] 点击 Back");

        // 先关书A
        if (this.bookRenJianNode?.active) {
            this.bookRenJianNode.active = false;
            return;
        }

        // 再关书B
        if (this.bookEYuNode?.active) {
            this.bookEYuNode.active = false;
            return;
        }

        // 最后关选项面板
        if (this.optionPanel?.active) {
            this.optionPanel.active = false;
        }

        if (this.popupRoot?.active) {
            this.popupRoot.active = false;
        }
    }
}
