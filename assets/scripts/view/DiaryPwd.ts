import { _decorator, Component, director, Node, Button } from 'cc'
import { DiaryCube } from './DiaryCube'
import { SceneViewManager } from '../core/SceneViewManager'
const { ccclass, property } = _decorator

@ccclass('DiaryPwd')
export class DiaryPwd extends Component {
    /** 正确密码：2 5 0 8 2 9 */
    private readonly correctPwd: number[] = [2, 5, 0, 8, 2, 9]

    @property({ tooltip: '密码滚轮节点列表' })
    boxList: Node[] = []

    @property({ tooltip: '确认按钮' })
    confirmButton: Button = null

    @property({ tooltip: '密码成功后切换的目标场景ID' })
    targetScene: string = ''

    protected onLoad(): void {
        console.log('[DiaryPwd] onLoad');
        this._initConfirmButton();
    }

    private _initConfirmButton(): void {
        if (this.confirmButton) {
            this.confirmButton.node.on('click', this._onClickConfirm, this);
            console.log('[DiaryPwd] 确认按钮点击事件已注册');
        } else {
            console.warn('[DiaryPwd] confirmButton 未设置');
        }
    }

    private _onClickConfirm(): void {
        console.log('[DiaryPwd] _onClickConfirm - 点击确认按钮');
        this._checkPassword();
    }

    public resetBoxIndex(): void {
        console.log('[DiaryPwd] resetBoxIndex');
        for (const boxNode of this.boxList) {
            const cube = boxNode.getComponent(DiaryCube);
            if (cube) {
                cube.resetIndex();
            }
        }
    }

    private _checkPassword(): void {
        const currentInput: number[] = [];

        // 获取当前输入
        for (const boxNode of this.boxList) {
            const cube = boxNode.getComponent(DiaryCube);
            if (cube) {
                currentInput.push(cube.getNumber());
            }
        }

        console.log(`[DiaryPwd] 当前输入: [${currentInput.join(', ')}]`);
        console.log(`[DiaryPwd] 正确密码: [${this.correctPwd.join(', ')}]`);

        // 对比密码
        const isSuccess = JSON.stringify(currentInput) === JSON.stringify(this.correctPwd);

        if (isSuccess) {
            console.log('[DiaryPwd] 密码正确！切换场景');
            this._onPasswordSuccess();
        } else {
            console.log('[DiaryPwd] 密码错误！');
            this.resetBoxIndex();
        }
    }

    private _onPasswordSuccess(): void {
        if (!this.targetScene) {
            console.warn('[DiaryPwd] targetScene 未设置，无法切换场景');
            return;
        }

        console.log(`[DiaryPwd] 切换到场景: ${this.targetScene}`);
        SceneViewManager.instance.switchToScene(this.targetScene);
    }

    onDestroy() {
        if (this.confirmButton) {
            this.confirmButton.node.off('click', this._onClickConfirm, this);
        }
    }
}