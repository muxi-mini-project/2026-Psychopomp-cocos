import { _decorator, Component, Node, ScrollView } from "cc";
import { DataManager } from "../core/DataManager";
const { ccclass, property } = _decorator;

const FLAG = {
    SKETCH_MOVED_1: 'SKETCH_MOVED_1',
    SKETCH_MOVED_2: 'SKETCH_MOVED_2',
} as const;

@ccclass('WritingAppear')
export class WritingAppear extends Component {
    @property({ type: Node, tooltip: "遗书内容节点" })
    public writingContent: Node | null = null;

    @property({ type: ScrollView, tooltip: "遗书滚动" })
    public writingScroll: ScrollView | null = null;

    onEnable() {
        console.log('[WritingAppear] onEnable - 注册点击监听');
        this.node.on(Node.EventType.TOUCH_END, this._onWritingAppear, this);
    }

    onDisable() {
        console.log('[WritingAppear] onDisable - 注销点击监听');
        this.node.off(Node.EventType.TOUCH_END, this._onWritingAppear, this);
    }

    /**
     * 检查速写纸是否都已移开
     */
    private _checkSketchFlags(): boolean {
        const sketch1Moved = DataManager.instance.getBool(FLAG.SKETCH_MOVED_1);
        const sketch2Moved = DataManager.instance.getBool(FLAG.SKETCH_MOVED_2);
        console.log(`[WritingAppear] 检查速写纸标志 - SKETCH_MOVED_1: ${sketch1Moved}, SKETCH_MOVED_2: ${sketch2Moved}`);
        return sketch1Moved && sketch2Moved;
    }

    private _onWritingAppear(): void {
        console.log('[WritingAppear] 点击遗书节点');

        // 检查两个速写纸是否都已移开
        if (!this._checkSketchFlags()) {
            console.log('[WritingAppear] 速写纸未全部移开，遗书内容不可见');
            return;
        }

        if (this.writingContent) {
            this.writingContent.active = true;
            console.log('[WritingAppear] 遗书内容已显示');
        }

        if (this.writingScroll) {
            // 停止自动滚动
            this.writingScroll.stopAutoScroll();
            // 滚动到顶部
            this.writingScroll.scrollToTop(200);
            console.log('[WritingAppear] 遗书滚动重置到顶部');
        }
    }
}