import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TwoBooksPopController")
export class TwoBooksPopController extends Component {

    @property({ type: Node, tooltip: "选项面板" })
    private readonly optionPanel: Node | null = null;

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onClickOpen, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onClickOpen, this);
    }

    protected start(): void {
        this.hidePopup();
    }

    public openOptions(): void {
        console.log("[TwoBooksPopController] 打开选项面板");
        if (this.optionPanel) {
            this.optionPanel.active = true;
        }
    }

    private hidePopup(): void {
        if (this.optionPanel) {
            this.optionPanel.active = false;
        }
    }

    private onClickOpen(): void {
        this.openOptions();
    }
}
