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
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
    }
    private onTriggered(result: any) {
        if (result.id !== this.interactableId)
            return
        switch (result?.code) {
            case "ENTER_SINK":
                director.emit(event.SCENE_VISUAL, "sinkCloseBg")
                return
            case "SINK_XUANZHI_CONTENT":
                director.emit(event.UI_OPEN, "XuanzhiContentBg")
                return
        }

    }


}