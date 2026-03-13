import { _decorator, Component, Slider, ProgressBar, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SliderSync')
export class SliderSync extends Component {
    @property(Slider)
    public slider: Slider = null;

    @property(ProgressBar)
    public progressBar: ProgressBar = null;
        
    @property(Sprite)
    public barSprite: Sprite = null; // 直接关联那个 Bar 节点的 Sprite 组件

    protected onLoad() {
        this.slider.node.on('slide', this.onSlide, this);
    }

onSlide(slider: Slider) {
    if (this.barSprite) {
        this.barSprite.fillRange = slider.progress; 
        console.log("手动修改 FillRange 为:", this.barSprite.fillRange);
    }
}
}