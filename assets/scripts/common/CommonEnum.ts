import { _decorator, Enum } from "cc";
const { ccclass } = _decorator;
@ccclass('CommonEnum')
export class CommonEnum {
    //场景类型
    public static sceneType = Enum(
        {
            bedroomAll: 0,
            bedClose: 1,
            deskClose: 2,
            frameClose: 3,
            leftDrawerClose: 4,
            rightDrawerClose: 5,
            bookcaseClose: 6,
            blackLayer: 7,
            bathroom: 8,
            bathroomClose: 9,
            calendarClose: 10,
            codeYuanLiContent: 11,
            phoneClose: 12,
            codeYuanLiArise: 13,
            rightDrawerCloseUp: 14,
            xuanZhiClose: 15,
            diaryDetail: 16,
        }
    )
    //场景内交互物件
    public static InteractiveItemType = Enum(
        {
            pillow: 0,
            codeYuanLi: 1,
            desk: 2,
            phone: 3,
            frame: 4,
            lockedDrawer: 5,
            key: 6,
            xuanZhi: 7,
            pencilCase: 8,
            handwashingSink: 9,
            passwordDiary:10,
        }
    )
    public static EventName = {
        PHONE_UNLOCK: "phone_lock_unlock", 
        ITEM_PICKED: "item_picked"         
    };
}