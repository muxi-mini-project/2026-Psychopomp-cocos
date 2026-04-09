import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackClickInDiary")
export class BackClickInDiary extends Component {
    @property(Node)
    public target: Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick() {
        console.log("[CloseTargetOnClick] 点击 back -> 关闭目标节点");
        director.emit("DIARY_CUBE_RESET")//发出重置日记魔方的事件
        if (this.target) {
            this.target.active = false;
        }
    }
}
