import { _decorator, Component, Node, tween, UIOpacity, director } from "cc";
import { DataManager } from "../core/DataManager";
const { ccclass, property } = _decorator;

const FLAG = {
    XUANZHI_WET: 'XUANZHI_WET',
    WET_XUANZHI_PICKED: 'WET_XUANZHI_PICKED',
} as const;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
} as const;

@ccclass('WaterInteractable')
export class WaterInteractable extends Component {
    @property({ tooltip: '干宣纸节点' })
    public paperDry: Node | null = null;

    @property({ tooltip: '湿宣纸节点' })
    public paperWet: Node | null = null;

    @property({ tooltip: '宣纸内容特写节点' })
    public xuanZhiContent: Node | null = null;

    private readonly interactableId = "point_water";

    onLoad() {
        console.log('[WaterInteractable] onLoad');
        this._initWetPaperVisibility();
    }

    onEnable() {
        console.log('[WaterInteractable] onEnable - 注册监听');
        director.on(event.INTERACTABLE_TRIGGERED, this._onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this._onClick, this);
    }

    onDisable() {
        console.log('[WaterInteractable] onDisable - 注销监听');
        director.off(event.INTERACTABLE_TRIGGERED, this._onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this._onClick, this);
    }

    /**
     * 初始化湿宣纸可见性（根据存档状态）
     */
    private _initWetPaperVisibility(): void {
        console.log('[WaterInteractable] 初始化湿宣纸可见性');
        const isWet = DataManager.instance.getBool(FLAG.XUANZHI_WET);
        const isPicked = DataManager.instance.getBool(FLAG.WET_XUANZHI_PICKED);
        console.log(`[WaterInteractable] XUANZHI_WET: ${isWet}, WET_XUANZHI_PICKED: ${isPicked}`);

        // 湿宣纸可见条件：已沾湿 且 未拾取
        if (isWet && !isPicked) {
            console.log('[WaterInteractable] 显示湿宣纸');
            if (this.paperWet) {
                this.paperWet.active = true;
            }
        } else {
            // 其他情况都隐藏
            if (this.paperDry) {
                this.paperDry.active = false;
            }
            if (this.paperWet) {
                this.paperWet.active = false;
            }
        }
    }

    private _onClick() {
        console.log('[WaterInteractable] _onClick - 点击事件');
    }

    private _onTriggered(result: any) {
        console.log('[WaterInteractable] _onTriggered - 收到交互事件:', result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[WaterInteractable] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "PICK_WET_XUANZHI":
                console.log('[WaterInteractable] 触发 PICK_WET_XUANZHI -> 打开湿宣纸特写');
                this._showWetPaperContent();
                return;
            case "XUANZHI_WET":
                console.log('[WaterInteractable] 触发 XUANZHI_WET -> 播放动画');
                this._playWetAnimation();
                return;
            case "NORMAL_HINT":
                console.log('[WaterInteractable] 触发 NORMAL_HINT -> 播放提示');
                return;
        }
    }

    /**
     * 显示湿宣纸内容特写
     */
    private _showWetPaperContent(): void {
        if (this.paperWet) {
            this.paperWet.active = false;
        }
        if (this.xuanZhiContent) {
            this.xuanZhiContent.active = true;
            console.log('[WaterInteractable] 湿宣纸特写已显示');
        }
    }

    /**
     * 播放湿宣纸动画
     */
    private _playWetAnimation(): void {
        if (!this.paperDry || !this.paperWet) {
            console.warn('[WaterInteractable] paperDry 或 paperWet 未绑定');
            return;
        }

        let dryOpacity = this.paperDry.getComponent(UIOpacity);
        if (!dryOpacity) {
            dryOpacity = this.paperDry.addComponent(UIOpacity);
        }
        dryOpacity.opacity = 0;
        this.paperDry.active = true;

        let wetOpacity = this.paperWet.getComponent(UIOpacity);
        if (!wetOpacity) {
            wetOpacity = this.paperWet.addComponent(UIOpacity);
        }
        wetOpacity.opacity = 0;
        this.paperWet.active = true;

        tween(dryOpacity)
            .to(0.5, { opacity: 255 })
            .call(() => {
                tween(dryOpacity)
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        this.paperDry!.active = false;
                        console.log('[WaterInteractable] 宣纸已打湿');
                    })
                    .start();

                tween(wetOpacity)
                    .to(0.5, { opacity: 255 })
                    .start();
            })
            .start();
    }
}