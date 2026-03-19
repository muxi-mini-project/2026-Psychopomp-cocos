import { _decorator, Component, director,Node } from "cc";
const { ccclass, property } = _decorator;
import { DataManager } from "../core/DataManager";
// const event = {
//     INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
//     INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
   
// }as const
@ccclass('SinkInteractable')
export class SinkInteractable extends Component {
    private readonly flagSelected = "XUANZHI_SELECTED"
    private readonly flagWet = "XUANZHI_WET"

    onEnable() {
            //   director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
              this.node.on(Node.EventType.TOUCH_END,this.onClick,this)
  console.log("[SinkInteractable] onEnable -> 注册交互监听,点击监听")
    }
    onDisable() {
            //   director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this)
              this.node.off(Node.EventType.TOUCH_END,this.onClick,this)
  console.log("[SinkInteractable] onDisable -> 注销交互监听，点击监听")
    }
    private onClick() {
        
        console.log(`[SinkInteractable] 点击水池 宣纸变湿 `)
    const isSelected = DataManager.instance.getBool(this.flagSelected) 
    if (!isSelected) {
            console.log("[WaterInteractable] 没选宣纸 -> 无反应");
            return;
        }  
    if (isSelected) {
        DataManager.instance.setFlag(this.flagSelected, false)
        DataManager.instance.setFlag(this.flagWet, true)
        return
    }
}
    // private onTriggered(result: any) {
    //     console.log("[SinkInteractable] 收到交互事件:", result)
    //     if (result.interactableId !== this.interactableId){
    //         console.log(`[SinkInteractable] 交互点不匹配:current=${result?.interactableId},target=${this.interactableId}`)
    //         return
    //     }
    //     switch (result?.code) {
    //         case "ENTER_SINK":
    //             console.log("[SinkInteractable] 收到交互事件:ENTER_SINK -> 打开水池特写")
    //             console.log("[SinkInteractable] 已发出事件:SCENE_VISUAL -> sinkCloseBg")
    //             return
    //         case "SINK_XUANZHI_CONTENT":
    //             console.log("[SinkInteractable] 未处理的 code:", result?.code);
    //             return
    //     }

    // }


}