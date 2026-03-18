import { _decorator, Component, director, Node } from "cc";
const { ccclass } = _decorator;
import { DataManager } from "../core/DataManager";
//todo:写宣纸被拾取事件,加载时获取自身对应的flag，避免玩家重新点开又出现宣纸


@ccclass("XuanZhiInteract")
export class XuanZhiInteract extends Component {
    private readonly itemId = "xuanZhi";
    private readonly flagId = "XUANZHI_PICKED";


     onLoad(){
        if (DataManager.instance.getBool(this.flagId)){
            this.node.active = false;
        }
    }
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
        console.log(`XuanZhiInteract 点击节点 -> emit INTERACTABLE_CLICK: ${this.itemId}`);
        director.emit("ADD_ITEM_REQUEST", { itemId: this.itemId });
        //TODO:发送setflag事件说明已经捡走宣纸
        this.node.active = false;

    }
   
}

