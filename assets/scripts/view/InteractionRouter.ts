
import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

type TriggerConfig = {
    ui?: string;
    toast?: string;
    emitEvent?: string;
};

type ItemTipConfig = {
    title: string;
    content: string;
    okText?: string;
    cancelText?: string;
};

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    ITEM_SELECTED: "ITEM_SELECTED",
    ITEM_DESELECTED: "ITEM_DESELECTED",

    UI_OPENED: "UI_OPENED",
    UI_TOAST: "UI_TOAST",
    UI_MODAL: "UI_MODAL",
    SCENE_VISUAL: "SCENE_VISUAL",
} as const;

@ccclass("InteractionRouter")
export class InteractionRouter extends Component {
    // 无前置条件，点击即触发
    private triggerById: Record<string, TriggerConfig> = {
        point_pillow: {
            ui: "pillowOpenBg",
        },
        point_codeYuanLi: {
            ui: "codeYuanLiContentBg",
        },
        point_bed: {
            emitEvent: "ENTER_BED",
        },
        point_desk: {
            emitEvent: "ENTER_DESK",
        },
        point_calendar: {
            ui: "calendarCloseBg",
        },
        point_bookcase: {
            ui: "twoBooksCloseBg",
        },
        point_sink: {
            ui: "sinkCloseBg",
        },
    };

    // 物品选中提示
    private itemTips: Record<string, ItemTipConfig> = {
        item_key: {
            title: "钥匙",
            content: "这个钥匙好像可以打开什么...",
            okText: "好的",
        },
        item_phone: {
            title: "手机",
            content: "手机还没解锁，暂时无法使用",
            okText: "关闭",
        },
        item_xuanZhi: {
            title: "宣纸",
            content: "宣纸上好像有什么痕迹...",
            okText: "好的",
        },
        item_pencil: {
            title: "铅笔",
            content: "铅笔可以用来...",
            okText: "好的",
        },
    };

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        // director.on(event.ITEM_SELECTED, this.onSelected, this);
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
        // director.off(event.ITEM_SELECTED, this.onSelected, this);
    }

    private onTriggered(result: any) {
        const code = result?.code ?? "";
        const interactableId = result?.interactableId ?? "";

        switch (code) {
            case "SUCCESS":
                this.handleSuccess(interactableId, result);
                return;

            case "NO_ITEM":
            case "NO_FLAG":
                this.handleBlocked(interactableId, result);
                return;

            case "ENTER_DESK":
                director.emit(event.SCENE_VISUAL, "deskCloseBg");
                return;

            case "ENTER_BED":
                director.emit(event.SCENE_VISUAL, "bedCloseBg");
                return;

            case "ENTER_BOOKCASE":
                director.emit(event.SCENE_VISUAL, "bookcaseCloseBg");
                return;
        }

        // 没有特殊 code，走默认点击逻辑
        const config = this.triggerById[interactableId];
        if (!config) return;

        if (config.toast) {
            this.toast(config.toast);
        }

        if (config.ui) {
            this.openUI(config.ui);
        }

        if (config.emitEvent) {
            this.handleEmitEvent(config.emitEvent);
        }
    }

    // 成功类结果
    private handleSuccess(interactableId: string, result: any) {
        switch (interactableId) {
            case "point_frame":
                this.openUI("frameCloseBg");
                return;

            case "point_rightDrawer":
                director.emit(event.SCENE_VISUAL, "rightDrawerCloseBg");
                return;

            case "point_diary":
                this.openUI("diaryCloseBg");
                return;

            case "point_leftDrawer":
                director.emit(event.SCENE_VISUAL, "leftDrawerCloseBg");
                return;

            case "point_xuanZhi":
                this.openUI("xuanzhiCloseBg");
                return;

            default:
                return;
        }
    }

    // 条件不满足类结果
    private handleBlocked(interactableId: string, result: any) {
        switch (interactableId) {
            case "point_frame":
                this.toast("请先解锁手机");
                return;

            case "point_rightDrawer":
                this.toast("请先找到钥匙");
                return;

            case "point_diary":
                this.toast("请先解锁密码");
                return;

            case "point_xuanZhi":
                this.toast("请先使宣纸上色");
                return;

            default:
                return;
        }
    }

    private openUI(uiName: string) {
        director.emit(event.UI_OPENED, uiName);
    }

    private toast(msg: string) {
        director.emit(event.UI_TOAST, msg);
    }

    private handleEmitEvent(eventName: string) {
        switch (eventName) {
            case "ENTER_DESK":
                director.emit(event.SCENE_VISUAL, "deskCloseBg");
                return;

            case "ENTER_BED":
                director.emit(event.SCENE_VISUAL, "bedCloseBg");
                return;

            case "ENTER_BOOKCASE":
                director.emit(event.SCENE_VISUAL, "bookcaseCloseBg");
                return;

            default:
                director.emit(eventName);
                return;
        }
    }

    private onSelected(itemId: string) {
        const tip = this.itemTips[itemId];
        if (!tip) {
            console.log("不是标记的物品");
            return;
        }

        director.emit(event.UI_MODAL, {
            title: tip.title,
            content: tip.content,
            okText: tip.okText ?? "确定",
            cancelText: tip.cancelText,
        });
    }
}

