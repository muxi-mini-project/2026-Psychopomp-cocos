import { _decorator, Component, director, Node } from "cc";
import { DataManager } from "../core/DataManager";
const { ccclass, property } = _decorator;

@ccclass("XuanZhiInteract")
export class XuanZhiInteract extends Component {
    @property
    private readonly itemId: string = "xuanzhi";

    @property
    private readonly flagId: string = "XUANZHI_PICKED";

     protected onLoad(): void {
         if (DataManager.instance.getBool(this.flagId)) {
             this.node.active = false;
         }
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("XuanZhiInteract onEnable -> 注册点击监听");
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
        console.log("XuanZhiInteract onDisable -> 移除点击监听");
    }

    private onClick(): void {
        console.log(`XuanZhiInteract 点击宣纸 -> emit INTERACTABLE_CLICK: ${this.itemId}`);
        director.emit("ADD_ITEM_REQUEST", { itemId: this.itemId });
        director.emit("SET_FLAG_REQUEST", { name: this.flagId, value: true });
        this.node.active = false;
    }
}
