import { _decorator, Component, director, Sprite, SpriteFrame, tween, Vec3, Node, view } from 'cc';
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

    @property({ tooltip: "晃动幅度（屏幕宽高的百分比，0-0.5）" })
    private readonly shakeIntensityRatio: number = 0.05;

    @property({ tooltip: "放大倍数" })
    private readonly zoomScale: number = 1.5;

    @property({ tooltip: "动画时长（秒）" })
    private readonly animDuration: number = 5;

    @property({ tooltip: "对话ID" })
    private readonly dialogueId: string = "intro_cutscene";

    @property({ type: [Number], tooltip: "对话中切图对应的对话序号（从1开始）：1,4,7,8,10,15" })
    private readonly switchBgAtLines: number[] = [1, 4, 7, 8, 10, 15];

    @property({ tooltip: "开场动画结束后自动切到第几张图（bgStages的索引，从0开始）" })
    private readonly bgAfterAnim: number = 0;

    @property({ tooltip: "点击时切到第几张图（bgStages的索引，从0开始）" })
    private readonly bgOnClick: number = 1;

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
        const targetScale = new Vec3(this.zoomScale, this.zoomScale, 1);
        const stepDuration = this.animDuration / 4;
        const screenHeight = view.getVisibleSize().height;
        const intensity = screenHeight * this.shakeIntensityRatio;

        tween(this.container)
            .by(stepDuration, { position: new Vec3(0, intensity, 0) })
            .by(stepDuration, { position: new Vec3(0, -intensity * 2, 0) })
            .by(stepDuration, { position: new Vec3(0, intensity, 0) })
            .by(stepDuration, { position: new Vec3(0, 0, 0) })
            .start();

        tween(this.container)
            .to(this.animDuration, { scale: targetScale })
            .call(() => {
                this._switchBgByIndex(this.bgAfterAnim);
                this._waitForClick();
            })
            .start();
    }

    private _waitForClick(): void {
        this._waitingForClick = true;
        this.node.on(Node.EventType.TOUCH_END, this._onSceneClick, this);
    }

    private _onSceneClick(): void {
        console.log("[IntroCutscene] _onSceneClick called, _waitingForClick:", this._waitingForClick);
        if (!this._waitingForClick) return;
        this._waitingForClick = false;
        this.node.off(Node.EventType.TOUCH_END, this._onSceneClick, this);
        this._startDialogue();
    }

    private _startDialogue(): void {
        console.log("[IntroCutscene] _startDialogue called, dialogueId:", this.dialogueId);
        // 直接恢复图片大小并切图
        this.container.setScale(1, 1, 1);
        this._switchBgByIndex(this.bgOnClick);
        DialogManager.instance.showDialogue(this.dialogueId);
    }

    private _switchBgByIndex(index: number): void {
        if (this.bgStages.length > 0 && index >= 0 && index < this.bgStages.length) {
            this.bgSprite.spriteFrame = this.bgStages[index];
        }
    }

    private _onDialogueLine(data: { index: number, text: string }): void {
        console.log("[IntroCutscene] _onDialogueLine:", data.index, data.text.substring(0, 20));
        const lineIndex = data.index + 1;
        const switchPos = this.switchBgAtLines.indexOf(lineIndex);

        if (switchPos !== -1) {
            this._switchBgByIndex(switchPos + 2);
        }
    }

    private _onDialogueEnd(): void {
        DataManager.instance.setFlag("INTRO_CUTSCENE_PLAYED", true);
        director.emit("INTRO_COMPLETE");
    }

    protected onDestroy(): void {
        director.off("DIALOGUE_LINE", this._onDialogueLine, this);
        director.off("DIALOGUE_END", this._onDialogueEnd, this);
    }
}
