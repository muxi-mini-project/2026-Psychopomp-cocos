import { _decorator, Component, director, Sprite, SpriteFrame, tween, Vec3, Node } from 'cc';
import { DialogManager } from '../core/DialogManager';
import { DataManager } from '../core/DataManager';

const { ccclass, property } = _decorator;

@ccclass('IntroCutscene')
export class IntroCutscene extends Component {

    @property({ type: Sprite, tooltip: "背景图片" })
    private readonly bgSprite: Sprite | null = null;

    @property({ type: [SpriteFrame], tooltip: "背景图阶段（按对话顺序）" })
    private readonly bgStages: SpriteFrame[] = [];

    @property({ type: Node, tooltip: "动画容器节点" })
    private readonly container: Node | null = null;

    @property({ tooltip: "晃动幅度（像素）" })
    private readonly shakeIntensity: number = 10;

    @property({ tooltip: "放大倍数" })
    private readonly zoomScale: number = 1.2;

    @property({ tooltip: "动画时长（秒）" })
    private readonly animDuration: number = 2.0;

    @property({ tooltip: "对话ID" })
    private readonly dialogueId: string = "intro_cutscene";

    private _waitingForClick: boolean = false;

    protected onLoad(): void {
        director.on("DIALOGUE_LINE", this._onDialogueLine, this);
        director.on("DIALOGUE_END", this._onDialogueEnd, this);
    }

    protected start(): void {
        this.scheduleOnce(() => {
            this._playIntroAnimation();
        }, 0.1);
    }

    private _playIntroAnimation(): void {
        const originalPos = this.container.position.clone();
        const targetScale = new Vec3(this.zoomScale, this.zoomScale, 1);

        tween(this.container)
            .to(0.1, { position: new Vec3(originalPos.x + this.shakeIntensity, originalPos.y + this.shakeIntensity * 0.5, 0) })
            .to(0.1, { position: new Vec3(originalPos.x - this.shakeIntensity * 0.5, originalPos.y - this.shakeIntensity * 0.3, 0) })
            .to(0.1, { position: new Vec3(originalPos.x + this.shakeIntensity * 0.3, originalPos.y + this.shakeIntensity * 0.2, 0) })
            .to(0.1, { position: originalPos })
            .start();

        tween(this.container)
            .to(this.animDuration, { scale: targetScale })
            .call(() => {
                this._waitForClick();
            })
            .start();
    }

    private _waitForClick(): void {
        this._waitingForClick = true;
        this.node.on(Node.EventType.TOUCH_END, this._onSceneClick, this);
    }

    private _onSceneClick(): void {
        if (!this._waitingForClick) return;
        this._waitingForClick = false;
        this.node.off(Node.EventType.TOUCH_END, this._onSceneClick, this);
        this._startDialogue();
    }

    private _startDialogue(): void {
        DialogManager.instance.showDialogue(this.dialogueId);
    }

    private _onDialogueLine(data: { index: number, text: string }): void {
        if (this.bgStages.length > 0) {
            const stageIndex = Math.min(data.index, this.bgStages.length - 1);
            this.bgSprite.spriteFrame = this.bgStages[stageIndex];

            if (data.index > 0) {
                tween(this.container)
                    .to(0.3, { scale: new Vec3(1, 1, 1) })
                    .start();
            }
        }
    }

    private _onDialogueEnd(): void {
        DataManager.instance.setFlag("INTRO_CUTSCENE_PLAYED", true);
        director.emit("INTRO_CUTSCENE_COMPLETE");
    }

    protected onDestroy(): void {
        director.off("DIALOGUE_LINE", this._onDialogueLine, this);
        director.off("DIALOGUE_END", this._onDialogueEnd, this);
    }
}
