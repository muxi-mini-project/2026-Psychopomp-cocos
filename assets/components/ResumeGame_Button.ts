import { _decorator, Component, Node, AudioSource, director, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { SfxControl_Slider } from './SfxControl_Slider';

@ccclass('ResumeGame_Button')
export class ResumeGame_Button extends Component {
    @property({ type: SfxControl_Slider, displayName: "音效滑块组件" })
    public sfxSliderComp: SfxControl_Slider = null

    @property({
        type: AudioSource,
        tooltip: "按钮点击音效组件"
    })
    clickAudio: AudioSource = null

    //动画配置
    @property({ tooltip: "点击缩放比例" })
    clickScale: number = 0.9

    @property({ tooltip: "动画时长（秒）" })
    animDuration: number = 0.15
    onLoad() {
        this.node.on('mouse-move', this.onMouseMove, this)
        this.node.on('mouse-leave', this.onMouseLeave, this)
        this.node.on('click', this.onResumeClick, this)
    }

    onResumeClick() {
        this.playClickSound()
        this.playClickAnimation(() => {
            director.emit("RESUME_GAME")
            console.log('已点击ResumeGame_Button')
        })
    }

    //播放点击音效
    private playClickSound() {
        const currentVol = Math.max(0, Math.min(1, this.sfxSliderComp.volumeSlider.progress))
        console.log("按钮绑定的滑块组件：", this.sfxSliderComp)
        console.log("滑块组件的实时音量：", currentVol)
        //Todo: 这里可以添加从本地存储加载音量设置的逻辑
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
        this.node.off('click', this.onResumeClick, this)
    }
}


