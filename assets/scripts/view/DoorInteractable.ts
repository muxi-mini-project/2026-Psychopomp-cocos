import { _decorator,Component,director,Node } from "cc";
const { ccclass } = _decorator;
const  event ={
    INTERACTABLE_TRIGGERED:"INTERACTABLE_TRIGGERED"
}
@ccclass('DoorInteractable')
export class DoorInteractable extends Component {
    private readonly interactableId:"point_door"
    onEnable() {
        this.node.on(Node.EventType.TOUCH_END,this.onClick,this)
        console.log("DoorInteractable enabled -> 开启监听");
        director.on(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)
        
    }

     onDisable() {
        this.node.off(Node.EventType.TOUCH_END,this.onClick,this)
        console.log("DoorInteractable disabled -> 关闭监听");
        director.off(event.INTERACTABLE_TRIGGERED,this.onTriggered,this)
    }

    private onClick(){
        console.log("DoorInteractable clicked -> 触发事件");
        director.emit(event.INTERACTABLE_TRIGGERED,{interactableId:this.interactableId})
    }

    private onTriggered(result:any){
        if(result?.interactableId!==this.interactableId){
            console.log("交互点不匹配");
            return
        }
        switch(result.code){
            case "ENTER_BATHROOM":
                console.log("进入浴室")
        }
    }
}