import { _decorator, Component, Node, Slider, game, AudioSource, director } from 'cc'
const { ccclass, property } = _decorator

//全局总音量
export let masterVolume: number = 1.0

@ccclass('TotalVolumeControl_Slider')
export class TotalVolumeControl_Slider extends Component {
    @property({ type: Slider, displayName: "总音量滑动条" })
    public volumeSlider: Slider = null

    @property({ displayName: "默认总音量" })
    public defaultVolume: number = 1.0

    onLoad() {
        this.initMasterConfig()
        this.volumeSlider.node.on('slide', this.onSlide, this)
        director.on("SET_VOLUME_ZERO", this.setVolumeZero, this)
        director.on("RESTORE_VOLUME", this.initMasterConfig, this)
    }

    initMasterConfig() {
        //初始化总音量
        masterVolume = Math.max(0, Math.min(1, this.defaultVolume))
        this.volumeSlider.progress = masterVolume

        const volumePercent = Math.round(masterVolume * 100)
        console.log(`初始总音量: ${volumePercent}%`)
    }

    onSlide(slider: Slider) {
        //更新全局总音量
        masterVolume = Math.max(0, Math.min(1, slider.progress))
        const volumePercent = Math.round(masterVolume * 100)
        console.log(`当前总音量: ${volumePercent}%`)
    }

    setVolumeZero() {
        masterVolume = 0
        this.volumeSlider.progress = 0
        this.onSlide(this.volumeSlider) //触发音量更新逻辑
        const volumePercent = Math.round(masterVolume * 100)
        console.log(`总音量已设置为: ${volumePercent}%`)
    }

    onDestroy() {
        this.volumeSlider.node.off('slide', this.onSlide, this)
        director.off("SET_VOLUME_ZERO", this.setVolumeZero, this)
        director.off("RESTORE_VOLUME", this.initMasterConfig, this)
    }
}


