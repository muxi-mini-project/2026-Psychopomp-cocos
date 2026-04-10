import { _decorator, Component, Node, EventTouch, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Interactable')
export class Interactable extends Component {
    @property
    interactableId: string = "";

    private _canInteract: boolean = true;

    protected onEnable(): void {
        console.log("[Interactable] onEnable, interactableId:", this.interactableId);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    protected onDisable(): void {
        console.log("[Interactable] onDisable, interactableId:", this.interactableId);
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    private _onTouchEnd(event: EventTouch): void {
        if (!this._canInteract) return;

        console.log("[Interactable] _onTouchEnd 发送 INTERACTABLE_CLICK:", this.interactableId);
        director.emit("INTERACTABLE_CLICK", this.interactableId);
    }

    public setEnabled(enabled: boolean): void {
        this._canInteract = enabled;
        this.node.active = enabled;
    }
}
