import { _decorator, Component, director, Node, Button, Vec3, tween } from 'cc'
import { DiaryCube } from './DiaryCube'
const { ccclass, property } = _decorator

@ccclass('DiaryPwd')
export class DiaryPwd extends Component {

    // 正确密码：2 5 0 8 2 9
    private readonly correctPwd: number[] = [2, 5, 0, 8, 2, 9]

    // 拖入 box1 ~ box6
    @property(Node)
    boxList: Node[] = []

    @property(Button)
    confirmButton: Button = null

    @property(Node)
    diaryContent: Node = null

    protected onLoad(): void {
        this.confirmButton.node.on("click", this.onClick, this)
        if (this.diaryContent) {
            this.diaryContent.active = false
        }
    }

    onClick() {
        // 按钮点击动画
        tween(this.confirmButton.node)
            .to(0.1, { scale: new Vec3(0.9, 0.9, 0.9) })
            .to(0.1, { scale: Vec3.ONE })
            .start()

        this.checkPassword()
    }

    // ✅ 正确：重置所有滚轮为 0
    resetBoxIndex() {
        for (let boxNode of this.boxList) {
            const cube = boxNode.getComponent(DiaryCube)
            if (cube) {
                cube.resetIndex() // 调用Cube里的正确重置方法
            }
        }
    }

    // ✅ 正确：密码校验（无报错）
    checkPassword() {
        let currentInput: number[] = []

        // 遍历每个box，获取数字
        for (let boxNode of this.boxList) {
            const cube = boxNode.getComponent(DiaryCube)
            if (cube) {
                currentInput.push(cube.getNumber()) // ✅ 正确方法
            }
        }

        console.log("当前输入：", currentInput)
        console.log("正确密码：", this.correctPwd)

        // 对比密码
        const isSuccess = JSON.stringify(currentInput) === JSON.stringify(this.correctPwd)

        if (isSuccess) {
            console.log("✅ 密码正确！打开日记")
            this.diaryContent.active = true
            director.emit("DIARY_PWD_SUCCESS")
        } else {
            console.log("❌ 密码错误！")
            director.emit("DIARY_PWD_FAIL")
            this.resetBoxIndex() // 错误就重置
            // this.shakeConfirmBtn() // 错误时按钮震动
        }
    }

}