import { _decorator, Component, Node, UIOpacity, Vec3, Vec2, tween, director, } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PhoneSceneController')
export class PhoneSceneController extends Component {
    @property(Node)
    public phnoeRoot: Node | null = null;

    @property(Node)
    public homeRoot: Node | null = null;

    @property(Node)
    public touchLayer: Node | null = null;

    @property(Node)
    public bgClear: Node | null = null;

    @property(Node)
    public bgBlur: Node | null = null;

    @property(Node)
    public timeNode: Node | null = null;

    @property(Node)
    public labelPanel: Node | null = null;

    @property(Node)
    public keyboardRoot: Node | null = null;

    @property(Node)
    public globalErrorNode: Node | null = null;

    private startTouchPos: Vec2 = new Vec2();
    private hasOpenedInput = false;
    private isAnimating = false;

    private timeOriginPos: Vec3 = new Vec3();
    private bgClearOriginPos: Vec3 = new Vec3();
    private bgBlurOriginPos: Vec3 = new Vec3();
    private labelOriginPos: Vec3 = new Vec3();
    private keyboardOriginPos: Vec3 = new Vec3();
    private homeOriginScale: Vec3 = new Vec3(1, 1, 1);
    private bgClearOriginScale: Vec3 = new Vec3(1, 1, 1);
    private bgBlurOriginScale: Vec3 = new Vec3(1, 1, 1);

    protected onLoad(): void {
        console.log('[PhoneSceneController] onLoad');

        this.cacheOriginState();
        this.ensureOpacityComponents();
        this.initViewState();
    }

    protected onEnable(): void {
        console.log('[PhoneSceneController] onEnable');

        if (this.touchLayer) {
            this.touchLayer.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.touchLayer.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.touchLayer.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);
            console.log('[PhoneSceneController] touchLayer bound:', this.touchLayer.name);
        } else {
            console.warn('[PhoneSceneController] touchLayer is null');
        }

        director.on('PHONE_PWD_SUCCESS', this.onPwdSuccess, this);
        director.on('PHONE_PWD_FAIL', this.onPwdFail, this);
        director.on('BACK', this.onBack, this);
    }

    protected onDisable(): void {
        if (this.touchLayer) {
            this.touchLayer.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.touchLayer.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.touchLayer.off(Node.EventType.MOUSE_UP, this.onMouseUp, this);
        }

        director.off('PHONE_PWD_SUCCESS', this.onPwdSuccess, this);
        director.off('PHONE_PWD_FAIL', this.onPwdFail, this);
        director.off('BACK', this.onBack, this);
    }

    private cacheOriginState(): void {
        if (this.timeNode) this.timeOriginPos = this.timeNode.position.clone();

        if (this.bgClear) {
            this.bgClearOriginPos = this.bgClear.position.clone();
            this.bgClearOriginScale = this.bgClear.scale.clone();
        }

        if (this.bgBlur) {
            this.bgBlurOriginPos = this.bgBlur.position.clone();
            this.bgBlurOriginScale = this.bgBlur.scale.clone();
        }

        if (this.labelPanel) this.labelOriginPos = this.labelPanel.position.clone();
        if (this.keyboardRoot) this.keyboardOriginPos = this.keyboardRoot.position.clone();
        if (this.homeRoot) this.homeOriginScale = this.homeRoot.scale.clone();
    }

    private ensureOpacityComponents(): void {
        this.getOrAddOpacity(this.bgBlur);
        this.getOrAddOpacity(this.timeNode);
        this.getOrAddOpacity(this.labelPanel);
        this.getOrAddOpacity(this.keyboardRoot);
        this.getOrAddOpacity(this.homeRoot);
        this.getOrAddOpacity(this.globalErrorNode);
    }

    private initViewState(): void {
        console.log('[PhoneSceneController] initViewState');

        if (this.phnoeRoot) {
            this.phnoeRoot.active = true;
        }

        if (this.homeRoot) {
            this.homeRoot.active = false;
            this.homeRoot.setScale(new Vec3(
                this.homeOriginScale.x * 1.03,
                this.homeOriginScale.y * 1.03,
                this.homeOriginScale.z
            ));
            this.setOpacity(this.homeRoot, 0);
        }

        if (this.bgClear) {
            this.bgClear.setPosition(this.bgClearOriginPos);
            this.bgClear.setScale(this.bgClearOriginScale);
        }

        if (this.bgBlur) {
            this.bgBlur.setPosition(this.bgBlurOriginPos);
            this.bgBlur.setScale(this.bgBlurOriginScale);
            this.setOpacity(this.bgBlur, 0);
        }

        if (this.timeNode) {
            this.timeNode.setPosition(this.timeOriginPos);
            this.setOpacity(this.timeNode, 255);
        }

        if (this.labelPanel) {
            this.labelPanel.setPosition(
                this.labelOriginPos.x,
                this.labelOriginPos.y - 80,
                this.labelOriginPos.z
            );
            this.labelPanel.setScale(new Vec3(0.96, 0.96, 1));
            this.setOpacity(this.labelPanel, 0);
        }

        if (this.keyboardRoot) {
            this.keyboardRoot.setPosition(
                this.keyboardOriginPos.x,
                this.keyboardOriginPos.y - 250,
                this.keyboardOriginPos.z
            );
            this.keyboardRoot.setScale(new Vec3(0.98, 0.98, 1));
            this.setOpacity(this.keyboardRoot, 0);
        }

        if (this.globalErrorNode) {
            this.globalErrorNode.active = false;
            this.setOpacity(this.globalErrorNode, 0);
        }

        this.hasOpenedInput = false;
        this.isAnimating = false;
    }

    private onTouchStart(event: any): void {
        const p = event.getUILocation();
        this.startTouchPos.set(p.x, p.y);
        console.log('[PhoneSceneController] TOUCH_START', p.x, p.y);
    }

    private onTouchEnd(event: any): void {
        console.log('[PhoneSceneController] TOUCH_END');

        if (this.hasOpenedInput || this.isAnimating) return;

        const p = event.getUILocation();
        const deltaY = p.y - this.startTouchPos.y;

        console.log('[PhoneSceneController] deltaY =', deltaY);

        // 上滑触发
        if (deltaY > 80) {
            this.openInputState();
            return;
        }

        // 允许点击也触发，方便你先测
        this.openInputState();
    }

    private onMouseUp(): void {
        console.log('[PhoneSceneController] MOUSE_UP');

        if (this.hasOpenedInput || this.isAnimating) return;
        this.openInputState();
    }

    private openInputState(): void {
        console.log('[PhoneSceneController] openInputState');

        if (this.isAnimating) return;
        this.isAnimating = true;
        this.hasOpenedInput = true;

        if (this.timeNode) {
            tween(this.timeNode)
                .to(0.35, {
                    position: new Vec3(
                        this.timeOriginPos.x,
                        this.timeOriginPos.y + 80,
                        this.timeOriginPos.z
                    )
                })
                .start();

            tween(this.getOrAddOpacity(this.timeNode))
                .to(0.35, { opacity: 0 })
                .start();
        }

        if (this.bgClear) {
            tween(this.bgClear)
                .to(0.35, {
                    position: new Vec3(
                        this.bgClearOriginPos.x,
                        this.bgClearOriginPos.y + 20,
                        this.bgClearOriginPos.z
                    ),
                    scale: new Vec3(
                        this.bgClearOriginScale.x * 1.03,
                        this.bgClearOriginScale.y * 1.03,
                        this.bgClearOriginScale.z
                    ),
                })
                .start();
        }

        if (this.bgBlur) {
            tween(this.bgBlur)
                .to(0.30, {
                    position: new Vec3(
                        this.bgBlurOriginPos.x,
                        this.bgBlurOriginPos.y + 20,
                        this.bgBlurOriginPos.z
                    ),
                    scale: new Vec3(
                        this.bgBlurOriginScale.x * 1.03,
                        this.bgBlurOriginScale.y * 1.03,
                        this.bgBlurOriginScale.z
                    ),
                })
                .start();

            tween(this.getOrAddOpacity(this.bgBlur))
                .to(0.30, { opacity: 255 })
                .start();
        }

        if (this.labelPanel) {
            tween(this.labelPanel)
                .delay(0.08)
                .to(0.22, {
                    position: this.labelOriginPos.clone(),
                    scale: new Vec3(1, 1, 1),
                }, { easing: 'quartOut' })
                .call(() => {
                    console.log('[PhoneSceneController] labelPanel final pos =', this.labelPanel?.position);
                })
                .start();

            tween(this.getOrAddOpacity(this.labelPanel))
                .delay(0.08)
                .to(0.22, { opacity: 255 })
                .start();
        }

        if (this.keyboardRoot) {
            tween(this.keyboardRoot)
                .delay(0.12)
                .to(0.28, {
                    position: this.keyboardOriginPos.clone(),
                    scale: new Vec3(1, 1, 1),
                }, { easing: 'backOut' })
                .call(() => {
                    this.isAnimating = false;
                    console.log('[PhoneLockTransition] keyboardRoot final pos = ', this.keyboardRoot?.position)
                })
                .start();

            tween(this.getOrAddOpacity(this.keyboardRoot))
                .delay(0.12)
                .to(0.28, { opacity: 255 })
                .start();
        } else {
            this.isAnimating = false;
        }
    }

    private onPwdSuccess(): void {
        console.log('[PhoneSceneController] PHONE_PWD_SUCCESS');

        if (this.isAnimating) return;
        this.playUnlockSuccess();
    }

    private onPwdFail(): void {
        console.log('[PhoneSceneController] PHONE_PWD_FAIL');

        if (!this.globalErrorNode) return;

        this.globalErrorNode.active = true;
        this.setOpacity(this.globalErrorNode, 0);

        tween(this.getOrAddOpacity(this.globalErrorNode))
            .to(0.12, { opacity: 255 })
            .delay(0.5)
            .to(0.15, { opacity: 0 })
            .call(() => {
                if (this.globalErrorNode) {
                    this.globalErrorNode.active = false;
                }
            })
            .start();
    }

    private onBack(): void {
        console.log('[PhoneSceneController] BACK');

        if (this.isAnimating) return;
        if (!this.hasOpenedInput) return;

        this.backToLockState();
    }

    private playUnlockSuccess(): void {
        console.log('[PhoneSceneController] playUnlockSuccess');
        this.isAnimating = true;

        if (this.labelPanel) {
            tween(this.labelPanel)
                .to(0.18, {
                    position: new Vec3(
                        this.labelOriginPos.x,
                        this.labelOriginPos.y - 20,
                        this.labelOriginPos.z
                    ),
                })
                .start();

            tween(this.getOrAddOpacity(this.labelPanel))
                .to(0.18, { opacity: 0 })
                .start();
        }

        if (this.keyboardRoot) {
            tween(this.keyboardRoot)
                .to(0.20, {
                    position: new Vec3(
                        this.keyboardOriginPos.x,
                        this.keyboardOriginPos.y - 40,
                        this.keyboardOriginPos.z
                    ),
                })
                .start();

            tween(this.getOrAddOpacity(this.keyboardRoot))
                .to(0.20, { opacity: 0 })
                .start();
        }

        if (this.bgBlur) {
            tween(this.getOrAddOpacity(this.bgBlur))
                .delay(0.05)
                .to(0.25, { opacity: 0 })
                .start();
        }

        if (this.bgClear) {
            tween(this.bgClear)
                .to(0.35, {
                    scale: new Vec3(
                        this.bgClearOriginScale.x * 1.08,
                        this.bgClearOriginScale.y * 1.08,
                        this.bgClearOriginScale.z
                    ),
                }, { easing: 'quadOut' })
                .call(() => {
                    this.showHomeRoot();
                })
                .start();
        } else {
            this.showHomeRoot();
        }
    }

    private showHomeRoot(): void {
        console.log('[PhoneSceneController] showHomeRoot');

        if (this.phnoeRoot) {
            this.phnoeRoot.active = false;
        }

        if (this.homeRoot) {
            this.homeRoot.active = true;
            this.setOpacity(this.homeRoot, 0);
            this.homeRoot.setScale(new Vec3(
                this.homeOriginScale.x * 1.03,
                this.homeOriginScale.y * 1.03,
                this.homeOriginScale.z
            ));

            tween(this.homeRoot)
                .to(0.25, { scale: this.homeOriginScale.clone() }, { easing: 'quartOut' })
                .start();

            tween(this.getOrAddOpacity(this.homeRoot))
                .to(0.25, { opacity: 255 })
                .call(() => {
                    this.isAnimating = false;
                })
                .start();
        } else {
            this.isAnimating = false;
        }
    }

    private backToLockState(): void {
        console.log('[PhoneSceneController] backToLockState');
        this.isAnimating = true;

        if (this.labelPanel) {
            tween(this.labelPanel)
                .to(0.18, {
                    position: new Vec3(
                        this.labelOriginPos.x,
                        this.labelOriginPos.y - 80,
                        this.labelOriginPos.z
                    ),
                    scale: new Vec3(0.96, 0.96, 1),
                }, { easing: 'quadIn' })
                .start();

            tween(this.getOrAddOpacity(this.labelPanel))
                .to(0.18, { opacity: 0 })
                .start();
        }

        if (this.keyboardRoot) {
            tween(this.keyboardRoot)
                .to(0.22, {
                    position: new Vec3(
                        this.keyboardOriginPos.x,
                        this.keyboardOriginPos.y - 250,
                        this.keyboardOriginPos.z
                    ),
                    scale: new Vec3(0.98, 0.98, 1),
                }, { easing: 'quadIn' })
                .start();

            tween(this.getOrAddOpacity(this.keyboardRoot))
                .to(0.22, { opacity: 0 })
                .start();
        }

        if (this.timeNode) {
            tween(this.timeNode)
                .delay(0.05)
                .to(0.22, { position: this.timeOriginPos.clone() }, { easing: 'quartOut' })
                .start();

            tween(this.getOrAddOpacity(this.timeNode))
                .delay(0.05)
                .to(0.22, { opacity: 255 })
                .start();
        }

        if (this.bgClear) {
            tween(this.bgClear)
                .delay(0.03)
                .to(0.25, {
                    position: this.bgClearOriginPos.clone(),
                    scale: this.bgClearOriginScale.clone(),
                })
                .start();
        }

        if (this.bgBlur) {
            tween(this.bgBlur)
                .delay(0.03)
                .to(0.25, {
                    position: this.bgBlurOriginPos.clone(),
                    scale: this.bgBlurOriginScale.clone(),
                })
                .start();

            tween(this.getOrAddOpacity(this.bgBlur))
                .to(0.20, { opacity: 0 })
                .call(() => {
                    this.hasOpenedInput = false;
                    this.isAnimating = false;
                })
                .start();
        } else {
            this.hasOpenedInput = false;
            this.isAnimating = false;
        }
    }

    private getOrAddOpacity(node: Node | null): UIOpacity {
        if (!node) {
            throw new Error('Node is null when requesting UIOpacity.');
        }

        let opacity = node.getComponent(UIOpacity);
        if (!opacity) {
            opacity = node.addComponent(UIOpacity);
        }
        return opacity;
    }

    private setOpacity(node: Node | null, value: number): void {
        if (!node) return;
        this.getOrAddOpacity(node).opacity = value;
    }
}
