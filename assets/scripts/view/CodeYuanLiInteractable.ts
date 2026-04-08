import { _decorator, Component, director,Node } from "cc";
const { ccclass , property } = _decorator;

// const event = {
//     INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
//     INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
// } as const;

@ccclass("CodeYuanLiInteractable")
export class CodeYuanLiInteractable extends Component {
    @property(Node)
    public CodeYuanLiNode: Node | null = null;
    private readonly interactableId = "point_codeYuanLi";

    onEnable() {
        //director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("CodeYuanLiInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        //director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END,this.onClick, this)
        console.log("CodeYuanLiInteractable onDisable -> 移除监听，点击监听");
    }

    private onClick() {
        console.log('CodeYuanLiInteractable onClick -> 点击事件，emit INTERACTABLE_CLICK: ${this.interactableId}');
        if(this.CodeYuanLiNode){
            this.CodeYuanLiNode.active = true;
    }
}

    // private onTriggered(result: any) {
    //     console.log("[CodeYuanLiInteractable] 收到交互事件", result);

    //     if (result?.interactableId !== this.interactableId) {
    //         console.log(`[CodeYuanLiInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
    //         return;
    //     }

    //     switch (result?.code) {
    //         case "ENTER_CODEYUANLI":
    //             console.log("[CodeYuanLiInteractable] 触发 ENTER_CODEYUANLI -> 打开原理图特写");
    //             console.log("[CodeYuanLiInteractable] 已打开原理图特写");
    //             return;

    //         case "OPEN_CODEYUANLI":
    //             console.log("[CodeYuanLiInteractable] 触发 OPEN_CODEYUANLI -> 打开原理图内容页");
    //             console.log("[CodeYuanLiInteractable] 已打开原理图内容页");
    //             return;
    //     }
    // }
}

