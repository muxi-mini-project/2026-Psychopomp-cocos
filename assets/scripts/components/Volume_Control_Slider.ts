import { _decorator, Component, Slider, Sprite, Enum } from 'cc';
const { ccclass, property } = _decorator;

enum VolumeType {
    MASTER,
    MUSIC,
    SFX,
    VOICE
}

Enum(VolumeType);

@ccclass('VolumeSlider')
export class VolumeSlider extends Component {
    @property({ type: VolumeType })
    public type: VolumeType = VolumeType.MASTER; // 在编辑器里选这是哪种条

    @property(Slider)
    public slider: Slider = null;

    @property(Sprite)
    public barSprite: Sprite = null;

    onLoad() {
        const initVol = this.getVolumeByType();
        this.updateVisual(initVol);
        
        this.slider.node.on('slide', this.onValueChange, this);
    }

    private onValueChange() {
        const val = this.slider.progress;
        this.updateVisual(val);
        this.setVolumeByType(val);
    }

    private updateVisual(val: number) {
        this.slider.progress = val;
        if (this.barSprite) this.barSprite.fillRange = val;
    }

    private getVolumeByType(): number {
        //TODO: 实际上这里应该对接 AudioManager
        // return AudioManager.instance.getVolume(this.type);
        return 0.8; 
    }

    private setVolumeByType(val: number) {
        console.log(`正在修改 ${VolumeType[this.type]} 音量为: ${val}`);
        // AudioManager.instance.setVolume(this.type, val);
    }
}



