import { _decorator, Component, director } from 'cc';
import { DataManager } from './DataManager';
import { GameManager, GameState } from './GameManager';
const { ccclass } = _decorator;

@ccclass('DialogManager')
export class DialogManager extends Component {
    private static _instance: DialogManager = null;
    private _isActive: boolean = false;
    private _currentDialogue: any = null;
    private _currentLineIndex: number = 0;

    public static get instance(): DialogManager {
        return this._instance;
    }

    onLoad() {
        if (DialogManager._instance) {
            this.node.destroy();
            return;
        }
        DialogManager._instance = this;
        director.addPersistRootNode(this.node);

        // 监听场景脚本发送的 DIALOGUE_REQUEST 请求
        director.on("DIALOGUE_REQUEST", this._onDialogueRequest, this);
        // 监听 UI 层发送的下一句请求
        director.on("DIALOG_NEXT", this.nextLine, this);
    }

    /**
     * 处理 DIALOGUE_REQUEST 请求（由场景脚本发送）
     */
    private _onDialogueRequest(data: { dialogueId: string }): void {
        if (data && data.dialogueId) {
            this.showDialogue(data.dialogueId);
        }
    }

    public showDialogue(dialogueId: string): void {
        const dialogue = DataManager.instance.getDialogueConfig(dialogueId);
        if (!dialogue) {
            console.warn(`[DialogManager] 对话不存在: ${dialogueId}`);
            return;
        }

        if (!dialogue.lines || !Array.isArray(dialogue.lines) || dialogue.lines.length === 0) {
            console.warn(`[DialogManager] 对话没有有效内容: ${dialogueId}`);
            return;
        }

        this._currentDialogue = dialogue;
        this._currentLineIndex = 0;
        this._isActive = true;

        director.emit("DIALOGUE_START", dialogueId);
        GameManager.instance.setState(GameState.DIALOGUE);

        this._displayLine();
    }

    public nextLine(): void {
        if (!this._isActive || !this._currentDialogue || !this._currentDialogue.lines) {
            return;
        }

        this._currentLineIndex++;

        if (this._currentLineIndex >= this._currentDialogue.lines.length) {
            this._finishDialogue();
        } else {
            this._displayLine();
        }
    }

    public hideDialogue(): void {
        this._isActive = false;
        this._currentDialogue = null;
        this._currentLineIndex = 0;
        director.emit("DIALOGUE_HIDE");
    }

    public isDialogueActive(): boolean {
        return this._isActive;
    }

    private _displayLine(): void {
        if (!this._currentDialogue?.lines || !this._currentDialogue.lines[this._currentLineIndex]) {
            console.warn("[DialogManager] 对话内容无效");
            this._finishDialogue();
            return;
        }
        const line = this._currentDialogue.lines[this._currentLineIndex];
        director.emit("DIALOGUE_LINE", {
            text: line.text,
            index: this._currentLineIndex,
            total: this._currentDialogue.lines.length
        });
    }

    private _finishDialogue(): void {
        const dialogueId = this._currentDialogue?.id;
        this.hideDialogue();
        director.emit("DIALOGUE_END", dialogueId);
    }

    protected onDestroy(): void {
        director.off("DIALOGUE_REQUEST", this._onDialogueRequest, this);
        director.off("DIALOG_NEXT", this.nextLine, this);
        this._isActive = false;
        this._currentDialogue = null;
    }
}
