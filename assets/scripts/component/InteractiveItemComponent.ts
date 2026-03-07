import { _decorator, Component, Node, Enum, EventTouch } from "cc";
const { ccclass, property } = _decorator
import { CommonEnum } from "../../../../NewProject_1/assets/scripts/common/CommonEnum";

@ccclass('InteractiveItemComponent')
export class InteractiveItemComponent extends Component {
    @property({
        type: Enum(CommonEnum.InteractiveItemType),
        tooltip: "选择物品类型"
    })
    public itemType: number = CommonEnum.InteractiveItemType.codeYuanLi
    @property({ tooltip: "是否可以交互" })
    public isInteractive: boolean = true
    onLoad() {
        this.node.on('touchend', this.onItemClick, this)
    }

    private onItemClick() {
        if (!this.isInteractive)
            return
        this.node.emit('itemClick', {
            itemType: this.itemType,
            node: this.node
        })
        console.log('点击', CommonEnum.InteractiveItemType[this.itemType]);

    }


    //ai给的公共接口
    public setInteractiveState(interactive: boolean) {
        this.isInteractive = interactive;

    }
}
