import { _decorator, Component, director,Node } from "cc";
const { ccclass,property } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass("BookcaseInteractable")
export class BookcaseInteractable extends Component {
    @property(Node)
    public bookcaseClose: Node|null = null;

    private readonly interactableId = "point_bookcase";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END,this.onclick,this)
        console.log("BookcaseInteractable onEnable -> 注册监听 点击节点");
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END,this.onclick,this)
        console.log("BookcaseInteractable onDisable -> 移除监听");
    }
    private onclick(){
        console.log(`BookcaseInteractable onclick -> 点击节点,emit INTERACTABLE_CLICK: ${this.interactableId}`);
       // director.emit(event.INTERACTABLE_CLICK, { interactableId: this.interactableId });
        if(this.bookcaseClose){
            this.bookcaseClose.active = true;
        }
    }

    private onTriggered(result: any) {
        console.log("[BookcaseInteractable] 收到交互事件", result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[BookcaseInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "ENTER_BOOKCASE":
                console.log("[BookcaseInteractable] 触发 ENTER_BOOKCASE -> 进入书柜特写");
                return;

            case "OPEN_TWOBOOKS_IN_BOOKCASE":
                console.log("[BookcaseInteractable] 触发 OPEN_TWOBOOKS_IN_BOOKCASE -> 打开双书选项");
                return;
        }
    }
}
