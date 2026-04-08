import { _decorator, Component, Node } from "cc";
const { ccclass,property } = _decorator;

@ccclass("WetPaperInteract")
export class WetPaperInteract extends Component {
    @property(Node)
    wetPaper: Node = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick() {
        console.log("[WetPaper] 打开宣纸详情");
        //thid.node.active = active
        // TODO: 打开详情界面
    }
}
