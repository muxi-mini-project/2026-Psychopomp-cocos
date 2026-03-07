import { _decorator, Component, Node } from 'cc';
import { SfxControl_Slider } from './SfxControl_Slider';
import { BgmControl_Slider } from './BgmControl_Slider';
import { AudioSource, director, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Reset_Button')
export class Reset_Button extends Component {
    @property({ type: SfxControl_Slider, displayName: "音效滑块组件" })
    public sfxSliderComp: SfxControl_Slider = null

    @property({ type: BgmControl_Slider, displayName: "背景音乐滑块组件" })
    public bgmSliderComp: BgmControl_Slider = null

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
        this.node.on('click', this.onResetClick, this)
    }

    onResetClick() {
        this.playClickSound()
        this.playClickAnimation(() => {
            this.resetVolumeToDefault()
            console.log('已点击Reset_Button')
        })
    }

    //重置音量到默认值
    private resetVolumeToDefault() {
        const defaultVolume = 0.5
        this.sfxSliderComp.volumeSlider.progress = defaultVolume
        this.sfxSliderComp.realTimeVolume = defaultVolume
        this.bgmSliderComp.volumeSlider.progress = defaultVolume
        this.bgmSliderComp.bgmVolume = defaultVolume
        console.log("已重置音量到默认值：", defaultVolume)
    }

    //播放点击音效
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
        this.node.off('click', this.onResetClick, this)
    }
}


