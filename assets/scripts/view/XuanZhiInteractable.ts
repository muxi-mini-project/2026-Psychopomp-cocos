import { _decorator, Component, director, Node } from "cc";
const { ccclass } = _decorator;
//import { DataManager } from "../core/DataManager";
//todo:写宣纸被拾取事件,加载时获取自身对应的flag，避免玩家重新点开又出现宣纸


@ccclass("XuanZhiInteract")
export class XuanZhiInteract extends Component {
    private readonly interactableId = "point_xuanZhi";

    onEnable() {
        // director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("XuanZhiInteract onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        //director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("XuanZhiInteract onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log(`XuanZhiInteract 点击节点 -> emit INTERACTABLE_CLICK: ${this.interactableId}`);
        director.emit("ADD_ITEM_REQUEST", { itemId: "xuanZhi" });
        this.node.active = false;

        // director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId });
    }
    // private onTriggered(result: any) {
    //     console.log("[XuanZhiInteract]收到交互事件", result)
    //     if (result?.interactableId !== this.interactableId) {
    //         console.log(`[XuanZhiInteract] 交互点不匹配:current=${result?.interactableId},target=${this.interactableId}`)        // TODO: 检查是否已经完成过该交

    //         return;
    //     }
    //     switch (result?.code) {
    //         case "PICK_XUANZHI":
    //             console.log("[XuanZhiInteract] 触发 PICK_XUANZHI -> 打开宣纸弹窗")
    //             // director.emit(event.UI_MODAL, {
    //             //     title: "宣纸",
    //             //     content: `宣纸上好像有什么淡淡的痕迹...`,
    //             //     okText: "确定",
    //             // });
    //             director.emit("ADD_ITEM_REQUEST", { itemId: "xuanZhi" });
    //             return;

    //         case "XUANZHI_NEED_WATER":
    //             console.log("[XuanZhiInteract] 触发 XUANZHI_NEED_WATER -> 弹出提示")
    //             console.log("[XuanZhiInteract] 已弹出提示")
    //             return;

    //     }
    // }
}

