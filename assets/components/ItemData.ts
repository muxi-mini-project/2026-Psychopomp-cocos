import { _decorator, Component, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemData')
export class ItemData extends Component {
    @property({ type: SpriteFrame, displayName: "物品图标" })
    public icon: SpriteFrame | null = null;

    @property({ displayName: "是否可拾取" })
    public isPickable: boolean = true;

    @property({ displayName: "物品名称" })
    public itemName: string = "未知物品";
}