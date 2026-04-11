import { _decorator, Component, Sprite, Color, tween, director, Node } from 'cc'
import { DataManager } from '../core/DataManager'
const { ccclass, property } = _decorator

const FLAG = {
    SKETCH_MOVED_1: 'SKETCH_MOVED_1',
    SKETCH_MOVED_2: 'SKETCH_MOVED_2',
} as const

@ccclass('Sketch')
export class Sketch extends Component {

    @property({ tooltip: '速写纸节点1' })
    sketchNode1: Node = null

    @property({ tooltip: '速写纸节点2' })
    sketchNode2: Node = null

    @property({ tooltip: '遗书特写节点' })
    writing: Node = null

    onLoad() {
        console.log('[Sketch] onLoad')
        this._initSketchVisibility()
        this._registerEvents()
    }

    /**
     * 初始化速写纸可见性（根据存档状态）
     */
    private _initSketchVisibility(): void {
        console.log('[Sketch] 初始化速写纸可见性')

        const sketch1Moved = DataManager.instance.getBool(FLAG.SKETCH_MOVED_1)
        const sketch2Moved = DataManager.instance.getBool(FLAG.SKETCH_MOVED_2)

        console.log(`[Sketch] SKETCH_MOVED_1: ${sketch1Moved}, SKETCH_MOVED_2: ${sketch2Moved}`)

        // 根据 flag 设置速写纸可见性
        this.sketchNode1.active = !sketch1Moved
        this.sketchNode2.active = !sketch2Moved

        console.log(`[Sketch] sketchNode1.visible: ${!sketch1Moved}, sketchNode2.visible: ${!sketch2Moved}`)

        // 如果两个都隐藏了，激活遗书节点
        this._updateWritingState()
    }

    /**
     * 注册点击事件
     */
    private _registerEvents(): void {
        console.log('[Sketch] 注册速写纸点击事件')
        this.sketchNode1.on('click', this._onClick1, this)
        this.sketchNode2.on('click', this._onClick2, this)
    }

    /**
     * 速写纸1点击处理
     */
    private _onClick1(): void {
        console.log('[Sketch] 点击速写纸1')

        // 检查是否已经移开
        if (DataManager.instance.getBool(FLAG.SKETCH_MOVED_1)) {
            console.log('[Sketch] 速写纸1已移开，忽略')
            return
        }

        this._hideSketch(this.sketchNode1, FLAG.SKETCH_MOVED_1)
    }

    /**
     * 速写纸2点击处理
     */
    private _onClick2(): void {
        console.log('[Sketch] 点击速写纸2')

        // 检查是否已经移开
        if (DataManager.instance.getBool(FLAG.SKETCH_MOVED_2)) {
            console.log('[Sketch] 速写纸2已移开，忽略')
            return
        }

        this._hideSketch(this.sketchNode2, FLAG.SKETCH_MOVED_2)
    }

    /**
     * 隐藏速写纸（播放动画后隐藏，并记录flag）
     */
    private _hideSketch(sketchNode: Node, flagName: string): void {
        console.log(`[Sketch] 隐藏速写纸: ${flagName}`)

        const sprite = sketchNode.getComponent(Sprite)
        if (!sprite) {
            console.warn(`[Sketch] 速写纸节点缺少 Sprite 组件`)
            return
        }

        // 淡出动画
        tween(sprite)
            .to(0.5, { color: new Color(255, 255, 255, 0) })
            .call(() => {
                sketchNode.active = false
                console.log(`[Sketch] 速写纸已隐藏: ${flagName}`)

                // 记录 flag
                DataManager.instance.setFlag(flagName, true)
                console.log(`[Sketch] 设置 Flag: ${flagName} = true`)

                // 检查是否需要激活遗书
                this._updateWritingState()
            })
            .start()
    }

    /**
     * 更新遗书节点状态
     */
    private _updateWritingState(): void {
        const sketch1Hidden = DataManager.instance.getBool(FLAG.SKETCH_MOVED_1)
        const sketch2Hidden = DataManager.instance.getBool(FLAG.SKETCH_MOVED_2)

        console.log(`[Sketch] 检查遗书状态: sketch1Hidden=${sketch1Hidden}, sketch2Hidden=${sketch2Hidden}`)

        // 当两个速写纸都隐藏时，激活遗书节点
        if (sketch1Hidden && sketch2Hidden) {
            console.log('[Sketch] 两个速写纸都已移开，激活遗书节点')
            this.writing.active = true
            this.writing.on('click', this._onClickWriting, this)
        } else {
            console.log('[Sketch] 速写纸未全部移开，遗书节点保持隐藏')
            this.writing.active = false
        }
    }

    /**
     * 遗书节点点击处理
     */
    private _onClickWriting(): void {
        console.log('[Sketch] 点击遗书节点')
        director.emit('INTERACTABLE_CLICK', 'writing')
    }

    onDestroy() {
        console.log('[Sketch] onDestroy')
        this.sketchNode1?.off('click', this._onClick1, this)
        this.sketchNode2?.off('click', this._onClick2, this)
        this.writing?.off('click', this._onClickWriting, this)
    }
}