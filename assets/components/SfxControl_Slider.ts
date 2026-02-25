import { _decorator, AudioSource, Component, Node, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SfxControl_Slider')
export class SfxControl_Slider extends Component {

    @property({
        type: AudioSource,
        displayName: "音效音源组件"
    })
    public sfxAudioSource: AudioSource = null

    @property({ type: Slider, displayName: "音量控制滑动组件" })
    public volumeSlider: Slider = null

    public realTimeVolume: number = 0.8


    onLoad() {
        this.initSfxConfig()
        this.volumeSlider.node.on('slide', this.onSlide, this)
    }

    initSfxConfig() {
        //Todo:添加从本地存储加载音量设置的逻辑
        const initVolume = Math.max(0, Math.min(1, this.realTimeVolume))
        // 全局音量初始值
        this.realTimeVolume = initVolume
        this.volumeSlider.progress = initVolume
        //Todo:音源同步
        const volumePercent = Math.round(this.realTimeVolume * 100);
        console.log(`初始音效音量: ${volumePercent}%`);
    }
    onSlide(slider: Slider) {
        const realTimeVolume = Math.max(0, Math.min(1, slider.progress))
        if (this.sfxAudioSource) {
            this.sfxAudioSource.volume = realTimeVolume
        }
        console.log("音效音量已更新为:", realTimeVolume)
        const volumePercent = Math.round(realTimeVolume * 100);
        console.log(`当前音效音量: ${volumePercent}%`);

    }

    onDestroy() {
        this.volumeSlider.node.off('slide', this.onSlide, this)
    }
}





