import { _decorator, Component, director,Node } from "cc";
const { ccclass, property} = _decorator;

// const event = {
//     INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
//     INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
// } as const;

@ccclass("LeftDrawerInteractable")
export class LeftDrawerInteractable extends Component {
    @property(Node)
    public leftDrawerCloseNode:Node|null = null;
    private readonly interactableId = "point_leftDrawer";

    onEnable() {
        //director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("LeftDrawerInteractable onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        //director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this.onClicked, this)
        console.log("LeftDrawerInteractable onDisable -> 移除监听，点击监听");
    }

    private onClicked() {
        console.log('LeftDrawerInteractable onClicked -> 点击事件 emit INTERACTABLE_CLICK: ${this.interactableId}');
        if (this.leftDrawerCloseNode) {
            this.node.active =  true
        }
        //director.emit(event.INTERACTABLE_CLICK, this.interactableId);
    }

    // private onTriggered(result: any) {
    //     console.log("[LeftDrawerInteractable] 收到交互事件", result);

    //     if (result?.interactableId !== this.interactableId) {
    //         console.log(`[LeftDrawerInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
    //         return;
    //     }

    //     switch (result?.code) {
    //         case "ENTER_LEFTDRAWER":
    //             console.log("[LeftDrawerInteractable] 触发 ENTER_LEFTDRAWER -> 打开左侧抽屉特写");
    //             director.emit(event.SCENE_VISUAL, "leftDrawerCloseBg");
    //             console.log("[LeftDrawerInteractable] 已切换左侧抽屉特写");
    //             return;
    //     }
    // }
}
