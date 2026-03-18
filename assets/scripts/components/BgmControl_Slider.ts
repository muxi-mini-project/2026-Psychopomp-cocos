import { _decorator, AudioSource, Component, director, Slider } from 'cc';
import { masterVolume } from './TotalVolumeContol_Slider';
const { ccclass, property } = _decorator;

@ccclass('BgmControl_Slider')
export class BgmControl_Slider extends Component {
    @property({
        type: AudioSource,
        displayName: "背景音乐音源组件"
    })
    public bgmAudioSource: AudioSource = null

    @property({ type: Slider, displayName: "音量控制滑动组件" })
    public volumeSlider: Slider = null

    @property({ displayName: "背景音乐音量" })
    public bgmVolume: number = 0.5

    onLoad() {
        this.initBgmConfig()
        this.volumeSlider.node.on('slide', this.onSlide, this)
        director.on("BGM_VOLUME_ZERO", this.setBgmVolumeZero, this)
        director.on("BGM_RESTORE", this.initBgmConfig, this)
    }

    initBgmConfig() {
        //Todo:添加从本地存储加载音量设置的逻辑
        const clampedVolume = Math.max(0, Math.min(1, this.bgmVolume))
        this.volumeSlider.progress = clampedVolume
        const volumePercent = Math.round(clampedVolume * 100);
        console.log(`初始背景音乐音量: ${volumePercent}%`);
    }

    setBgmVolumeZero() {
        this.volumeSlider.progress = 0;
        this.onSlide(this.volumeSlider) //触发音量更新逻辑
    }

    onSlide(slider: Slider) {
        const newVolume = Math.max(0, Math.min(1, slider.progress))
        if (this.bgmAudioSource) {
            this.bgmAudioSource.volume = newVolume * masterVolume
        }
        console.log("背景音乐音量已更新为:", newVolume * masterVolume);
        const volumePercent = Math.round(newVolume * masterVolume * 100);
        console.log(`当前背景音乐音量: ${volumePercent}%`);

    }

    onDestroy() {
        this.volumeSlider.node.off('slide', this.onSlide, this)
        director.off("BGM_VOLUME_ZERO", this.setBgmVolumeZero, this)
        director.off("BGM_RESTORE", this.initBgmConfig, this)
    }
}


