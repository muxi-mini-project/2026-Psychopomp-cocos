import { _decorator, Component, director, Node, tween, Sprite, Color } from "cc";
import { DataManager } from "../core/DataManager";
const { ccclass, property } = _decorator;

const FLAG = {
    CONTENT_REVEALED: 'CONTENT_REVEALED',
} as const;

const event = {
    INTERACTABLE_CLICK: "INTERACTABLE_CLICK",
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
} as const;

@ccclass('DiaryHiddenContentInteract')
export class DiaryHiddenContentInteract extends Component {
    private readonly interactableId = "point_diary_hidden_content";

    @property({ type: Node, tooltip: '隐藏内容节点（执行动画的目标）' })
    targetNode: Node | null = null;

    private sprite: Sprite | null = null;

    onLoad() {
        console.log('[DiaryHiddenContentInteract] onLoad');
        this._initTargetNode();
    }

    /**
     * 初始化目标节点的可见性（根据存档状态）
     */
    private _initTargetNode(): void {
        const isRevealed = DataManager.instance.getBool(FLAG.CONTENT_REVEALED);
        console.log(`[DiaryHiddenContentInteract] CONTENT_REVEALED: ${isRevealed}`);

        if (isRevealed) {
            if (this.targetNode) {
                this.targetNode.active = true;
                const sprite = this.targetNode.getComponent(Sprite);
                if (sprite) {
                    sprite.color = new Color(255, 255, 255, 255);
                }
            }
        } else {
            if (this.targetNode) {
                this.targetNode.active = true;  // 保持 active 但透明度为 0
                const sprite = this.targetNode.getComponent(Sprite);
                if (sprite) {
                    sprite.color = new Color(255, 255, 255, 0);
                }
            }
        }
    }

    onEnable() {
        console.log('[DiaryHiddenContentInteract] onEnable - 注册监听');
        director.on(event.INTERACTABLE_TRIGGERED, this._onTriggered, this);
        this.node.on(Node.EventType.TOUCH_END, this._onClick, this);
    }

    onDisable() {
        console.log('[DiaryHiddenContentInteract] onDisable - 注销监听');
        director.off(event.INTERACTABLE_TRIGGERED, this._onTriggered, this);
        this.node.off(Node.EventType.TOUCH_END, this._onClick, this);
    }

    private _onClick() {
        console.log(`[DiaryHiddenContentInteract] _onClick - 点击节点`);
        director.emit(event.INTERACTABLE_CLICK, this.interactableId);
    }

    private _onTriggered(result: any) {
        console.log('[DiaryHiddenContentInteract] _onTriggered - 收到交互事件:', result);

        if (result?.interactableId !== this.interactableId) {
            console.log(`[DiaryHiddenContentInteract] 交互点不匹配: current=${result?.interactableId}, target=${this.interactableId}`);
            return;
        }

        switch (result?.code) {
            case "DIARY_HIDDEN_CONTENT_REVEALED":
                console.log('[DiaryHiddenContentInteract] 触发 DIARY_HIDDEN_CONTENT_REVEALED -> 触发动画');
                this._playRevealAnimation();
                return;
            case "NORMAL_HINT":
                console.log('[DiaryHiddenContentInteract] 触发 NORMAL_HINT -> 触发文字提示');
                return;
        }
    }

    /**
     * 播放揭示动画（淡入）
     */
    private _playRevealAnimation(): void {
        if (!this.targetNode) {
            console.warn('[DiaryHiddenContentInteract] targetNode 未设置');
            return;
        }

        this.sprite = this.targetNode.getComponent(Sprite);
        if (!this.sprite) {
            console.warn('[DiaryHiddenContentInteract] targetNode 上无 Sprite 组件');
            return;
        }

        // 初始透明度为 0
        this.sprite.color = new Color(255, 255, 255, 0);

        tween(this.sprite)
            .to(0.5, { color: new Color(255, 255, 255, 255) })
            .call(() => {
                console.log('[DiaryHiddenContentInteract] 揭示动画完成');
            })
            .start();
    }
}