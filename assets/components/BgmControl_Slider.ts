import { _decorator, AudioSource, Component, Node, Slider } from 'cc';
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
    public bgmVolume: number = 0.8

    onLoad() {
        this.initBgmConfig()
        this.volumeSlider.node.on('slide', this.onSlide, this)
    }

    initBgmConfig() {
        //Todo:添加从本地存储加载音量设置的逻辑
        const clampedVolume = Math.max(0, Math.min(1, this.bgmVolume))
        this.volumeSlider.progress = clampedVolume
        const volumePercent = Math.round(clampedVolume * 100);
        console.log(`初始背景音乐音量: ${volumePercent}%`);
    }
    onSlide(slider: Slider) {
        const newVolume = Math.max(0, Math.min(1, slider.progress))
        if (this.bgmAudioSource) {
            this.bgmAudioSource.volume = newVolume
        }
        console.log("背景音乐音量已更新为:", newVolume);
        const volumePercent = Math.round(newVolume * 100);
        console.log(`当前背景音乐音量: ${volumePercent}%`);

    }

    onDestroy() {
        this.volumeSlider.node.off('slide', this.onSlide, this)
    }
}


