import { _decorator, Component, Node } from "cc";
const { ccclass, property} = _decorator;


@ccclass("LeftDrawerInteractable")
export class LeftDrawerInteractable extends Component {
    @property(Node)
    public leftDrawerCloseNode:Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[LeftDrawerInteractable] onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[LeftDrawerInteractable] onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log("[LeftDrawerInteractable] 打开做抽屉特写");
        if (this.leftDrawerCloseNode) {
            this.leftDrawerCloseNode.active = true
        }
    }
}
