import { _decorator, Component, Label, Button, tween, Vec3, director, Node, input } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PhonePwd')
export class PhonePwd extends Component {

    @property(Label)
    inputDisplayLabel: Label = null

    @property(Button)
    delButton: Button = null

    @property(Button)
    okButton: Button = null

    @property(Button)
    clearButton: Button = null

    @property(Button)
    backButton: Button = null

    @property(Button)
    enterButton: Button = null

    private readonly correctPwd = "W1S21T14"
    private inputStr = ""

    private keyMap: Record<string, string[]> = {
        Btn_1: ['1'],
        Btn_2: ['2', 'A', 'B', 'C'],
        Btn_3: ['3', 'D', 'E', 'F'],
        Btn_4: ['4', 'G', 'H', 'I'],
        Btn_5: ['5', 'J', 'K', 'L'],
        Btn_6: ['6', 'M', 'N', 'O'],
        Btn_7: ['7', 'P', 'Q', 'R', 'S'],
        Btn_8: ['8', 'T', 'U', 'V'],
        Btn_9: ['9', 'W', 'X', 'Y', 'Z'],
        Btn_0: ['0'],
    }

    private lastKey = ""
    private currentIndex = 0

    onLoad() {
        this.bindAllButtons()
        this.updateDisplay()
        this.okButton.node.active = false
        this.enterButton.node.active = true
    }


    bindAllButtons() {
        const buttons = this.node.getComponentsInChildren(Button)
        for (let btn of buttons) {
            btn.node.on('click', () => {
                this.onButtonClick(btn.node.name, btn.node)
            })
        }
    }

    playAnimation(target: Node) {
        //这里可以根据需要添加按键动画
        tween(target)
            .to(0.1, { scale: new Vec3(0.9, 0.9, 0.9) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start()

    }

    onButtonClick(name: string, target: Node) {
        director.emit("CLEAR_FAIL")
        this.playAnimation(target)
        if (name === "Btn_Clear") {
            this.clearInput()
            return
        }

        if (name === "Btn_Back") {
            director.emit("BACK")
            //返回上一个界面
            return
        }

        if (name === "Btn_Del") {
            this.deleteLastChar()
            return
        }

        if (name === "Btn_Ok") {
            this.onOk()
            return
        }

        if (name === "Btn_Enter") {
            this.onEnter()
            return
        }

        if (!this.keyMap[name]) return
        const chars = this.keyMap[name]

        if (this.lastKey === name) {
            this.okButton.node.active = true
            this.enterButton.node.active = false
            this.inputStr = this.inputStr.slice(0, -1)
            this.currentIndex = (this.currentIndex + 1) % chars.length
        }
        else {
            this.currentIndex = 0
        }

        const c = chars[this.currentIndex]
        this.inputStr += c

        if (this.inputStr.length > 10) {
            this.inputStr = this.inputStr.slice(0, 10)
        }

        this.lastKey = name
        this.updateDisplay()
    }

    onOk() {
        this.lastKey = ""
        this.currentIndex = 0
        this.okButton.node.active = false
        this.enterButton.node.active = true
    }

    onEnter() {
        this.checkPassword()
    }

    checkPassword() {
        if (this.inputStr.toUpperCase() === this.correctPwd) {
            console.log("密码正确")
            director.emit("PHONE_PWD_SUCCESS")
            //密码正确
            //触发后续
        } else {
            //密码错误，震动并清空输入
            console.log("密码错误")
            director.emit("PHONE_PWD_FAIL")
            setTimeout(() => this.clearInput(), 500)
            this.shake()
        }
    }

    deleteLastChar() {
        if (this.inputStr.length > 0) {
            this.inputStr = this.inputStr.slice(0, -1)
            this.updateDisplay()
        }
    }

    clearInput() {
        this.inputStr = ""
        this.lastKey = ""
        this.currentIndex = 0
        this.updateDisplay()
    }

    //同步到输入框
    updateDisplay() {
        this.inputDisplayLabel.string = this.inputStr
    }

    //震动
    shake() {
        tween(this.node)
            .by(0.05, { x: -6 })
            .by(0.05, { x: 12 })
            .by(0.05, { x: -6 })
            .start()
    }
}