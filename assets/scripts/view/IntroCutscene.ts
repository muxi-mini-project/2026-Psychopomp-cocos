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

    @property({ tooltip: "初始放大（避免露黑边）" })
    private readonly initialScale: number = 1.3;

    @property({ tooltip: "最终放大倍数" })
    private readonly finalScale: number = 1.5;

    @property({ tooltip: "晃动幅度（屏幕宽高的百分比，0-0.5）" })
    private readonly shakeIntensityRatio: number = 0.05;

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
        this._resetAndPlay();
    }

    public resetAndPlay(): void {
        this._resetAndPlay();
    }

    private _resetAndPlay(): void {
        // 重置状态
        this._waitingForClick = false;
        this.container.setPosition(Vec3.ZERO);
        this.container.setScale(1, 1, 1);
        this._switchBgByIndex(0);

        this.scheduleOnce(() => {
            this._playIntroAnimation();
        }, 0.1);
    }

    private _playIntroAnimation(): void {
        const screenHeight = view.getVisibleSize().height;
        const intensity = screenHeight * this.shakeIntensityRatio;
        const startScale = new Vec3(this.initialScale, this.initialScale, 1);
        const endScale = new Vec3(this.finalScale, this.finalScale, 1);
        const stepDuration = this.animDuration / 8;
        const op = this.container.position.clone();
        const to = (y: number) => new Vec3(op.x, op.y + y, op.z);

        // 初始放大（避免黑边）
        this.container.setScale(startScale);

        // 晃动动画（绝对位置，确保回到原点）
        tween(this.container)
            .to(stepDuration, { position: to(intensity) })
            .to(stepDuration, { position: to(-intensity) })
            .to(stepDuration, { position: to(intensity) })
            .to(stepDuration, { position: to(-intensity) })
            .to(stepDuration, { position: to(intensity) })
            .to(stepDuration, { position: to(-intensity) })
            .to(stepDuration, { position: to(intensity) })
            .to(stepDuration, { position: to(0) })
            .call(() => {
                this._switchBgByIndex(this.bgAfterAnim);
                this._waitForClick();
            })
            .start();

        // 放大动画
        tween(this.container)
            .to(this.animDuration, { scale: endScale })
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
        // 重置位置到原点，切图
        this.container.setPosition(Vec3.ZERO);
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

    private _onDialogueEnd(dialogueId: string): void {
        // 只处理开场对话的结束
        if (dialogueId === this.dialogueId) {
            console.log('[IntroCutscene] 开场对话结束');
            DataManager.instance.setFlag("INTRO_CUTSCENE_PLAYED", true);
            director.emit("INTRO_COMPLETE");
        }
    }

    protected onDestroy(): void {
        director.off("DIALOGUE_LINE", this._onDialogueLine, this);
        director.off("DIALOGUE_END", this._onDialogueEnd, this);
    }
}
