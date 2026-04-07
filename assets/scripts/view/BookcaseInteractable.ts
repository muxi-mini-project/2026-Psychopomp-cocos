import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BookcaseInteractable")
export class BookcaseInteractable extends Component {

    @property({ type: Node, tooltip: "书架特写节点" })
    private readonly target: Node | null = null;

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onClickOpen, this);
        console.log("BookcaseInteractable onEnable -> 注册监听,点击监听");
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onClickOpen, this);
        console.log("BookcaseInteractable onEnable -> 移除监听");
    }

    protected start(): void {
        if (this.target) {
            this.target.active = false;
        }
    }

    private onClickOpen(): void {
        if (this.target) {
            this.target.active = true;
        }
        console.log("[BookcaseInteractable] 打开书架特写");
    }
}
