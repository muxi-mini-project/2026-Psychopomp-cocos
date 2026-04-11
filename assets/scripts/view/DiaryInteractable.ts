import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass('DiaryInteractable')
export class DiaryInteractable extends Component {
    private readonly interactableId = "point_diary";

    @property({type: Node, tooltip: '密码本特写节点' })
    DiaryNode: Node = null;

    onEnable() {
        console.log('[DiaryInteractable] onEnable - 注册监听');
        director.on(event.INTERACTABLE_TRIGGERED, this._onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this._onClick, this);
    }

    onDisable() {
        console.log('[DiaryInteractable] onDisable - 注销监听');
        director.off(event.INTERACTABLE_TRIGGERED, this._onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this._onClick, this);
    }

    private _onClick() {
        console.log('[DiaryInteractable] _onClick - 点击事件');
    }

    private _onTriggered(result: any) {
        console.log('[DiaryInteractable] _onTriggered - 收到交互事件:', result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[DiaryInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "LOCKED":
                console.log('[DiaryInteractable] 触发 LOCKED -> 显示密码本特写');
                this.DiaryNode.active = true
                return;
            case "UNLOCKED":
                console.log('[DiaryInteractable] 触发 UNLOCKED -> 打开日记');
                return;
        }
    }

}