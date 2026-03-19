import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TwoBooksPopController")
export class TwoBooksPopController extends Component {
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
    public btnPanelBack: Node | null = null;

    @property(Node)
    public btnRenJianBack: Node | null = null;

    @property(Node)
    public btnEYuBack: Node | null = null;


    onEnable() {
        this.btnRenJian?.on(Node.EventType.TOUCH_END, this.onClickA, this);
        this.btnEYu?.on(Node.EventType.TOUCH_END, this.onClickB, this);
        this.btnPanelBack?.on(Node.EventType.TOUCH_END, this.onClickPanelBack, this);
        this.btnRenJianBack?.on(Node.EventType.TOUCH_END, this.onClickRenJianBack, this);
        this.btnEYuBack?.on(Node.EventType.TOUCH_END, this.onClickEYuBack, this);
    }

    onDisable() {
        this.btnRenJian?.off(Node.EventType.TOUCH_END, this.onClickA, this);
        this.btnEYu?.off(Node.EventType.TOUCH_END, this.onClickB, this);
        this.btnPanelBack?.off(Node.EventType.TOUCH_END, this.onClickPanelBack, this);
        this.btnRenJianBack?.off(Node.EventType.TOUCH_END, this.onClickRenJianBack, this);
        this.btnEYuBack?.off(Node.EventType.TOUCH_END, this.onClickEYuBack, this);
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

    private resetToOptions() {
        if (this.optionPanel) this.optionPanel.active = true;
        if (this.bookRenJianNode) this.bookRenJianNode.active = false;
        if (this.bookEYuNode) this.bookEYuNode.active = false;
    }

    // 给书架点击事件调用
    public openOptions() {
        console.log("[BookshelfPopupController] 打开两个选项弹窗");

        if (this.popupRoot) this.popupRoot.active = true
        this.resetToOptions();
    }

    private onClickA() {
        console.log("[BookshelfPopupController] 点击 人间词话");

        if (this.optionPanel) this.optionPanel.active = false;
        if (this.bookRenJianNode) this.bookRenJianNode.active = true;
        if (this.bookEYuNode) this.bookEYuNode.active = false;
    }

    private onClickB() {
        console.log("[BookshelfPopupController] 点击 鳄鱼手记");

        if (this.optionPanel) this.optionPanel.active = false;
        if (this.bookRenJianNode) this.bookRenJianNode.active = false;
        if (this.bookEYuNode) this.bookEYuNode.active = true;
    }


    private onClickPanelBack() {
        console.log("[TwoBooksPopController] 点击 optionPanel 的 back -> 关闭整个弹窗");
        this.resetToOptions()
        if (this.popupRoot) this.popupRoot.active = false;
    }

    private onClickRenJianBack() {
        console.log("[TwoBooksPopController] 点击 renJian back -> 回到 optionPanel");

        if (this.bookRenJianNode) this.bookRenJianNode.active = false;
        if (this.optionPanel) this.optionPanel.active = true;
    }

    private onClickEYuBack() {
        console.log("[TwoBooksPopController] 点击 crocodile back -> 回到 optionPanel");

        if (this.bookEYuNode) this.bookEYuNode.active = false;
        if (this.optionPanel) this.optionPanel.active = true;
    }

}
