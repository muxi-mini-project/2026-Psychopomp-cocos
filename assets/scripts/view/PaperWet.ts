import { _decorator, Component, Node } from "cc";
import { DataManager } from "../core/DataManager";
const { ccclass,property } = _decorator;

@ccclass("WetPaperInteract")
export class WetPaperInteract extends Component {
    @property({ type : Node , tooltip : "打湿的宣纸"})
    wetPaper: Node = null;

    onEnable() {        
        if (!DataManager.instance.getBool("XUANZHI_WET")) {
            this.node.active = false
        }
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("[WetPaperInteract] onEnable -> 注册监听，点击监听")
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[WetPaperInteract] onDisable -> 关闭监听")
    }

    private onClick() {
        console.log("[WetPaper] 打开宣纸详情");
        if (this.wetPaper.active) {
            // TODO: 打开详情界面
        }
    }
}
