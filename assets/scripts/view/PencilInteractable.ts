import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

const event = {
    INTERACTABLE_TRIGGERED: "INTERACTABLE_TRIGGERED",
    UI_MODAL: "UI_MODAL",
} as const;

@ccclass("PencilInteract")
export class PencilInteract extends Component {
    private readonly interactableId = "point_pencil";

    onEnable() {
        director.on(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
    }

    onDisable() {
        director.off(event.INTERACTABLE_TRIGGERED, this.onTriggered, this);
    }

    private onTriggered(result: any) {
        if (result?.interactableId !== this.interactableId) return;

        switch (result?.code) {
            case "PICK_PENCIL":
                director.emit(event.UI_MODAL, {
                    title: "获得物品",
                    content: `获得铅笔`,
                    okText: "确定",
                })
                return;

        }
    }


}
