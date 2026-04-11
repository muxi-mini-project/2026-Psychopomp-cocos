import { _decorator, Component, Node } from "cc";
import { DataManager } from "../core/DataManager";
const { ccclass, property } = _decorator;

const FLAG = {
    NOTE_CHECKED: 'NOTE_CHECKED',
} as const;

@ccclass('KeyToNoteContent')
export class KeyToNoteContent extends Component {
    @property({ type: Node, tooltip: '备忘录的钥匙节点' })
    public keyNode: Node | null = null;

    onEnable() {
        console.log('[KeyToNoteContent] onEnable - 注册点击监听');
        this.node.on(Node.EventType.TOUCH_END, this._onClicked, this);
    }

    onDisable() {
        console.log('[KeyToNoteContent] onDisable - 注销点击监听');
        this.node.off(Node.EventType.TOUCH_END, this._onClicked, this);
    }

    private _onClicked(): void {
        console.log('[KeyToNoteContent] _onClicked - 点击备忘录钥匙节点');

        if (this.keyNode) {
            this.keyNode.active = true;
            console.log('[KeyToNoteContent] 钥匙节点已显示');
        }

        DataManager.instance.setFlag(FLAG.NOTE_CHECKED, true);
        console.log(`[KeyToNoteContent] 设置 Flag: ${FLAG.NOTE_CHECKED} = true`);
    }
}