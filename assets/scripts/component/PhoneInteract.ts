// PhoneInteract.ts
import { _decorator, Component, Node, log } from 'cc';
// import{EventEmitter} from 'event'
const { ccclass, property } = _decorator;
import { PhoneLock } from '../ui/PhoneLock';

@ccclass('PhoneInteract')
export class PhoneInteract extends Component {
    @property({ type: PhoneLock, tooltip: '手机密码ui' })
    public phoneLock: PhoneLock = null!;

    // @property({ type: EventEmitter, tooltip: '手机解锁成功的回调事件' })
    // public onUnlocked: EventEmitter = new EventEmitter();


    onLoad() {
        // 初始化时监听密码锁的解锁成功事件（关键对接）
        if (this.phoneLock) {
            // 绑定密码锁的解锁成功回调到当前组件
            this.phoneLock.onUnlockSuccess = this.handleUnlockSuccess.bind(this);
        }
    }

    onDestroy() {
        if (this.phoneLock) {
            this.phoneLock.onUnlockSuccess = null;
        }
    }
    public showPhoneLock() {
        if (!this.phoneLock) {
            log('手机密码锁组件未绑定');
            return;
        }
        this.phoneLock.showLock();
    }
    public hidePhoneLock() {
        this.phoneLock && this.phoneLock.hideLock();
    }
    private handleUnlockSuccess() {
        console.log('手机密码解锁成功');
        this.node.emit('phone-unlocked')
        this.hidePhoneLock()
    }
}
