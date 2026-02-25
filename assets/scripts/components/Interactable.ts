import { _decorator, Component, Node, input, Input, EventMouse, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Interactable')
export class Interactable extends Component {
    @property
    interactableId: string = "";

    @property
    interactableType: string = "";

    @property
    hoverCursor: boolean = true;

    protected _canInteract: boolean = true;

    protected onEnable(): void {
        input.on(Input.EventType.MOUSE_DOWN, this._onMouseDown, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.MOUSE_DOWN, this._onMouseDown, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.MOUSE_DOWN, this._onMouseDown, this);
    }

    private _onMouseDown(event: EventMouse) {
        if (!this._canInteract) return;
        if (event.getButton() !== EventMouse.BUTTON_LEFT) return;

        director.emit("INTERACTABLE_CLICK", this.interactableId);
    }

    public setEnabled(enabled: boolean): void {
        this._canInteract = enabled;
        this.node.active = enabled;
    }

    public setInteractableId(id: string): void {
        this.interactableId = id;
    }

    public getInteractableId(): string {
        return this.interactableId;
    }

    public getInteractableType(): string {
        return this.interactableType;
    }
}
