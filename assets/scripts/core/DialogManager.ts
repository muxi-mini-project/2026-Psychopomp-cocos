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
    }

    public showDialogue(dialogueId: string): void {
        const dialogue = DataManager.instance.getDialogueConfig(dialogueId);
        if (!dialogue) {
            console.warn(`[DialogManager] 对话不存在: ${dialogueId}`);
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
        if (!this._isActive || !this._currentDialogue) {
            return;
        }

        this._currentLineIndex++;

        if (this._currentLineIndex >= this._currentDialogue.lines.length) {
            this._finishDialogue();
        } else {
            this._displayLine();
        }
    }

    public selectChoice(choiceIndex: number): void {
        if (!this._isActive || !this._currentDialogue?.choices) {
            return;
        }

        const choice = this._currentDialogue.choices[choiceIndex];
        if (!choice) {
            return;
        }

        if (choice.action) {
            this._executeAction(choice.action);
        }

        this._finishDialogue();
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
        const line = this._currentDialogue.lines[this._currentLineIndex];
        director.emit("DIALOGUE_LINE", {
            text: line.text,
            speaker: this._currentDialogue.speaker,
            index: this._currentLineIndex,
            total: this._currentDialogue.lines.length
        });
    }

    private _finishDialogue(): void {
        if (this._currentDialogue?.onComplete) {
            this._executeAction(this._currentDialogue.onComplete);
        }

        const dialogueId = this._currentDialogue?.id;
        this.hideDialogue();
        director.emit("DIALOGUE_END", dialogueId);
    }

    private _executeAction(action: any): void {
        if (!action) return;

        switch (action.action) {
            case "set_flag":
                DataManager.instance.setFlag(action.flag, action.value);
                break;
        }
    }

    onDestroy() {
        this._isActive = false;
        this._currentDialogue = null;
    }
}
