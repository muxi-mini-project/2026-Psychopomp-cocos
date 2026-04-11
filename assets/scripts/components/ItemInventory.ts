import { _decorator, Component, director, Node, instantiate, Prefab } from 'cc'
const { ccclass, property } = _decorator
import { Slot } from './Slot'
import { resources } from 'cc'
import { DataManager } from '../core/DataManager'

@ccclass('ItemInventory')
export class ItemInventory extends Component {
    @property({ type: Node })
    slots: Node[] = []

    private _loadingItems: Set<string> = new Set()

    onLoad() {
        console.log("[ItemInventory] onLoad, slots数量:", this.slots.length)
        director.on('PICK_UP_ITEM', this.onPickupItem, this)
        director.on('ITEM_REMOVED', this.onItemRemoved, this)
    }

    /**
     * 物品被移除（可消耗物品使用后触发）
     */
    onItemRemoved(itemId: string): void {
        console.log(`[ItemInventory] onItemRemoved: ${itemId}`)
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i].getComponent(Slot)
            if (slot && slot.itemId === itemId) {
                console.log(`[ItemInventory] 从slot ${i} 移除物品: ${itemId}`)
                if (slot.ItemIcon) {
                    slot.ItemIcon.destroy()
                    slot.ItemIcon = null
                }
                slot.itemId = ""
                return
            }
        }
    }

    /**
     * 清空所有 slots
     */
    clearAllSlots(): void {
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i].getComponent(Slot)
            if (slot && !slot.isEmpty()) {
                if (slot.ItemIcon) {
                    slot.ItemIcon.destroy()
                    slot.ItemIcon = null
                }
                slot.itemId = ""
            }
        }
        console.log("[ItemInventory] clearAllSlots 完成")
    }

    /**
     * 从存档恢复物品栏（手动调用）
     */
    async restoreInventory(): Promise<void> {
        const inventoryList = DataManager.instance.getInventoryList()
        console.log(`[ItemInventory] restoreInventory, inventoryList:`, inventoryList)

        // 清空现有物品
        this.clearAllSlots()

        if (!inventoryList || inventoryList.length === 0) {
            console.log("[ItemInventory] 存档中无物品")
            return
        }

        // 逐个顺序加载物品（避免并发加载导致槽位冲突）
        for (let i = 0; i < inventoryList.length; i++) {
            const itemId = inventoryList[i]
            await this._loadItemToSlotAsync(itemId)
        }
    }

    onPickupItem(data: { itemId: string }) {
        console.log(`[ItemInventory] onPickupItem: ${data.itemId}`)

        // 防止重复添加
        if (this._loadingItems.has(data.itemId)) {
            console.log(`[ItemInventory] 物品正在加载中，忽略: ${data.itemId}`)
            return
        }

        // 检查物品是否已经在某个 slot 中
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i].getComponent(Slot)
            if (slot && slot.itemId === data.itemId) {
                console.log(`[ItemInventory] 物品已在slot中: ${data.itemId}`)
                return
            }
        }

        // 找到空 slot 并加载
        this._loadItemToSlot(data.itemId)
    }

    private _loadItemToSlot(itemId: string): void {
        // 找到空 slot
        let slotNode: Node | null = null
        let slot: Slot | null = null
        for (let i = 0; i < this.slots.length; i++) {
            const s = this.slots[i].getComponent(Slot)
            if (s && s.isEmpty()) {
                slotNode = this.slots[i]
                slot = s
                break
            }
        }

        if (!slotNode || !slot) {
            console.log('物品栏已满！')
            return
        }

        this._loadItemPrefab(itemId, slotNode, slot)
    }

    private _loadItemToSlotAsync(itemId: string): Promise<void> {
        return new Promise((resolve) => {
            // 找到空 slot
            let slotNode: Node | null = null
            let slot: Slot | null = null
            for (let i = 0; i < this.slots.length; i++) {
                const s = this.slots[i].getComponent(Slot)
                if (s && s.isEmpty()) {
                    slotNode = this.slots[i]
                    slot = s
                    break
                }
            }

            if (!slotNode || !slot) {
                console.log('物品栏已满！')
                resolve()
                return
            }

            this._loadItemPrefabAsync(itemId, slotNode, slot, resolve)
        })
    }

    private _loadItemPrefab(itemId: string, slotNode: Node, slot: Slot): void {
        this._loadingItems.add(itemId)

        // 预制体路径: prefabs/Items/Item_{itemId}
        const prefabPath = `prefabs/Items/Item_${itemId}`
        console.log(`[ItemInventory] 加载预制体: ${prefabPath}`)

        resources.load(prefabPath, Prefab, (err: Error | null, prefab: Prefab | null) => {
            if (err) {
                console.error(`[ItemInventory] 加载预制体失败: ${prefabPath}`, err)
                this._loadingItems.delete(itemId)
                return
            }

            console.log(`[ItemInventory] 预制体加载成功，实例化: ${prefabPath}`)
            const iconNode = instantiate(prefab)
            iconNode.setParent(slotNode)
            iconNode.setScale(1, 1, 1)
            slot.setItemIcon(iconNode, itemId)
            this._loadingItems.delete(itemId)
            console.log(`[ItemInventory] 物品添加成功: ${itemId}`)
        })
    }

    private _loadItemPrefabAsync(itemId: string, slotNode: Node, slot: Slot, onComplete: () => void): void {
        this._loadingItems.add(itemId)

        // 预制体路径: prefabs/Items/Item_{itemId}
        const prefabPath = `prefabs/Items/Item_${itemId}`
        console.log(`[ItemInventory] 加载预制体: ${prefabPath}`)

        resources.load(prefabPath, Prefab, (err: Error | null, prefab: Prefab | null) => {
            if (err) {
                console.error(`[ItemInventory] 加载预制体失败: ${prefabPath}`, err)
                this._loadingItems.delete(itemId)
                onComplete()
                return
            }

            console.log(`[ItemInventory] 预制体加载成功，实例化: ${prefabPath}`)
            const iconNode = instantiate(prefab)
            iconNode.setParent(slotNode)
            iconNode.setScale(1, 1, 1)
            slot.setItemIcon(iconNode, itemId)
            this._loadingItems.delete(itemId)
            console.log(`[ItemInventory] 物品添加成功: ${itemId}`)
            onComplete()
        })
    }
}

