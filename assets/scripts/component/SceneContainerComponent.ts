import { _decorator, Node, Component, log, } from "cc";
const { ccclass, property } = _decorator
import { CommonEnum } from "../common/CommonEnum";
import { BlackFadeComponent } from "./BlackFadeComponent";
import { InteractiveItemComponent } from "./InteractiveItemComponent";
import { PhoneInteract } from "./PhoneInteract"
@ccclass('SceneContaainerComponent')
export class SceneContainerComponent extends Component {
    @property({ type: Node, tooltip: '卧室全景节点' })
    public bedroomAll: Node = null

    @property({ type: Node, tooltip: '床近景节点' })
    public bedClose: Node = null

    @property({ type: Node, tooltip: '书桌近景节点' })
    public deskClose: Node = null

    @property({ type: Node, tooltip: '画框近景节点' })
    public frameClose: Node = null

    @property({ type: Node, tooltip: '左抽屉近景节点' })
    public leftDrawerClose: Node = null

    @property({ type: Node, tooltip: '右抽屉近景节点' })
    public rightDrawerClose: Node = null

    @property({ type: Node, tooltip: '书架近景节点' })
    public bookcaseClose: Node = null

    @property({ type: Node, tooltip: '日历近景节点' })
    public calendarClose: Node = null

    @property({ type: Node, tooltip: '浴室全景节点' })
    public bathroom: Node = null

    @property({ type: Node, tooltip: '浴室近景节点' })
    public bathroomClose: Node = null

    @property({ type: Node, tooltip: '密码学原理内容节点' })
    public codeYuanLiContent: Node = null

    @property({ type: Node, tooltip: '手机近景节点' })
    public phoneClose: Node = null

    @property({ type: Node, tooltip: '密码学原理出现节点' })
    public codeYuanLiArise: Node = null

    @property({ type: Node, tooltip: '右抽屉打开节点' })
    public rightDrawerCloseUp: Node = null

    @property({ type: Node, tooltip: '宣纸近景节点' })
    public xuanZhiClose: Node = null

    @property({ type: Node, tooltip: '日记详细内容节点' })
    public diaryDetail: Node = null

    @property({ type: BlackFadeComponent })
    public blackFade: BlackFadeComponent = null

    private hasKey: boolean = false
    private hasClickedXuanZhi: boolean = false
    // private xuanZhiClose:Node = null
    private isPhoneUnlocked: boolean = false;
    private isDiaryUnlocked: boolean = false;
    private currentScene: number = CommonEnum.sceneType.bedroomAll
    onLoad() {
        this.hideAllScenes()
        this.bedroomAll.active = true
        this.listenToAllInteractiveItems()
    }

    private listenToAllInteractiveItems() {
        const allInteractiveNodes: Node[] = []
        this.bedroomAll.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.bedClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.deskClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.frameClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.leftDrawerClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.rightDrawerClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.bookcaseClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.bathroom.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.bathroomClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.calendarClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.codeYuanLiContent.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.phoneClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.codeYuanLiArise.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.rightDrawerCloseUp.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.xuanZhiClose.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        this.diaryDetail.getComponentsInChildren(InteractiveItemComponent).forEach(comp => {
            allInteractiveNodes.push(comp.node)
        })
        allInteractiveNodes.forEach(node => {
            node.on('itemClick', this.onInteractiveItemClick, this)
        })
    }

    private hideAllScenes() {
        this.bedClose.active = false
        this.deskClose.active = false
        this.frameClose.active = false
        this.leftDrawerClose.active = false
        this.rightDrawerClose.active = false
        this.bookcaseClose.active = false
        this.calendarClose.active = false
        this.bathroom.active = false
        this.bathroomClose.active = false
        this.codeYuanLiContent.active = false
        this.phoneClose.active = false
        this.codeYuanLiArise.active = false
        this.rightDrawerCloseUp.active = false
        this.xuanZhiClose.active = false
        this.diaryDetail.active = false
    }

    private onInteractiveItemClick(eventData: { itemType: number; node: null }) {
        if (!eventData || !eventData.node) {
            console.warn("无效的点击事件数据，跳过处理");
            return;
        }
        const { itemType } = eventData
        switch (itemType) {
            case CommonEnum.InteractiveItemType.desk:
                this.switchScene(CommonEnum.sceneType.deskClose)
                break;

            // case CommonEnum.InteractiveItemType.phone:
            //     console.log('点击手机，显示密码锁');
            // this.switchScene(CommonEnum.sceneType.phoneClose)
            // break;
            case CommonEnum.InteractiveItemType.phone:
                console.log('点击手机，显示密码锁')
                const phoneInteracts = this.deskClose.getComponentsInChildren(PhoneInteract);
                const phoneInteract = phoneInteracts.find(comp => {
                    const itemComp = comp.node.getComponent(InteractiveItemComponent);
                    return itemComp?.itemType === CommonEnum.InteractiveItemType.phone;
                })
                if (phoneInteract) {
                    phoneInteract.showPhoneLock(); // 显示密码锁
                    phoneInteract.node.off('unlocked', this.onPhoneUnlocked, this); // 防止重复绑定
                    phoneInteract.node.on('unlocked', this.onPhoneUnlocked, this);
                } else {
                    this.switchScene(CommonEnum.sceneType.phoneClose);
                }
                break;

            // case CommonEnum.InteractiveItemType.frame:
            //     this.switchScene(CommonEnum.sceneType.frameClose)
            //     break;

            case CommonEnum.InteractiveItemType.frame:
                if (this.isPhoneUnlocked) {
                    this.switchScene(CommonEnum.sceneType.frameClose);
                } else {
                    console.log('先解锁手机，才能查看相框');
                }
                break

            case CommonEnum.InteractiveItemType.pillow:
                this.switchScene(CommonEnum.sceneType.codeYuanLiArise)
                break;

            case CommonEnum.InteractiveItemType.lockedDrawer:
                if (this.hasKey) {
                    console.log('拥有钥匙，打开抽屉');
                    this.switchScene(CommonEnum.sceneType.rightDrawerCloseUp)
                    // const diaryNode = this.rightDrawerCloseUp.getComponentInChildren(InteractiveItemComponent,n=>{
                    //     return n.getComponent(InteractiveItemComponent)?.itemType === CommonEnum.InteractiveItemType.passwordDiary
                    // })?.node
                    const diaryNode = this.rightDrawerCloseUp.getComponentsInChildren(InteractiveItemComponent)
                        .find(comp => comp.itemType === CommonEnum.InteractiveItemType.passwordDiary)?.node;
                    diaryNode && (diaryNode.active = false)

                }
                else {
                    console.log('抽屉上锁无法打开');
                }
                break;

            case CommonEnum.InteractiveItemType.key:
                console.log('获得钥匙，收入物品栏');
                (eventData.node as Node).active = false
                this.hasKey = true
                break;

            case CommonEnum.InteractiveItemType.xuanZhi:
                if (this.hasClickedXuanZhi) {
                    console.log('宣纸已经点击');
                    this.hasClickedXuanZhi = true
                }
                break;

            case CommonEnum.InteractiveItemType.handwashingSink:
                if (this.hasClickedXuanZhi) {
                    console.log('显示宣纸近景');
                    this.switchScene(CommonEnum.sceneType.xuanZhiClose)
                    this.hasClickedXuanZhi = false
                    //重置宣纸状态

                }
                break;


            case CommonEnum.InteractiveItemType.passwordDiary:
                if (!this.isDiaryUnlocked) {
                    console.log("显示日记详情");
                    this.isDiaryUnlocked = true
                    this.switchScene(CommonEnum.sceneType.diaryDetail)

                }
                break

            default:
                console.warn("未知的可交互物品类型：", itemType)
                break;
        }
    }


    /**
     * @param targetScene
     */
    public switchScene(targetScene: number) {
        if (targetScene === this.currentScene) return;
        this.blackFade.fadeIn(0.2, () => {
            this.hideAllScenes()
            this.showTargetScene(targetScene)
            this.currentScene = targetScene
            this.blackFade.fadeOut(0.2)
        })
    }
    private showTargetScene(targetScene: number) {
        switch (targetScene) {
            case CommonEnum.sceneType.bedroomAll:
                this.bedroomAll.active = true
                break;

            case CommonEnum.sceneType.bedClose:
                this.bedClose.active = true
                break;

            case CommonEnum.sceneType.deskClose:
                this.deskClose.active = true
                break;

            case CommonEnum.sceneType.frameClose:
                this.frameClose.active = true
                break;

            case CommonEnum.sceneType.leftDrawerClose:
                this.leftDrawerClose.active = true
                break;

            case CommonEnum.sceneType.rightDrawerClose:
                this.rightDrawerClose.active = true
                break;

            case CommonEnum.sceneType.bookcaseClose:
                this.bookcaseClose.active = true
                break;

            case CommonEnum.sceneType.bathroom:
                this.bathroom.active = true
                break;

            case CommonEnum.sceneType.bathroomClose:
                this.bathroomClose.active = true
                break;

            case CommonEnum.sceneType.calendarClose:
                this.calendarClose.active = true
                break;

            case CommonEnum.sceneType.codeYuanLiContent:
                this.codeYuanLiContent.active = true
                break;

            case CommonEnum.sceneType.phoneClose:
                this.phoneClose.active = true
                break;

            case CommonEnum.sceneType.codeYuanLiArise:
                this.codeYuanLiArise.active = true
                break;

            case CommonEnum.sceneType.rightDrawerCloseUp:
                this.rightDrawerCloseUp.active = true
                break;

            case CommonEnum.sceneType.xuanZhiClose:
                this.xuanZhiClose.active = true
                break;


            case CommonEnum.sceneType.diaryDetail:
                this.diaryDetail.active = true

            default: console.warn('未知类型场景', targetScene);

                break;
        }
    }

    //返回
    public backToPreScene() {
        let preScene: number = this.currentScene
        switch (this.currentScene) {
            case CommonEnum.sceneType.bathroom:
                preScene = CommonEnum.sceneType.bedroomAll
                break;

            case CommonEnum.sceneType.bathroomClose:
                preScene = CommonEnum.sceneType.bathroom
                break

            case CommonEnum.sceneType.bedClose:
                preScene = CommonEnum.sceneType.bedroomAll
                break

            case CommonEnum.sceneType.bookcaseClose:
                preScene = CommonEnum.sceneType.bedroomAll
                break

            case CommonEnum.sceneType.calendarClose:
                preScene = CommonEnum.sceneType.deskClose
                break

            case CommonEnum.sceneType.deskClose:
                preScene = CommonEnum.sceneType.bedroomAll
                break

            case CommonEnum.sceneType.frameClose:
                preScene = CommonEnum.sceneType.deskClose
                break

            case CommonEnum.sceneType.leftDrawerClose:
                preScene = CommonEnum.sceneType.deskClose
                break

            case CommonEnum.sceneType.rightDrawerClose:
                preScene = CommonEnum.sceneType.deskClose
                break

            case CommonEnum.sceneType.codeYuanLiContent:
                preScene = CommonEnum.sceneType.bedClose
                break

            case CommonEnum.sceneType.phoneClose:
                preScene = CommonEnum.sceneType.deskClose
                break

            case CommonEnum.sceneType.rightDrawerCloseUp:
                preScene = CommonEnum.sceneType.deskClose
                break

            case CommonEnum.sceneType.diaryDetail:
                preScene = CommonEnum.sceneType.rightDrawerCloseUp

            default:
                return

        }
        this.switchScene(preScene)
    }
    private onPhoneUnlocked() {
        console.log('手机解锁成功！相框现在可以交互');
        this.isPhoneUnlocked = true;
        // const allComp = this.deskClose.getComponentInChildren(InteractiveItemComponent)
        // const frameComp = allComp.find()
        const frameComp = this.deskClose.getComponentsInChildren(InteractiveItemComponent)
            .find(comp => comp.itemType === CommonEnum.InteractiveItemType.frame);
        if (frameComp) {
            frameComp.setInteractiveState(true);
            console.log('相框已激活');
        }
    }
}