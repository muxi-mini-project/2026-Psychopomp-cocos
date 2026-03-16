import { _decorator, Component, director } from "cc";
const { ccclass, property } = _decorator;
const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    SCENE_VISUAL: "SCENE_VISUAL",
    UI_OPEN: "UI_OPEN",
}as const
@ccclass('SinkInteractable')
export class SinkInteractable extends Component {
    private readonly interactableId = "point_sink"

    onEnable() {
        console.log("[SinkInteractable] onEnable -> 注册交互监听")
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    onDisable() {
        console.log("[SinkInteractable] onDisable -> 注销交互监听")
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    private onTriggered(result: any) {
        console.log("[SinkInteractable] 收到交互事件:", result)
        if (result.interactableId !== this.interactableId){
            console.log(`[SinkInteractable] 交互点不匹配:current=${result?.interactableId},target=${this.interactableId}`)
            return
        }
        switch (result?.code) {
            case "ENTER_SINK":
                console.log("[SinkInteractable] 收到交互事件:ENTER_SINK -> 打开水池特写")
                director.emit(event.SCENE_VISUAL, "sinkCloseBg")
                console.log("[SinkInteractable] 已发出事件:SCENE_VISUAL -> sinkCloseBg")
                return
            case "SINK_XUANZHI_CONTENT":
                director.emit(event.UI_OPEN, "XuanzhiContentBg")
                console.log("[SinkInteractable] 未处理的 code:", result?.code);
                return
        }

    }


}