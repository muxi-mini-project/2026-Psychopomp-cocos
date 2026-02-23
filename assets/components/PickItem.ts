import { _decorator, Component, Node } from 'cc';
import { ItemData } from './ItemData';
import { ItemInventory } from './ItemInventory';
const { ccclass, property } = _decorator;

@ccclass('PickItem')
export class PickItem extends Component {
    @property({ type: ItemInventory, displayName: "背包管理器" })
    public inventory: ItemInventory | null = null;

    private itemData: ItemData | null = null;

    onLoad() {
        this.itemData = this.getComponent(ItemData);
    }

    // 点击拾取
    public onPick() {
        if (!this.itemData || !this.inventory || !this.itemData.isPickable) return;
        this.inventory.pickItem(this.itemData);
        this.node.destroy(); // 拾取后销毁物品节点
    }
}