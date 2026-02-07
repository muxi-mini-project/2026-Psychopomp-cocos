import { _decorator, Component, sys, director, JsonAsset, resources } from 'cc';
const { ccclass, property } = _decorator;

// 定义存档数据
interface SaveData {
    currentScene: string;       // 当前所在的场景名（用于读档跳转）
    inventory: string[];        // 玩家拥有的物品 ID 列表
    flags: { [key: string]: any }; // 所有的游戏状态 Flag 
    timestamp: number;          // 存档时间
}

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: DataManager = null;
    
    private _saveData: SaveData = {
        currentScene: "Scene_Intro",
        inventory: [],
        flags: {},
        timestamp: 0
    };

    // 从 JSON 加载
    private _itemConfig: Map<string, any> = new Map();

    public static get instance(): DataManager {
        return this._instance;
    }

    onLoad() {
        if (DataManager._instance) {
            this.node.destroy();
            return;
        }
        DataManager._instance = this;
        director.addPersistRootNode(this.node); // 设为常驻节点
        
        this.loadConfigs();
    }

    private loadConfigs() {
        resources.load('data/items', JsonAsset, (err, asset) => {
            if (err) {
                console.error("物品配置加载失败", err);
                return;
            }
            const items = asset.json as any[];
            items.forEach(item => this._itemConfig.set(item.id, item));
            console.log("物品配置加载完毕，数量:", this._itemConfig.size);
        });
    }

    public getItemConfig(itemId: string) {
        return this._itemConfig.get(itemId);
    }

    public startNewGame() {
        this._saveData = {
            currentScene: "Scene_Intro", // 初始场景
            inventory: [],
            flags: {}, // 空对象代表所有 Flag 为 false/undefined
            timestamp: Date.now()
        };

        // 设置一些初始状态
        // this.setFlag("DOOR_LOCKED", true); 
        // this.setFlag("QUEST_STAGE", 1);
        this.save();
    }

    public save() {
        this._saveData.timestamp = Date.now();
        // 如果不在过场动画中，记录当前场景
        const currentSceneName = director.getScene().name;
        if (currentSceneName !== "Intro" && currentSceneName !== "Outro") {
            this._saveData.currentScene = currentSceneName;
        }
        
        const jsonStr = JSON.stringify(this._saveData);
        sys.localStorage.setItem('MyGame_Save_01', jsonStr);
        console.log("游戏已保存:", jsonStr);
    }

    /**
     * 读取存档
     * @returns boolean 读取是否成功
     */
    public load(): boolean {
        const jsonStr = sys.localStorage.getItem('MyGame_Save_01');
        if (!jsonStr || jsonStr === "") {
            console.log("没有找到存档");
            return false;
        }
        try {
            this._saveData = JSON.parse(jsonStr);
            console.log("存档读取成功", this._saveData);
            return true;
        } catch (e) {
            console.error("存档损坏", e);
            return false;
        }
    }

    public addItem(itemId: string) {
        if (!this._saveData.inventory.includes(itemId)) {
            this._saveData.inventory.push(itemId);
            // 触发 UI 刷新事件
            director.emit("INVENTORY_UPDATE");
            this.save(); // 自动保存
        }
    }

    public hasItem(itemId: string): boolean {
        return this._saveData.inventory.includes(itemId);
    }

    public getInventoryList(): string[] {
        return this._saveData.inventory;
    }

    public removeItem(itemId: string) {
        const index = this._saveData.inventory.indexOf(itemId);
        if (index > -1) {
            this._saveData.inventory.splice(index, 1);
            director.emit("INVENTORY_UPDATE");
            this.save();
        }
    }

    public getFlag(key: string, defaultValue: any = false): any {
        if (this._saveData.flags.hasOwnProperty(key)) {
            return this._saveData.flags[key];
        }
        return defaultValue;
    }
    
    /**
     * 设置 Flag
     * @param key 标识符，如 'is_door_open'
     * @param value 值，通常是 boolean，也可以是数字(比如任务阶段 1,2,3)
     */
    public setFlag(key: string, value: any) {
        this._saveData.flags[key] = value;
        console.log(`[Flag Update] ${key} = ${value}`);
        this.save(); 
    }



    public getBool(key: string): boolean {
        return !!this.getFlag(key, false);
    }

    public checkFirstVisit(sceneName: string): boolean {
        const key = `VISITED_${sceneName}`;
        if (!this.getBool(key)) {
            this.setFlag(key, true);
            this.save();
            return true;
        }
        return false;
    }
}