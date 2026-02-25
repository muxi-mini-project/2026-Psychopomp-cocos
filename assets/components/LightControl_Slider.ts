import { _decorator, Component, Node, Slider, Camera } from 'cc';
const { ccclass, property } = _decorator;

export let globalBrightness: number = 1.0;

@ccclass('LightControl_Slider')
export class LightControl_Slider extends Component {
    @property({ type: Slider, displayName: "亮度滑块" })
    public LightControl_Slider: Slider = null;

    @property({ type: Camera, displayName: "主摄像机" })
    public mainCamera: Camera = null;

    onLoad() {
        if (!this.mainCamera || !this.LightControl_Slider) {
            console.error("请绑定摄像机/滑块！");
            return;
        }

        //Todo:实现画面的亮度变化
        const cameraAny = this.mainCamera as any;
        // 初始化曝光值（亮度）
        cameraAny.exposure = globalBrightness;
        this.LightControl_Slider.progress = globalBrightness;

        // 绑定滑块事件
        this.LightControl_Slider.node.off('slide', this.onBrightnessSlide, this);
        this.LightControl_Slider.node.on('slide', this.onBrightnessSlide, this);
    }

    private onBrightnessSlide(slider: Slider) {
        globalBrightness = Math.max(0, Math.min(2, slider.progress * 2));
        const cameraAny = this.mainCamera as any;
        cameraAny.exposure = globalBrightness;

        console.log(`当前亮度（曝光值）：${globalBrightness.toFixed(2)}`);
    }

    onDestroy() {
        if (this.LightControl_Slider) {
            this.LightControl_Slider.node.off('slide', this.onBrightnessSlide, this);
        }
    }
}