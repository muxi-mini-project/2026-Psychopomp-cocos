import { _decorator, Component, Node, Button, Vec3, tween, director, Toggle, Slider, Label, game } from 'cc';
const SLIDER_CHANGE_EVENT = 'slide'
const { ccclass, property } = _decorator;

// 菜单类型枚举（规范菜单切换逻辑）
export enum MenuType {
    MAIN_MENU = "mainMenu",  // 主菜单（默认显示）
    SAVE_MENU = "saveMenu",  // 存档菜单
    SETTING_MENU = "settingMenu" // 设置菜单
}

@ccclass('MenuSystem')
export class MenuSystem extends Component {
    // ==================== 编辑器配置项（必配） ====================
    @property({ type: Node, displayName: "主菜单节点" })
    public mainMenu: Node = null!; // 包含「新游戏、存档、设置」按钮的节点

    @property({ type: Node, displayName: "存档菜单节点" })
    public saveMenu: Node = null!; // 存档界面节点（包含存档位、返回按钮）

    @property({ type: Node, displayName: "设置菜单节点" })
    public settingMenu: Node = null!; // 设置界面节点（音量、画质等）

    @property({ type: [Node], displayName: "存档位节点（最多3个）" })
    public saveSlots: Node[] = []; // 存档位节点（每个存档位需有Button和Label）

    @property({ displayName: "新游戏跳转的初始场景名" })
    public startSceneName: string = "start_scene"; // 新游戏首次加载的场景

    // ==================== 设置相关配置项（可选） ====================
    @property({ type: Slider, displayName: "背景音乐音量滑块" })
    public bgmSlider: Slider | null = null;

    @property({ type: Slider, displayName: "音效音量滑块" })
    public soundSlider: Slider | null = null;

    @property({ type: Toggle, displayName: "全屏切换开关" })
    public fullscreenToggle: Toggle | null = null;

    @property({ type: Label, displayName: "音量显示标签" })
    public volumeLabel: Label | null = null;

    // ==================== 内部变量 ====================
    private currentMenu: MenuType = MenuType.MAIN_MENU; // 当前显示的菜单
    private saveData: { [key: number]: { time: string, scene: string } } = {}; // 存档数据（存档位索引: 数据）

    // ==================== 生命周期 ====================
    onLoad() {
        // 初始化菜单状态（只显示主菜单，隐藏其他菜单）
        this.initMenuState();
        // 初始化按钮事件绑定
        this.initMenuButtons();
        // 初始化存档数据（模拟读取本地存档，实际可替换为本地存储逻辑）
        this.initSaveData();
        // 初始化设置面板（读取默认设置）
        this.initSettingPanel();
    }

    // ==================== 菜单初始化 ====================
    /** 初始化菜单显示状态，确保默认只显示主菜单 */
    private initMenuState() {
        this.mainMenu.active = true;
        this.saveMenu.active = false;
        this.settingMenu.active = false;

        // 校验必填节点
        if (!this.mainMenu || !this.saveMenu || !this.settingMenu) {
            console.error("[菜单系统] 主菜单/存档菜单/设置菜单节点未绑定！");
        }
        if (this.saveSlots.length === 0) {
            console.warn("[菜单系统] 未绑定存档位节点，存档功能无法使用");
        }
    }

    /** 绑定所有菜单按钮的点击事件 */
    private initMenuButtons() {
        // 1. 主菜单按钮绑定（新游戏、存档、设置）
        this.bindMainMenuButtons();
        // 2. 存档菜单按钮绑定（返回、存档位）
        this.bindSaveMenuButtons();
        // 3. 设置菜单按钮绑定（返回、全屏、音量）
        this.bindSettingMenuButtons();
    }

    // ==================== 主菜单按钮绑定 ====================
    private bindMainMenuButtons() {
        // 新游戏按钮（查找主菜单下名为"Btn_NewGame"的按钮）
        const newGameBtn = this.findButtonInNode(this.mainMenu, "NewGame");
        if (newGameBtn) {
            this.bindButtonEvent(newGameBtn, this.onNewGameClick);
        }

        // 存档按钮（查找主菜单下名为"Btn_Save"的按钮）
        const saveBtn = this.findButtonInNode(this.mainMenu, "SaveGame");
        if (saveBtn) {
            this.bindButtonEvent(saveBtn, () => this.switchMenu(MenuType.SAVE_MENU));
        }

        // 设置按钮（查找主菜单下名为"Btn_Setting"的按钮）
        const settingBtn = this.findButtonInNode(this.mainMenu, "Setting");
        if (settingBtn) {
            this.bindButtonEvent(settingBtn, () => this.switchMenu(MenuType.SETTING_MENU));
        }
    }

    // ==================== 存档菜单按钮绑定 ====================
    private bindSaveMenuButtons() {
        // 返回主菜单按钮（查找存档菜单下名为"Btn_Back"的按钮）
        const backBtn = this.findButtonInNode(this.saveMenu, "Back");
        if (backBtn) {
            this.bindButtonEvent(backBtn, () => this.switchMenu(MenuType.MAIN_MENU));
        }

        // 绑定所有存档位按钮（点击存档/读档）
        this.saveSlots.forEach((slotNode, index) => {
            const slotBtn = slotNode.getComponent(Button) || slotNode.addComponent(Button);
            // 绑定存档位点击事件（点击即存档，覆盖当前存档位）
            this.bindButtonEvent(slotBtn, () => this.saveGame(index, slotNode));
            // 更新存档位显示（显示存档时间、场景）
            this.updateSaveSlotDisplay(index);
        });
    }

    // ==================== 设置菜单按钮绑定 ====================
    private bindSettingMenuButtons() {
        // 返回主菜单按钮（查找设置菜单下名为"Btn_Back"的按钮）
        const backBtn = this.findButtonInNode(this.settingMenu, "Back");
        if (backBtn) {
            this.bindButtonEvent(backBtn, () => this.switchMenu(MenuType.MAIN_MENU));
        }

        // 全屏切换按钮绑定
        if (this.fullscreenToggle) {
            this.fullscreenToggle.node.on(Toggle.EventType.TOGGLE, this.onFullscreenToggle, this);
            // 默认匹配当前屏幕状态（修正：用game.canvas代替director.window）
            this.fullscreenToggle.isChecked = game.canvas.ownerDocument.fullscreenElement !== null;
        }

        // 背景音乐音量滑块绑定（核心修正：用字符串常量替代Slider.EventType）
        if (this.bgmSlider) {
            this.bgmSlider.node.on(SLIDER_CHANGE_EVENT, this.onBgmVolumeChange, this);
            // 默认音量0.7
            this.bgmSlider.progress = 0.7;
            this.updateVolumeLabel(0.7);
        }

        // 音效音量滑块绑定（同步修正，统一用字符串常量）
        if (this.soundSlider) {
            this.soundSlider.node.on(SLIDER_CHANGE_EVENT, this.onSoundVolumeChange, this);
            this.soundSlider.progress = 0.7;
        }
    }

    // ==================== 核心功能实现 ====================
    /** 开启新游戏 */
    private onNewGameClick() {
        console.log("[菜单系统] 开启新游戏，跳转至初始场景");
        // 方式1：优先调用AVG交互管理器切换场景（兼容原有框架）
        const interactionMgr = window['AVGInteractionManager']?.instance;
        if (interactionMgr && typeof interactionMgr.onSwitchScene === 'function') {
            interactionMgr.onSwitchScene(this.startSceneName);
            return;
        }
    }

    /** 存档游戏（index：存档位索引0-2）（修正：添加slotNode参数，解决变量未定义） */
    private saveGame(index: number, slotNode: Node) {
        // 模拟存档数据（实际开发中可替换为cc.sys.localStorage存储，永久保存）
        // 修正：用director.getScene()代替director.scene获取当前场景
        const currentScene = director.getScene()?.name || "初始菜单";
        this.saveData[index] = {
            time: new Date().toLocaleString(), // 存档时间
            scene: currentScene // 当前存档场景（新游戏未进入场景时显示"初始菜单"）
        };
        console.log(`[菜单系统] 存档成功！存档位${index + 1}，场景：${this.saveData[index].scene}`);
        // 更新存档位显示
        this.updateSaveSlotDisplay(index);
    }

    /** 切换菜单（隐藏当前菜单，显示目标菜单） */
    private switchMenu(targetMenu: MenuType) {
        // 隐藏当前菜单
        this.getMenuNode(this.currentMenu).active = false;
        // 显示目标菜单
        this.getMenuNode(targetMenu).active = true;
        // 更新当前菜单状态
        this.currentMenu = targetMenu;
        console.log(`[菜单系统] 切换至${targetMenu}菜单`);
        // 播放菜单切换动画（可选）
        this.playMenuSwitchEffect(this.getMenuNode(targetMenu));
    }

    // ==================== 辅助功能 ====================
    /** 根据菜单类型获取对应的节点 */
    private getMenuNode(menuType: MenuType): Node {
        switch (menuType) {
            case MenuType.MAIN_MENU: return this.mainMenu;
            case MenuType.SAVE_MENU: return this.saveMenu;
            case MenuType.SETTING_MENU: return this.settingMenu;
            default: return this.mainMenu;
        }
    }

    /** 在指定节点下查找按钮（根据节点名称） */
    private findButtonInNode(parentNode: Node, btnName: string): Button | null {
        const btnNode = parentNode.getChildByName(btnName);
        if (!btnNode) {
            console.warn(`[菜单系统] 未找到${btnName}按钮，节点路径：${parentNode.name}/${btnName}`);
            return null;
        }
        return btnNode.getComponent(Button) || btnNode.addComponent(Button);
    }

    /** 绑定按钮点击事件（带缩放动画反馈） */
    private bindButtonEvent(button: Button, callback: () => void) {
        // 先解绑防止重复绑定
        button.node.off(Button.EventType.CLICK, callback, this);
        // 绑定点击事件，带缩放动画
        button.node.on(Button.EventType.CLICK, () => {
            this.playButtonClickAni(button.node);
            callback();
        }, this);
    }

    /** 更新存档位显示（显示存档时间和场景） */
    private updateSaveSlotDisplay(index: number) {
        const slotNode = this.saveSlots[index];
        if (!slotNode) return;
        const slotLabel = slotNode.getComponentInChildren(Label);
        if (!slotLabel) return;

        // 有存档数据则显示存档信息，无存档则显示"空存档位"
        if (this.saveData[index]) {
            slotLabel.string = `存档位${index + 1}\n${this.saveData[index].time}\n场景：${this.saveData[index].scene}`;
        } else {
            slotLabel.string = `存档位${index + 1}\n空存档位`;
        }
    }

    /** 初始化存档数据（模拟读取本地存档） */
    private initSaveData() {
        // 实际开发中可替换为：
        // const savedData = cc.sys.localStorage.getItem("avg_save_data");
        // this.saveData = savedData ? JSON.parse(savedData) : {};
        this.saveData = {}; // 初始为空存档
    }

    /** 初始化设置面板（读取默认设置） */
    private initSettingPanel() {
        // 实际开发中可从本地存储读取保存的设置，这里用默认值
        if (this.bgmSlider) this.bgmSlider.progress = 0.7;
        if (this.soundSlider) this.soundSlider.progress = 0.7;
        if (this.fullscreenToggle) {
            // 修正：用game.canvas判断全屏状态，替代director.window
            this.fullscreenToggle.isChecked = game.canvas.ownerDocument.fullscreenElement !== null;
        }
    }

    // ==================== 交互反馈（动画/音效） ====================
    /** 按钮点击缩放动画 */
    private playButtonClickAni(btnNode: Node) {
        tween(btnNode)
            .to(0.1, { scale: new Vec3(0.95, 0.95, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    /** 菜单切换动画（淡入，可选） */
    private playMenuSwitchEffect(menuNode: Node) {
        // 可扩展：添加淡入淡出、位移等动画
        menuNode.scale = new Vec3(0.9, 0.9, 1);
        tween(menuNode)
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    /** 存档成功反馈（可选） */
    private playSaveEffect(slotNode: Node) {
        // 可扩展：播放存档音效、显示"存档成功"提示
        tween(slotNode)
            .to(0.1, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    // ==================== 设置功能细节 ====================
    /** 背景音乐音量变化 */
    private onBgmVolumeChange(slider: Slider) {
        const volume = slider.progress;
        this.updateVolumeLabel(volume);
        // 实际开发中：控制背景音乐音量（需绑定音频组件）
        // const bgmAudio = this.node.getComponentInChildren(AudioSource);
        // if (bgmAudio) bgmAudio.volume = volume;
    }

    /** 音效音量变化 */
    private onSoundVolumeChange(slider: Slider) {
        const volume = slider.progress;
        // 实际开发中：控制音效音量
    }

    /** 全屏切换（修正：用game.canvas控制全屏，替代director.window） */
    private onFullscreenToggle(toggle: Toggle) {
        const doc = game.canvas.ownerDocument;
        if (toggle.isChecked) {
            doc.documentElement.requestFullscreen().catch(err => {
                console.warn("[菜单系统] 全屏切换失败：", err);
            });
        } else {
            doc.exitFullscreen().catch(err => {
                console.warn("[菜单系统] 退出全屏失败：", err);
            });
        }
        console.log(`[菜单系统] 全屏状态：${toggle.isChecked}`);
    }

    /** 更新音量显示标签 */
    private updateVolumeLabel(volume: number) {
        if (this.volumeLabel) {
            this.volumeLabel.string = `音量：${Math.round(volume * 100)}%`;
        }
    }
}