import { _decorator, Component, Node, Input, EventTouch, director } from 'cc'
import { Typewriter } from '../components/TypeWriter'

const { ccclass, property } = _decorator

@ccclass('TestText')
export class TestText extends Component {
    @property({type: Node , tooltip: "全屏遮罩节点" })
    public maskNode: Node | null = null

    private typewriter: Typewriter | null = null
    private panelNode: Node | null = null
    private _pendingDialogueData: { text: string; speaker?: string; index: number; total: number } | null = null

    protected onLoad(): void {
        director.on('DIALOGUE_START', this._onDialogueStart, this)
        director.on('DIALOGUE_LINE', this._onDialogueLine, this)
        director.on('DIALOGUE_END', this._onDialogueEnd, this)
    }

    protected start(): void {
        this.initPanel()
    }

    private initPanel(): void {
        if (this.typewriter) return
        this.panelNode = this.node
        this.typewriter = this.panelNode.getComponent(Typewriter)
        if (!this.typewriter) {
            console.error('[TestText] Typewriter component not found')
            return
        }
        this.maskNode.on(Input.EventType.TOUCH_START, this._onMaskClick, this)

        if (this._pendingDialogueData) {
            this.panelNode.parent.active = true
            this.panelNode.active = true
            this._onDialogueLine(this._pendingDialogueData)
            this._pendingDialogueData = null
        }
    }

    private _onDialogueStart(_dialogueId: string): void {
        this.initPanel()
        if (!this.typewriter) return
        this.panelNode.parent.active = true
        this.panelNode.active = true
        if (this.maskNode) {
            this.maskNode.active = true
        }
    }

    private _onDialogueLine(data: { text: string; speaker?: string; index: number; total: number }): void {
        if (!this.typewriter) {
            this._pendingDialogueData = data
            return
        }
        this.typewriter.startTypewriter(data.text)
    }

    private _onDialogueEnd(): void {
        if (this.panelNode) {
            this.panelNode.active = false
        }
        if (this.maskNode) {
            this.maskNode.active = false
        }
    }

    private _onMaskClick(event: EventTouch): void {
        if (!this.typewriter) return
        event.preventSwallow = true
        if (this.typewriter.isTyping) {
            this.typewriter.skipTyping()
            return
        }
        if (this.typewriter.isCompleted) {
            director.emit('DIALOG_NEXT')
        }
    }

    protected onDestroy(): void {
        if (this.maskNode) {
            this.maskNode.off(Input.EventType.TOUCH_START, this._onMaskClick, this)
        }
        this.typewriter = null
        this.panelNode = null
    }

    protected onDisable(): void {
        if (this.panelNode) {
            this.panelNode.active = false
        }
        if (this.maskNode) {
            this.maskNode.active = false
        }
    }
}
