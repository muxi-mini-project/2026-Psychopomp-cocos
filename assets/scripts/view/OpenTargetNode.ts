import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OpenTargetNode')
export class OpenTargetNode extends Component {
    @property(Node)
    target: Node | null = null;

    // @property(Node)
    // mask: Node | null = null;

    public open() {
        if (this.target) {
            this.target.active = true;
        }

        // if (this.mask) {
        //     this.mask.active = true;
        // }
    }
}

