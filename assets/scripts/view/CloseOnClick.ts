import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloseTargetNode')
export class CloseTargetNode extends Component {
    @property(Node)
    target: Node | null = null;

    // @property(Node)
    mask: Node | null = null;

    public close() {
        if (this.target) {
            this.target.active = false;
        }

        // if (this.mask) {
        //     this.mask.active = false;
        // }
    }
}

