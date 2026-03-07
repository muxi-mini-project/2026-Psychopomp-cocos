import { _decorator, Component, Node, Label, Button, EditBox, sys, log, Color, EditBoxComponent } from 'cc';
const { ccclass, property } = _decorator;
import { CommonEnum } from '../common/CommonEnum';


@ccclass('PhoneLock')
export class PhoneLock extends Component {
    @property({ type: String, tooltip: '正确密码（大小写不敏感）' })
    public correctPassword: string = "W1S21T14";

    @property({ type: Number, tooltip: '密码最大长度' })
    public maxLength: number = 8;

    @property({ type: EditBox })
    public passwordEditBox: EditBox = null!;

    @property({ type: Label })
    public tipsLabel: Label = null!;

    @property({ type: Button })
    public confirmBtn: Button = null!;

    private isUnlocked: boolean = false;
    public onUnlockSuccess: (() => void) | null = null;

    onLoad() {
        this.node.active = false; // 默认隐藏
        this.initEditBox();
        this.bindButtonEvents();
    }


    private initEditBox() {
        this.passwordEditBox.maxLength = this.maxLength;

        // this.passwordEditBox.editingDidChanged = () => {
        //     const input = this.passwordEditBox.string;
        //     if (input.length > this.maxLength) {
        //         this.passwordEditBox.string = input.substring(0, this.maxLength);
        //         this.showTips(`密码最长${this.maxLength}位！`, "#ff9900");
        //     }
        //     this.tipsLabel.active = false;
        // };

        // this.passwordEditBox.editingDidEnded = () => {
        //     this.passwordEditBox.string && this.onConfirmClick();
        // };
        this.passwordEditBox.node.on('text-changed', () => {
            const input = this.passwordEditBox.string;
            if (input.length > this.maxLength) {
                this.passwordEditBox.string = input.substring(0, this.maxLength);
                this.showTips(`密码最长${this.maxLength}位！`, "#ff9900");
            }

            this.tipsLabel.node.active = false;
        })

        // 移动端输入完成自动验证
        this.passwordEditBox.node.on('editing-did-end', () => {
            this.passwordEditBox.string && this.onConfirmClick();
        })
    }

    /**
     * 绑定确认按钮事件
     */
    private bindButtonEvents() {
        this.confirmBtn.node.on(Button.EventType.CLICK, this.onConfirmClick, this);
    }

    /**
     * 确认密码
     */
    private onConfirmClick() {
        if (this.isUnlocked) return;

        const input = this.passwordEditBox.string.trim().toLowerCase();
        const target = this.correctPassword.toLowerCase();

        if (!input) {
            this.showTips("请输入密码！", "#ff0000");
            return;
        }

        if (input.length !== this.maxLength) {
            this.showTips(`密码需为${this.maxLength}位！`, "#ff9900");
            return;
        }

        if (input === target) {
            this.unlockSuccess();
        } else {
            this.unlockFail();
        }
    }


    private unlockSuccess() {
        this.isUnlocked = true;
        this.showTips("解锁成功！", "#00ff00");
        this.passwordEditBox.string = "";
        if (this.onUnlockSuccess) {
            this.onUnlockSuccess();
            log('PhoneLock:解锁成功');
        }

        // 后续对接C同学：发射手机解锁事件
        // GameManager.instance.emitEvent(CommonEnum.EventName.PHONE_UNLOCK);

        // 禁用输入框和按钮
        // this.passwordEditBox.editable = false;
        this.passwordEditBox.inputFlag = EditBox.InputFlag.PASSWORD
        this.confirmBtn.interactable = false;
    }

    /**
     * 解锁失败
     */
    private unlockFail() {
        this.showTips("密码错误！", "#ff0000");
        this.passwordEditBox.string = "";

        // 移动端重新唤起键盘
        sys.isMobile && this.passwordEditBox.focus();
    }

    /**
     * 显示提示文字
     * @param text 提示内容
     * @param color 颜色（16进制）
     */
    private showTips(text: string, color: string = "#ff0000") {
        this.tipsLabel.string = text;
        // this.tipsLabel.color = Color.colorFromHEX(color);
        const tempColor = new Color();
        Color.fromHEX(tempColor, color);
        this.tipsLabel.color = tempColor;
        this.tipsLabel.node.active = true;

        setTimeout(() => {
            this.tipsLabel.node.active = false;
        }, 3000);
    }

    /**
     * 外部显示密码锁
     */
    public showLock() {
        this.node.active = true;
        this.isUnlocked = false;
        this.passwordEditBox.string = "";
        // this.passwordEditBox.editable = true;
        this.passwordEditBox.inputFlag = EditBox.InputFlag.DEFAULT
        this.confirmBtn.interactable = true;

        // 移动端自动唤起键盘
        if (sys.isMobile) {
            setTimeout(() => this.passwordEditBox.focus(), 300);
        }
    }

    /**
     * 外部隐藏密码锁
     */
    public hideLock() {
        this.node.active = false;
        this.passwordEditBox.blur();
    }
}
