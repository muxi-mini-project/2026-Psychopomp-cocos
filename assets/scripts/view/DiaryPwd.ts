import { _decorator, Component, director, Node, Button, Vec3, tween } from 'cc'
import { DiaryCube } from './DiraryCube'
const { ccclass, property } = _decorator

@ccclass('DiaryPwd')
export class DiaryPwd extends Component {

    private readonly correctPwd = [2, 5, 0, 3, 1, 0]

    @property(Node)
    boxList: Node[] = []

    @property(Button)
    confirmButton: Button = null

    @property(Node)
    diaryContent: Node = null

    protected onLoad(): void {
        this.confirmButton.node.on("click", this.onClick, this)
        //隐藏内容页
        if (this.diaryContent) {
            this.diaryContent.active = false
        }
    }

    onClick() {
        tween(this.confirmButton.node)
            .to(0.1, { scale: new Vec3(0.9, 0.9, 0.9) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start()
        this.checkPassword()
    }

    resetBoxIndex() {
        for (let i = 0; i < this.boxList.length; i++) {
            const cube = this.boxList[i].getComponent(DiaryCube)
            if (cube) {
                cube.index = 0
                cube.displayLabel.string = "0"
            }
        }
    }

    checkPassword() {

        for (let i = 0; i < 6; i++) {
            const cube = this.boxList[i].getComponent(DiaryCube)
            const current = cube?.index || 0
            if (current !== this.correctPwd[i]) {
                console.log("密码错误")
                this.resetBoxIndex()
                return
            }
        }
        console.log("密码正确！")
        if (this.diaryContent) {
            this.diaryContent.active = true
           // this.confirmButton.node.active = false
        }
        //打开日记内容
        console.log("打开日记内容")
        //this.node.active = false
        // const pwdPanel = this.node.parent
        // if (pwdPanel) {
        //     pwdPanel.active = false
        // }
        director.emit("DIARY_PWD_SUCCESS")
    }
}