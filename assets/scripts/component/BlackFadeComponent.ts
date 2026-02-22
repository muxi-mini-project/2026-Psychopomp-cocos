import { _decorator, Color, Component, log, Sprite, Node, tween } from "cc";
const { ccclass, property } = _decorator;
import { CommonEnum } from "../../../../NewProject_1/assets/scripts/common/CommonEnum";

@ccclass('BlackFadeComponent')
export class BlackFadeComponent extends Component {
    @property({ type: Node, tooltip: '进入黑屏节点' })
    public blackScreenNode: Node = null
    private blackScreenOpacitySpirite: Sprite | null = null
    //控制黑屏节点的sprite
    onLoad() {
        this.blackScreenOpacitySpirite = this.blackScreenNode.getComponent(Sprite)
        if (!this.blackScreenOpacitySpirite) {
            console.warn('黑屏节点未挂载')
            return
        }
        this.blackScreenNode.active = false
        this.blackScreenOpacitySpirite.color = new Color(0, 0, 0, 0)
    }
    /**
     * @param duration
     * @param callback
     */
    public fadeIn(duration: number = 0.5, callback?: Function) {
        if (!this.blackScreenOpacitySpirite) {
            console.warn('黑屏 Sprite 组件未初始化，淡入失败')
            return
        }
        this.blackScreenNode.active = true
        tween(this.blackScreenOpacitySpirite.color)
            .to(duration, { a: 255 })
            .call(() => callback && callback())//此处等价于if (callback) {callback(); }  判断 callback 是否存在（是否传入了有效的函数）
            //    如果存在，就执行这个回调函数
            .start()
    }
    /**
       * @param duration
       * @param callback
       */
    public fadeOut(duration: number = 0.5, callback?: Function) {
        if (!this.blackScreenOpacitySpirite) {
            console.warn('黑屏 Sprite 组件未初始化，淡出失败');
            return
        }
        this.blackScreenNode.active = false
        tween(this.blackScreenOpacitySpirite.color)
            .to(duration, { a: 0 })
            // .call(() => callback && callback())
            .call(() => {
                this.blackScreenNode.active = false; // 动画完成后再隐藏节点
                callback && callback(); // 执行回调
            })
            .start()
    }
}