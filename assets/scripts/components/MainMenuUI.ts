import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMenuUI')
export class MainMenuUI extends Component {
    onLoad() {
        director.on("SHOW_PAUSE_MENU", this._ButtonActive, this)
        director.on("HIDE_PAUSE_MENU", this._ButtonShow, this)
    }
    _ButtonActive() {
        this.node.active = false
    }

    _ButtonShow() {
        this.node.active = true
    }

    onDestroy() {
        director.off("SHOW_PAUSE_MENU", this._ButtonActive, this)
        director.off("HIDE_PAUSE_MENU", this._ButtonShow, this)
    }
}


