import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DiaryToDiaryClose")
export class DiaryToDiaryClose extends Component {

    @property({ type: Node, tooltip: "日记近景节点" })
    private readonly diaryClose : Node | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[diaryToDiaryClose] onEnable -> 注册监听,点击监听");
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this)
        console.log("[diaryToDiaryClose] onDisable -> 移除监听");
    }
    
    

    private onClick() {
        if (this.diaryClose) {
            this.diaryClose.active = true
        }
        console.log("[diaryToDiaryClose] 打开日记特写")
    }
}

