import { _decorator, Component, director, VideoPlayer, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('VideoPlayerCtrl')
export class VideoPlayerCtrl extends Component {
    @property({ type: Node, displayName: "VideoPlayer节点" })
    public videoPlayerNode: Node = null;

    private _videoPlayer: VideoPlayer | null = null;
    private _wasPlaying: boolean = false;

    onLoad() {
        if (this.videoPlayerNode) {
            this._videoPlayer = this.videoPlayerNode.getComponent(VideoPlayer);
        }
        director.on("VIDEO_PLAY", this._onVideoPlay, this);
    }

    update(_dt: number): void {
        if (!this._videoPlayer) return;
        const isPlaying = this._videoPlayer.isPlaying;
        if (this._wasPlaying && !isPlaying) {
            console.log("[VideoPlayerCtrl] video stopped detected via update");
            this._onVideoFinished();
        }
        this._wasPlaying = isPlaying;
    }

    private _onVideoPlay(_videoId: string): void {
        if (!this._videoPlayer) {
            console.warn("[VideoPlayerCtrl] VideoPlayer组件未找到");
            return;
        }

        this.videoPlayerNode.active = true;
        this._wasPlaying = false;
        this._videoPlayer.node.on('COMPLETED', this._onVideoFinished, this);
        this._videoPlayer.play();
        console.log("[VideoPlayerCtrl] video started, isPlaying:", this._videoPlayer.isPlaying);
    }

    private _onVideoFinished(): void {
        this._videoPlayer?.node.off('COMPLETED', this._onVideoFinished, this);
        this.videoPlayerNode.active = false;
        director.emit("INTRO_VIDEO_COMPLETE");
    }

    public stopVideo(): void {
        if (this._videoPlayer && this._videoPlayer.isPlaying) {
            this._videoPlayer.stop();
            this._videoPlayer.node.off('COMPLETED', this._onVideoFinished, this);
            this.videoPlayerNode.active = false;
            director.emit("INTRO_VIDEO_COMPLETE");
        }
    }

    onDestroy() {
        director.off("VIDEO_PLAY", this._onVideoPlay, this);
    }
}
