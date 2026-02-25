import { _decorator, Component, Node, find, Prefab, instantiate, Canvas, Label, UITransform, Color, Vec2, Input, EventTouch, director } from 'cc'
import { Typewriter } from '../components/TypeWriter'
const { ccclass, property } = _decorator


@ccclass('TestText')
export class TestText extends Component {
    @property({ type: Prefab, tooltip: "对话面板预制体" })
    public panelPrefab: Prefab = null

    private typewriter: Typewriter | null = null
    private currentLineIndex: number = 0
    private totalLines: number = 0
    private canvas: Node | null = null
    private panelNode: Node | null = null

    onLoad() {
        this.canvas = find("Canvas");
        if (!this.canvas) {
            console.error("[TestText] 找不到Canvas节点，请检查场景是否有Canvas");
            return;
        }
        // 监听对话事件
        director.on("DIALOGUE_START", this._onDialogueStart, this)
        director.on("DIALOGUE_LINE", this._onDialogueLine, this)
        director.on("DIALOGUE_END", this._onDialogueEnd, this)
    }


    //Todo:人物立绘显示逻辑

    //初始化对话面板
    private initPanel() {
        if (this.panelNode) return; // 避免重复实例化

        // 实例化预制体
        this.panelNode = instantiate(this.panelPrefab);
        this.panelNode.parent = this.canvas;
        this.panelNode.active = false // 默认隐藏
        const labelNode = this.panelNode.getChildByName("Label");
        if (!labelNode) {
            console.error("[TestText] 预制体中找不到名为Label的子节点，请检查预制体结构");
            return;
        }
        this.typewriter = labelNode.getComponent(Typewriter) || labelNode.addComponent(Typewriter)
        this.panelNode.on(Input.EventType.TOUCH_START, this.onPanelClick, this)
    }

    //对话开始
    private _onDialogueStart(dialogueId: string) {
        console.log(`[TestText] 对话开始: ${dialogueId}`)
        this.initPanel() // 确保面板已初始化
        // 重置段落索引
        this.currentLineIndex = 0
        this.totalLines = 0
        this.panelNode.active = true
    }

    //接收对话每段文本数据
    private _onDialogueLine(data: {
        text: string
        speaker: string
        index: number
        total: number
    }) {
        //当前段落信息
        this.currentLineIndex = data.index
        this.totalLines = data.total
        //启动打字机播放
        this.typewriter.startTypewriter(data.text)
        console.log(`[TestText] 播放第${data.index + 1}段: ${data.text}`)
    }

    //对话结束
    private _onDialogueEnd() {
        //隐藏文本框节点
        if (this.panelNode) {
            this.panelNode.active = false
        }
        console.log("[TestText] 对话结束")
    }

    //点击文本框切换下一句
    private onPanelClick(event: EventTouch) {
        if (!this.typewriter) return
        event.preventSwallow = true
        //打字中跳过打字
        if (this.typewriter.isTyping) {
            this.typewriter.skipTyping()
            event.preventSwallow = true
            return
        }

        //打字完成通知管理器切下一段
        if (this.typewriter.isCompleted) {
            director.emit("DIALOG_NEXT")
            event.preventSwallow = true
            return
        }
    }

    onDestroy() {
        // 移除面板点击事件
        if (this.panelNode) {
            this.panelNode.off(Input.EventType.TOUCH_START, this.onPanelClick, this)
        }
        this.typewriter = null
        this.panelNode = null
    }

    onDisable() {
        if (this.panelNode) {
            this.panelNode.active = false;
        }
    }
}