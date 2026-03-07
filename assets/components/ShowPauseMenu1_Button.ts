import { _decorator, Component, Node, AudioSource, Vec3, tween, director } from 'cc';
import { SfxControl_Slider } from './SfxControl_Slider';
const { ccclass, property } = _decorator;

@ccclass('ShowPauseMenu1_Button')
export class ShowPauseMenu1_Button extends Component {
    @property({ displayName: "主菜单节点" })
    public mainMenuNode: Node | null = null

    @property({ displayName: "开始游戏节点" })
    public startNewGameNode: Node | null = null

    @property({ displayName: "继续游戏节点" })
    public continueGameNode: Node | null = null

    @property({ type: SfxControl_Slider, displayName: "音效滑块组件" })
    public sfxSliderComp: SfxControl_Slider = null
    @property({
        type: AudioSource['clip'],
        tooltip: "按钮点击音效组件"
    })
    clickAudio: AudioSource['clip'] = null

    @property({ type: AudioSource, displayName: "音效音源组件" })
    sfxAudioSource: AudioSource = null

    //动画配置
    @property({ tooltip: "点击缩放比例" })
    clickScale: number = 0.9

    @property({ tooltip: "动画时长（秒）" })
    animDuration: number = 0.15

    onLoad() {
        this.node.on('mouse-move', this.onMouseMove, this)
        this.node.on('mouse-leave', this.onMouseLeave, this)
        this.node.on('click', this.onButtonClick, this)
    }

    onButtonClick() {
        this.playClickSound()
        this.playClickAnimation(() => {
            director.emit("SHOW_PAUSE_MENU")//触发显示暂停菜单事件(待定具体事件名称)
            if (this.mainMenuNode && this.mainMenuNode.active === true) {
                if (this.startNewGameNode) this.startNewGameNode.active = false
                if (this.continueGameNode) this.continueGameNode.active = false
            }
            console.log('已点击ShowPauseMenu1_Button')
        })
    }
    private playClickSound() {
        const currentVol = Math.max(0, Math.min(1, this.sfxSliderComp.volumeSlider.progress))
        console.log("按钮绑定的滑块组件：", this.sfxSliderComp)
        console.log("滑块组件的实时音量：", currentVol)
        //Todo:添加从本地存储加载音量设置的逻辑
    }

    //鼠标移入播放缩放动画
    private onMouseMove() {
        tween(this.node)
            .to(0.2, { scale: new Vec3(1.05, 1.05, 1.05) })
            .start()
    }

    //鼠标移出恢复原大小
    private onMouseLeave() {
        tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start()
    }

    //播放缩放动画
    private playClickAnimation(callback?: Function) {
        //原始值
        const originalScale = this.node.scale.clone()
        //点击缩小
        const targetScale = new Vec3(
            originalScale.x * this.clickScale,
            originalScale.y * this.clickScale,
            originalScale.z * this.clickScale
        )

        //组合动画：缩小 → 恢复原大小
        tween(this.node)
            //快速缩小
            .to(this.animDuration, { scale: targetScale })
            //快速恢复
            .to(this.animDuration, { scale: originalScale })
            //动画结束后执行回调
            .call(() => {
                if (callback) callback()
            })
            //启动动画
            .start()
    }
    onDestroy() {
        this.node.off('mouse-move', this.onMouseMove, this)
        this.node.off('mouse-leave', this.onMouseLeave, this)
        this.node.off('click', this.onButtonClick, this)
    }
}


