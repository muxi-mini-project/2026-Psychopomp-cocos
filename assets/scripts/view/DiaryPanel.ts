import { Component, _decorator, Node, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass('DiaryPanel')
export class DiaryPanel extends Component {
    @property({ type: Node, tooltip: "日记密码面板" })
    public diaryPswPanel: Node | null = null;

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

    protected hidePanel(): void {
        if (this.diaryPswPanel) {
            this.diaryPswPanel.active = false;
        }
    }

    protected onClickOpen(): void {
        this.openPanel();
    }

}