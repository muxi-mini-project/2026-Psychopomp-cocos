import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Slot')
export class Slot extends Component {
    @property
    itemId: string = ""

    onLoad() {
        this.node.on('click', this.onItemClick, this)
    }
    onItemClick() {
        //选中物体
        director.emit("ITEM_SELECTED", this.itemId)
    }
}