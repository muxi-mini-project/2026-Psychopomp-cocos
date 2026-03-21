import { _decorator, Component, Slider } from 'cc';
import { AudioSource, director, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Reset_Button')
export class Reset_Button extends Component {

    @property({
        type: AudioSource['clip'],
        tooltip: "按钮点击音效组件"
    })
    clickAudio: AudioSource['clip'] = null

    @property({ type: AudioSource, displayName: "音效音源组件" })
    sfxAudioSource: AudioSource = null

    @property({ type: Slider, displayName: "总音量滑动条" })
    totalVolumeSlider: Slider = null;

    @property({ type: Slider, displayName: "BGM音量滑动条" })
    bgmVolumeSlider: Slider = null;

    @property({ type: Slider, displayName: "SFX音量滑动条" })
    sfxVolumeSlider: Slider = null;

    @property({ type: Slider, displayName: "亮度滑动条" })
    brightnessSlider: Slider = null;

    // 进度条默认值
    @property({ displayName: "总音量默认值" })
    defaultTotalVolume: number = 0.5;

    @property({ displayName: "BGM音量默认值" })
    defaultBgmVolume: number = 0.5;

    @property({ displayName: "SFX音量默认值" })
    defaultSfxVolume: number = 0.5;

    @property({ displayName: "亮度默认值" })
    defaultBrightness: number = 0.5;

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
            this.resetAllToDefault()
            console.log('已点击Reset_Button')
        })
    }

    //重置所有进度条到默认值
    private resetAllToDefault() {
        if (this.totalVolumeSlider) {
            this.totalVolumeSlider.progress = this.defaultTotalVolume;
        }
        if (this.bgmVolumeSlider) {
            this.bgmVolumeSlider.progress = this.defaultBgmVolume;
        }
        if (this.sfxVolumeSlider) {
            this.sfxVolumeSlider.progress = this.defaultSfxVolume;
        }
        if (this.brightnessSlider) {
            this.brightnessSlider.progress = this.defaultBrightness;
        }
        console.log('设置已重置为默认值');
    }

    //播放点击音效
    private playClickSound() {

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


