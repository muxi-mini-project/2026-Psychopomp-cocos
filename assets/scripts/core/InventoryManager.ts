import { _decorator, Component, director } from 'cc';
import { DataManager } from './DataManager';
const { ccclass } = _decorator;

@ccclass('InventoryManager')
export class InventoryManager extends Component {
    private static _instance: InventoryManager = null;
    private _selectedItem: string | null = null;

    public static get instance(): InventoryManager {
        return this._instance;
    }

    onLoad() {
        if (InventoryManager._instance) {
            this.node.destroy();
            return;
        }
        InventoryManager._instance = this;
        director.addPersistRootNode(this.node);
    }

    public selectItem(itemId: string | null): void {
        if (itemId === null) {
            this._selectedItem = null;
            director.emit("ITEM_DESELECTED");
            return;
        }

        if (DataManager.instance.hasItem(itemId)) {
            this._selectedItem = itemId;
            director.emit("ITEM_SELECTED", itemId);
        }
    }

    public getSelectedItem(): string | null {
        return this._selectedItem;
    }

    public getInventoryList(): string[] {
        return DataManager.instance.getInventoryList();
    }

    public getItemConfig(itemId: string): any {
        return DataManager.instance.getItemConfig(itemId);
    }

    onDestroy() {
        this._selectedItem = null;
    }
}
