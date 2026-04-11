import { _decorator, Component, director, Node ,ScrollView} from "cc";
const { ccclass, property } = _decorator;

@ccclass('WritingAppear')
export class WritingAppear extends Component {
    @property({ type: Node, tooltip: "遗书内容节点" })
    public writingContent: Node | null = null;

    @property({ type: ScrollView, tooltip: "遗书滚动" })
    public writingScroll: ScrollView | null = null;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onWritingAppear, this)
        console.log("遗书内容节点开启监听")
        //director.on("writting_appear",this.onWritingAppear,this)
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onWritingAppear, this)
        console.log("遗书内容节点关闭监听")
        //director.off("writting_appear",this.onWritingAppear,this)
    }

    private onWritingAppear() {
        if (this.writingContent) {
            this.writingContent.active = true
            console.log("打开遗书");
        }
        if(this.writingScroll){
            //停止自动滚动
            this.writingScroll.stopAutoScroll()
            //滚动到顶部
            this.writingScroll.scrollToTop(200);
        }
    }


}