import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('btnManager')
export class btnManager extends Component {
    @property({ type: Node, tooltip: "按钮A" })
    private readonly buttonA: Node | null = null;

    @property({ type: Node, tooltip: "按钮A激活的目标节点" })
    private readonly targetA: Node | null = null;

    @property({ type: Node, tooltip: "按钮B" })
    private readonly buttonB: Node | null = null;

    @property({ type: Node, tooltip: "按钮B激活的目标节点" })
    private readonly targetB: Node | null = null;

    protected onEnable(): void {
        this.buttonA?.on(Node.EventType.TOUCH_END, this.onClickA, this);
        this.buttonB?.on(Node.EventType.TOUCH_END, this.onClickB, this);
    }

    protected onDisable(): void {
        this.buttonA?.off(Node.EventType.TOUCH_END, this.onClickA, this);
        this.buttonB?.off(Node.EventType.TOUCH_END, this.onClickB, this);
    }

    private onClickA(): void {
        if (this.targetA) {
            this.targetA.active = true;
        }
    }

    private onClickB(): void {
        if (this.targetB) {
            this.targetB.active = true;
        }
    }
}
