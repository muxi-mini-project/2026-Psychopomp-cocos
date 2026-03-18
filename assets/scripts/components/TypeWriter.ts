import { _decorator, Component, Node, Label, UITransform, warn, Vec2 } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Typewriter')
@requireComponent([Label, UITransform])
export class Typewriter extends Component {
    @property({ tooltip: "打字速度（字/秒），越大越快" })
    public charsPerSecond: number = 5; // 保持你设定的速度

    // 核心状态：标记当前段落是否完成（供TestText判断切换）
    public isCompleted: boolean = false;
    // 对外只读：是否正在打字
    public get isTyping() {
        return this._isTyping;
    }

    // 私有核心属性
    private _label: Label | null = null;
    private _fullText: string = "";
    private _currentIndex: number = 0;
    private _isTyping: boolean = false;
    private _timer: number = 0;

    onLoad() {
        // 初始化组件
        this._label = this.node.getComponent(Label);
        if (!this._label) {
            warn("[Typewriter] 缺少 Label 组件，打字机功能禁用");
            this.enabled = false; // 关闭组件，停止update
            return;
        }

        // 初始化状态
        this._timer = 0;
        this._isTyping = false;
        this.isCompleted = false;
    }

    // 每帧执行：逐字打字核心逻辑
    update(deltaTime: number) {
        // 防护：未打字/无Label/已打完，直接返回
        if (!this._isTyping || !this._label || this._currentIndex >= this._fullText.length) {
            return;
        }

        // 计算每个字的间隔时间
        const interval = 1 / this.charsPerSecond;
        this._timer += deltaTime;

        // 累计时间达标，显示下一个字
        if (this._timer >= interval) {
            this._currentIndex++;
            this._label.string = this._fullText.substring(0, this._currentIndex);
            this._timer -= interval; // 重置计时器，保留剩余时间

            // 打字完成：更新状态
            if (this._currentIndex >= this._fullText.length) {
                this._isTyping = false;
                this.isCompleted = true; // 标记为可切换状态
            }
        }
    }

    // 外部调用：开始打字（重置所有状态）
    public startTypewriter(text: string) {
        if (!this._label) return;

        // 重置所有状态，避免残留
        this._fullText = text || "";
        this._currentIndex = 0;
        this._timer = 0;
        this._label.string = ""; // 清空原有文字
        this._isTyping = true;
        this.isCompleted = false; // 新段落标记为未完成
    }

    // 外部调用：强制跳过打字（供TestText的点击逻辑调用）
    public skipTyping() {
        if (!this._label || !this._isTyping) return;

        // 直接显示完整文本
        this._label.string = this._fullText;
        this._currentIndex = this._fullText.length;
        this._isTyping = false;
        this.isCompleted = true; // 跳过即标记为完成
    }

    // 组件销毁：清理资源
    onDestroy() {
        this._label = null;
        this._fullText = "";
    }

    // 对外暴露：获取当前完整文本（可选）
    public get fullText() {
        return this._fullText;
    }
}