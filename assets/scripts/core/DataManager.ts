import { _decorator, Component, sys, director, JsonAsset, resources } from 'cc';
const { ccclass, property } = _decorator;

interface SaveData {
    saveId: string;
    saveTime: number;
    gameVersion: string;
    currentScene: string;
    isSubscene: boolean;
    currentSubscene?: string;
    currentChapter: string;
    currentStoryNode: string;
    storyFlags: { [key: string]: any };
    inventory: string[];
    usedItems: string[];
    interactableStates: { [interactableId: string]: any };
    readDialogues: string[];
}

interface SaveSlotInfo {
    slotId: string;
    saveTime: number;
    chapter: string;
    scene: string;
    hasSave: boolean;
}

const GAME_VERSION = "1.0.0";
const MAX_SAVE_SLOTS = 6;
const AUTO_SAVE_SLOT = "auto_save";

export type { SaveData, SaveSlotInfo };

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: DataManager = null;

    private _saveData: SaveData = null;
    private _itemConfig: Map<string, any> = new Map();
    private _sceneConfig: Map<string, any> = new Map();
    private _dialogueConfig: Map<string, any> = new Map();

    public static get instance(): DataManager {
        return this._instance;
    }

    onLoad() {
        if (DataManager._instance) {
            this.node.destroy();
            return;
        }
        DataManager._instance = this;
        director.addPersistRootNode(this.node);

        this.loadConfigs();
    }

    private loadConfigs() {
        resources.load('data/items', JsonAsset, (err, asset) => {
            if (err) {
                console.error("[DataManager] 物品配置加载失败", err);
                return;
            }
            const items = asset.json as any[];
            items.forEach(item => this._itemConfig.set(item.id, item));
        });

        resources.load('data/scenes', JsonAsset, (err, asset) => {
            if (err) {
                console.error("[DataManager] 场景配置加载失败", err);
                return;
            }
            const scenes = asset.json.scenes || {};
            for (const [id, config] of Object.entries(scenes)) {
                this._sceneConfig.set(id, config);
            }
        });

        resources.load('data/dialogues', JsonAsset, (err, asset) => {
            if (err) {
                console.error("[DataManager] 对话配置加载失败", err);
                return;
            }
            const dialogues = asset.json.dialogues || {};
            for (const [id, config] of Object.entries(dialogues)) {
                this._dialogueConfig.set(id, config);
            }
        });
    }

    public getItemConfig(itemId: string) {
        return this._itemConfig.get(itemId);
    }

    public getSceneConfig(sceneId: string) {
        return this._sceneConfig.get(sceneId);
    }

    public getDialogueConfig(dialogueId: string) {
        return this._dialogueConfig.get(dialogueId);
    }

    public getSaveSlotInfo(slotId: string): SaveSlotInfo {
        const key = this._getStorageKey(slotId);
        const jsonStr = sys.localStorage.getItem(key);

        if (!jsonStr || jsonStr === "") {
            return {
                slotId: slotId,
                saveTime: 0,
                chapter: "-",
                scene: "-",
                hasSave: false
            };
        }

        try {
            const data = JSON.parse(jsonStr) as SaveData;
            return {
                slotId: slotId,
                saveTime: data.saveTime,
                chapter: data.currentChapter || "-",
                scene: data.currentScene || "-",
                hasSave: true
            };
        } catch (e) {
            console.error("[DataManager] 存档槽位信息读取失败", slotId, e);
            return {
                slotId: slotId,
                saveTime: 0,
                chapter: "-",
                scene: "-",
                hasSave: false
            };
        }
    }

    public getAllSaveSlots(): SaveSlotInfo[] {
        const slots: SaveSlotInfo[] = [];
        for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
            slots.push(this.getSaveSlotInfo(`slot_${i.toString().padStart(2, '0')}`));
        }
        return slots;
    }

    public deleteSave(slotId: string): boolean {
        const key = this._getStorageKey(slotId);
        sys.localStorage.removeItem(key);
        console.log(`[DataManager] 存档已删除: ${slotId}`);

        if (this._saveData && this._saveData.saveId === slotId) {
            this._saveData = null;
        }

        return true;
    }

    public saveGame(slotId: string = AUTO_SAVE_SLOT, quickSave: boolean = false): boolean {
        if (!this._saveData) {
            console.error("[DataManager] 没有可保存的数据");
            return false;
        }

        this._saveData.saveTime = Date.now();
        this._saveData.gameVersion = GAME_VERSION;

        const key = this._getStorageKey(slotId);
        const jsonStr = JSON.stringify(this._saveData);
        sys.localStorage.setItem(key, jsonStr);

        if (!quickSave) {
            director.emit("SAVE_COMPLETE", slotId);
            console.log(`[DataManager] 游戏已保存: ${slotId}`);
        }

        return true;
    }

    public loadGame(slotId: string): boolean {
        const key = this._getStorageKey(slotId);
        const jsonStr = sys.localStorage.getItem(key);

        if (!jsonStr || jsonStr === "") {
            console.log(`[DataManager] 没有找到存档: ${slotId}`);
            return false;
        }

        try {
            const data = JSON.parse(jsonStr) as SaveData;

            if (data.gameVersion !== GAME_VERSION) {
                console.warn(`[DataManager] 存档版本不匹配: 存档 ${data.gameVersion}, 当前 ${GAME_VERSION}`);
            }

            this._saveData = data;

            director.emit("LOAD_COMPLETE", slotId);
            console.log(`[DataManager] 存档读取成功: ${slotId}`);

            return true;
        } catch (e) {
            console.error("[DataManager] 存档损坏", slotId, e);
            return false;
        }
    }

    public startNewGame(): void {
        this._saveData = {
            saveId: "new_game",
            saveTime: Date.now(),
            gameVersion: GAME_VERSION,
            currentScene: "scene_intro",
            isSubscene: false,
            currentSubscene: undefined,
            currentChapter: "chapter_01",
            currentStoryNode: "node_01",
            storyFlags: {},
            inventory: [],
            usedItems: [],
            interactableStates: {},
            readDialogues: []
        };

        console.log("[DataManager] 新游戏已初始化");
        this.saveGame(AUTO_SAVE_SLOT, true);
    }

    public hasSave(slotId: string): boolean {
        return this.getSaveSlotInfo(slotId).hasSave;
    }

    public getCurrentChapter(): string {
        return this._saveData?.currentChapter || "chapter_01";
    }

    public setCurrentChapter(chapterId: string): void {
        if (this._saveData) {
            this._saveData.currentChapter = chapterId;
        }
    }

    public getCurrentStoryNode(): string {
        return this._saveData?.currentStoryNode || "node_01";
    }

    public setCurrentStoryNode(nodeId: string): void {
        if (this._saveData) {
            this._saveData.currentStoryNode = nodeId;
        }
    }

    public getStoryFlag(key: string, defaultValue: any = undefined): any {
        if (!this._saveData || !this._saveData.storyFlags) {
            return defaultValue;
        }
        if (this._saveData.storyFlags.hasOwnProperty(key)) {
            return this._saveData.storyFlags[key];
        }
        return defaultValue;
    }

    public setStoryFlag(key: string, value: any): void {
        if (this._saveData) {
            this._saveData.storyFlags[key] = value;
            console.log(`[DataManager] StoryFlag: ${key} = ${value}`);
        }
    }

    public getStoryFlagBool(key: string, defaultValue: boolean = false): boolean {
        return !!this.getStoryFlag(key, defaultValue);
    }

    public getCurrentScene(): string {
        return this._saveData?.currentScene || "scene_intro";
    }

    public setCurrentScene(sceneId: string): void {
        if (this._saveData) {
            this._saveData.currentScene = sceneId;
        }
    }

    public isInSubscene(): boolean {
        return this._saveData?.isSubscene || false;
    }

    public enterSubscene(subsceneId: string): void {
        if (this._saveData) {
            this._saveData.isSubscene = true;
            this._saveData.currentSubscene = subsceneId;
        }
    }

    public exitSubscene(): void {
        if (this._saveData) {
            this._saveData.isSubscene = false;
            this._saveData.currentSubscene = undefined;
        }
    }

    public getInteractableState(interactableId: string, defaultValue: any = undefined): any {
        if (!this._saveData || !this._saveData.interactableStates) {
            return defaultValue;
        }
        if (this._saveData.interactableStates.hasOwnProperty(interactableId)) {
            return this._saveData.interactableStates[interactableId];
        }
        return defaultValue;
    }

    public setInteractableState(interactableId: string, state: any): void {
        if (this._saveData) {
            this._saveData.interactableStates[interactableId] = state;
            console.log(`[DataManager] InteractableState: ${interactableId} =`, state);
        }
    }

    public addItem(itemId: string): void {
        if (!this._saveData) return;

        if (!this._saveData.inventory.includes(itemId)) {
            this._saveData.inventory.push(itemId);
            director.emit("ITEM_ADDED", itemId);
            director.emit("INVENTORY_UPDATE");
            console.log(`[DataManager] 添加物品: ${itemId}`);
        }
    }

    public removeItem(itemId: string): void {
        if (!this._saveData) return;

        const index = this._saveData.inventory.indexOf(itemId);
        if (index > -1) {
            this._saveData.inventory.splice(index, 1);
            director.emit("ITEM_REMOVED", itemId);
            director.emit("INVENTORY_UPDATE");
            console.log(`[DataManager] 移除物品: ${itemId}`);
        }
    }

    public hasItem(itemId: string): boolean {
        return this._saveData?.inventory.includes(itemId) || false;
    }

    public getInventoryList(): string[] {
        return this._saveData?.inventory || [];
    }

    public markItemUsed(itemId: string): void {
        if (!this._saveData) return;

        if (!this._saveData.usedItems.includes(itemId)) {
            this._saveData.usedItems.push(itemId);
            director.emit("ITEM_USED", itemId);
            console.log(`[DataManager] 物品已使用: ${itemId}`);
        }
    }

    public isItemUsed(itemId: string): boolean {
        return this._saveData?.usedItems.includes(itemId) || false;
    }

    public markDialogueRead(dialogueId: string): void {
        if (!this._saveData) return;

        if (!this._saveData.readDialogues.includes(dialogueId)) {
            this._saveData.readDialogues.push(dialogueId);
        }
    }

    public isDialogueRead(dialogueId: string): boolean {
        return this._saveData?.readDialogues.includes(dialogueId) || false;
    }

    public getFlag(key: string, defaultValue: any = false): any {
        return this.getStoryFlag(key, defaultValue);
    }

    public setFlag(key: string, value: any): void {
        this.setStoryFlag(key, value);
    }

    public getBool(key: string): boolean {
        return this.getStoryFlagBool(key, false);
    }

    private _getStorageKey(slotId: string): string {
        return `Psychopomp_Save_${slotId}`;
    }

    public checkFirstVisit(sceneName: string): boolean {
        const key = `VISITED_${sceneName}`;
        if (!this.getStoryFlagBool(key)) {
            this.setStoryFlag(key, true);
            return true;
        }
        return false;
    }
}
