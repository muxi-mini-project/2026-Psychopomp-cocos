import { _decorator, Component, Label, Button, tween, Vec3, director, Node, input, repeat } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Pencil')
export class Pencil extends Component {

    private penciltween: any = null

    protected onLoad(): void {
        //监听铅笔处于使用状态的事件
        director.on("PENCIL_USED", this.onPencilUsed, this)//事件名待定
    }

    private onPencilUsed() {
        this.penciltween = tween(this.node)
            .repeatForever(
                tween()
                    .by(0.15, { position: new Vec3(25, 0, 0) })
                    .by(0.15, { position: new Vec3(-25, 0, 0) })
            )
        //位置待定

        this.penciltween.start()

        tween(this.node)
            .delay(3)
            .call(() => {
                if (this.penciltween) {
                    this.penciltween.stop()
                    this.penciltween = null
                }
            })
            .start()
        director.emit("PENCIL_STOP")//通知铅笔动画已完成
    }

}