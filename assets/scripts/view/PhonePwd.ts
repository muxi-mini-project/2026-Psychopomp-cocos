import { _decorator, Component, Label, Button, tween, Vec3, director, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PhonePwd')
export class PhonePwd extends Component {

    @property(Label)
    inputDisplayLabel: Label = null

    @property(Button)
    okButton: Button = null

    @property(Button)
    enterButton: Button = null

    @property(Button)
    Btn_1: Button = null

    @property(Button)
    Btn_2: Button = null
    @property(Button)
    Btn_3: Button = null
    @property(Button)
    Btn_4: Button = null
    @property(Button)
    Btn_5: Button = null
    @property(Button)
    Btn_6: Button = null
    @property(Button)
    Btn_7: Button = null
    @property(Button)
    Btn_8: Button = null
    @property(Button)
    Btn_9: Button = null
    @property(Button)
    Btn_0: Button = null
    @property(Button)
    Btn_Clear: Button = null
    @property(Button)
    Btn_Del: Button = null
    @property(Button)
    Btn_Back: Button = null

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
    private isChoosing = false

    onLoad() {
        this.bindButtons()
        this.updateDisplay()
        this.showEnter() // 初始显示Enter
    }

    bindButtons() {
        this.Btn_1.node.on('click', () => this.onNumberClick("Btn_1", this.Btn_1.node), this)
        this.Btn_2.node.on('click', () => this.onNumberClick("Btn_2", this.Btn_2.node), this)
        this.Btn_3.node.on('click', () => this.onNumberClick("Btn_3", this.Btn_3.node), this)
        this.Btn_4.node.on('click', () => this.onNumberClick("Btn_4", this.Btn_4.node), this)
        this.Btn_5.node.on('click', () => this.onNumberClick("Btn_5", this.Btn_5.node), this)
        this.Btn_6.node.on('click', () => this.onNumberClick("Btn_6", this.Btn_6.node), this)
        this.Btn_7.node.on('click', () => this.onNumberClick("Btn_7", this.Btn_7.node), this)
        this.Btn_8.node.on('click', () => this.onNumberClick("Btn_8", this.Btn_8.node), this)
        this.Btn_9.node.on('click', () => this.onNumberClick("Btn_9", this.Btn_9.node), this)
        this.Btn_0.node.on('click', () => this.onNumberClick("Btn_0", this.Btn_0.node), this)

        this.Btn_Clear.node.on('click', () => this.onNumberClick("Btn_Clear", this.Btn_Clear.node), this)
        this.Btn_Del.node.on('click', () => this.onNumberClick("Btn_Del", this.Btn_Del.node), this)
        this.Btn_Back.node.on('click', () => this.onNumberClick("Btn_Back", this.Btn_Back.node), this)

        this.okButton.node.on('click', () => this.onOk(), this)
        this.enterButton.node.on('click', () => this.onEnter(), this)
    }

    playAnimation(target: Node) {
        tween(target)
            .to(0.1, { scale: new Vec3(0.9, 0.9, 0.9) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start()
    }

    onNumberClick(name: string, target: Node) {
        if (!target.active) return
        director.emit("CLEAR_FAIL")
        this.playAnimation(target)

        if (this.isChoosing) {
            // 正在选字符 → 只允许：当前键 或 OK
            if (name === this.lastKey || name === "Btn_Ok" || name === "Btn_Del" || name === "Btn_Clear") {
                // 允许
            } else {
                // 其他键全部拦截！
                return
            }
        }

        if (name === "Btn_Clear") {
            this.clearInput()
            return
        }

        if (name === "Btn_Back") {
            director.emit("BACK")
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

        this.showOk()

        if (this.lastKey === name) {
            this.inputStr = this.inputStr.slice(0, -1)
            this.currentIndex = (this.currentIndex + 1) % chars.length
        } else {
            this.currentIndex = 0
        }

        if (chars.length > 1) {
            this.showOk()
        } else {
            this.showEnter()
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
        this.showEnter()
    }

    onEnter() {
        this.playAnimation(this.enterButton.node)
        this.checkPassword()
    }

    checkPassword() {
        if (this.inputStr.toUpperCase() === this.correctPwd) {
            console.log("密码正确")
            director.emit("PHONE_PWD_SUCCESS")
        } else {
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
            this.showEnter()
            this.lastKey = ""
            this.currentIndex = 0
        }
    }

    clearInput() {
        this.inputStr = ""
        this.lastKey = ""
        this.currentIndex = 0
        this.showEnter()
        this.updateDisplay()
    }

    updateDisplay() {
        this.inputDisplayLabel.string = this.inputStr
    }

    showOk() {
        this.isChoosing = true
        this.okButton.node.active = true
        this.enterButton.node.active = false
    }

    showEnter() {
        this.isChoosing = false
        this.okButton.node.active = false
        this.enterButton.node.active = true
    }

    shake() {
        tween(this.node)
            .by(0.05, { x: -6 })
            .by(0.05, { x: 12 })
            .by(0.05, { x: -6 })
            .start()
    }
}