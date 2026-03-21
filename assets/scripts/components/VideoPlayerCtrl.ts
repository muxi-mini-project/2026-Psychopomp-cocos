import { _decorator, Component, director, VideoPlayer, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('VideoPlayerCtrl')
export class VideoPlayerCtrl extends Component {
    @property({ type: Node, displayName: "VideoPlayer节点" })
    public videoPlayerNode: Node = null;

    private _videoPlayer: VideoPlayer | null = null;

    onLoad() {
        if (this.videoPlayerNode) {
            this._videoPlayer = this.videoPlayerNode.getComponent(VideoPlayer);
        }

        // 监听视频播放事件
        director.on("VIDEO_PLAY", this._onVideoPlay, this);
    }

    /**
     * 播放视频
     * @param videoId 视频资源ID（暂时使用传入的视频节点）
     */
    private _onVideoPlay(videoId: string): void {
        if (!this._videoPlayer) {
            console.warn("[VideoPlayerCtrl] VideoPlayer组件未找到");
            return;
        }

        console.log(`[VideoPlayerCtrl] 开始播放视频: ${videoId}`);

        // 显示视频层
        this.videoPlayerNode.active = true;

        // 监听视频完成事件
        this._videoPlayer.node.on('finished', this._onVideoFinished, this);

        // 开始播放（具体视频资源由编辑器绑定）
        this._videoPlayer.play();
    }

    /**
     * 视频播放完毕回调
     */
    private _onVideoFinished(): void {
        console.log("[VideoPlayerCtrl] 视频播放完毕");

        // 取消监听
        this._videoPlayer?.node.off('finished', this._onVideoFinished, this);

        // 隐藏视频层
        this.videoPlayerNode.active = false;

        // 通知 GameManager 视频播放完毕，开始下一阶段
        director.emit("INTRO_CUTSCENE_COMPLETE");
    }

    /**
     * 外部停止视频（供紧急跳过使用）
     */
    public stopVideo(): void {
        if (this._videoPlayer && this._videoPlayer.isPlaying) {
            this._videoPlayer.stop();
            this._videoPlayer.node.off('finished', this._onVideoFinished, this);
            this.videoPlayerNode.active = false;
            director.emit("INTRO_CUTSCENE_COMPLETE");
        }
    }

    onDestroy() {
        director.off("VIDEO_PLAY", this._onVideoPlay, this);
        this._videoPlayer = null;
    }
}
