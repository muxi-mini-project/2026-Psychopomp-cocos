import { Component, _decorator, Node, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass('DiaryPanel')
export class DiaryPanel extends Component {
    @property({ type: Node, tooltip: "日记密码面板" })
    private readonly diaryPswPanel: Node | null = null;

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onClickOpen, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onClickOpen, this);
    }

    protected start(): void {
        this.hidePanel();
    }

    protected openPanel(): void {
        console.log("打开日记密码面板");
        if (this.diaryPswPanel) {
            this.diaryPswPanel.active = true;
        }
    }

    private hidePanel(): void {
        if (this.diaryPswPanel) {
            this.diaryPswPanel.active = false;
        }
    }

    private onClickOpen(): void {
        this.openPanel();
    }

}