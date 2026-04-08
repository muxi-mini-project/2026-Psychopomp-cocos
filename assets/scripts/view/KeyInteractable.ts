import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass('KeyInteractable')
export class KeyInteractable extends Component {
    @property
    private readonly itemId: string = "key";

    @property
    private readonly flagId: string = "KEY_PICKED";

    @property ({type : Node, tooltip: "启动目标节点"})
    private readonly target : Node | null = null

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("KeyInteractable onEnable -> 注册监听,点击监听");
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("KeyInteractable onDisable -> 取消监听，点击监听");
    }

    private onClick(): void {
        console.log(`[KeyInteractable] 收到点击事件emit INTERACTABLE_CLICK: ${this.itemId}`);
        director.emit("ADD_ITEM_REQUEST", { itemId: this.itemId });
        director.emit("SET_FLAG_REQUEST", { name: this.flagId, value: true });
        this.node.active = false;
        this.target.active = true
    }
}