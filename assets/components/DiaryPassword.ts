import { _decorator, Component, Node, Label, Button, Vec3, tween, director } from 'cc';
const { ccclass, property } = _decorator;

// 单个密码格的内部数据结构
interface PasswordCellData {
    node: Node;          // 密码格节点
    numLabel: Label;     // 数字显示标签
    button: Button;      // 点击按钮
    currentNum: number;  // 当前数字
    index: number;       // 索引（0-5）
}

@ccclass('PasswordSystem')
export class PasswordSystem extends Component {
    // ==================== 编辑器配置项 ====================
    @property({ type: [Node], displayName: "6个密码格节点" })
    public passwordCellNodes: Node[] = []; // 绑定6个密码格节点

    @property({ displayName: "目标密码（250829）" })
    public targetPassword: number[] = [2, 5, 0, 8, 2, 9];

    @property({ displayName: "解锁后跳转的场景名" })
    public nextSceneName: string = "next_scene";

    @property({ displayName: "点击是否播放缩放动画" })
    public playClickAni: boolean = true;

    // ==================== 内部变量 ====================
    private cellDatas: PasswordCellData[] = []; // 6个密码格的数据源
    private isUnlocked: boolean = false;        // 是否已解锁（防止重复触发）

    // ==================== 生命周期 ====================
    onLoad() {
        // 校验密码格数量
        if (this.passwordCellNodes.length !== 6) {
            console.error(`[密码系统] 必须绑定6个密码格！当前数量：${this.passwordCellNodes.length}`);
            return;
        }

        // 初始化6个密码格
        this.initAllCells();
    }

    // ==================== 密码格初始化（核心修正：事件绑定） ====================
    private initAllCells() {
        this.cellDatas = [];
        this.passwordCellNodes.forEach((cellNode, index) => {
            // 获取核心组件
            const numLabel = cellNode.getComponent(Label) || cellNode.addComponent(Label);
            const button = cellNode.getComponent(Button) || cellNode.addComponent(Button);

            // 初始化数字为0
            numLabel.string = "0";

            // 移除原EventHandler.create，直接通过button.node.on绑定点击事件
            button.node.off(Button.EventType.CLICK, this.onCellClick, this); // 先解绑防止重复绑定
            button.node.on(Button.EventType.CLICK, () => {
                this.onCellClick(index); // 传递密码格索引
            }, this);

            // 存入数据源
            this.cellDatas.push({
                node: cellNode,
                numLabel: numLabel,
                button: button,
                currentNum: 0,
                index: index
            });
        });
    }

    // ==================== 密码格点击逻辑 ====================
    /**
     * 密码格点击事件（index：密码格索引0-5）
     */
    public onCellClick(index: number) {
        if (this.isUnlocked) return; // 已解锁则不响应

        const cell = this.cellDatas[index];
        if (!cell) return;

        // 数字+1，超过9重置为0
        cell.currentNum += 1;
        if (cell.currentNum > 9) {
            cell.currentNum = 0;
        }

        // 更新数字显示
        cell.numLabel.string = cell.currentNum.toString();

        // 播放点击缩放动画
        if (this.playClickAni) {
            tween(cell.node)
                .to(0.1, { scale: new Vec3(0.9, 0.9, 1) })
                .to(0.1, { scale: new Vec3(1, 1, 1) })
                .start();
        }

        // 实时校验密码
        this.checkPassword();
    }

    // ==================== 密码校验逻辑 ====================
    private checkPassword() {
        // 收集当前6位密码
        const currentPwd = this.cellDatas.map(cell => cell.currentNum);
        console.log(`[密码系统] 当前密码：${currentPwd.join('')}`);

        // 逐位对比目标密码
        const isCorrect = currentPwd.every((num, index) => num === this.targetPassword[index]);
        if (isCorrect) {
            this.onPasswordCorrect();
        }
    }

    // ==================== 密码正确：解锁场景 ====================
    private onPasswordCorrect() {
        this.isUnlocked = true;
        console.log(`[密码系统] 密码正确！解锁场景：${this.nextSceneName}`);

        // 1. 禁用所有密码格（防止重复点击）
        this.cellDatas.forEach(cell => cell.button.interactable = false);

        // 2. 调用AVG交互管理器切换场景（兼容你的原有框架）
        this.switchToNextScene();
    }

    // ==================== 调用AVG交互管理器切换场景 ====================
    private switchToNextScene() {
        // 方式1：优先调用AVGInteractionManager（如果存在）
        const interactionMgr = window['AVGInteractionManager']?.instance;
        if (interactionMgr && typeof interactionMgr.onSwitchScene === 'function') {
            interactionMgr.onSwitchScene(this.nextSceneName);
            return;
        }
    }
}