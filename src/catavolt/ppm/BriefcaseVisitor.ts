import {RecordVisitor} from "../proxy/RecordVisitor";

/**
 *
 */
export class BriefcaseVisitor extends RecordVisitor {

    private static ONLINE_PROPERTY_NAME = 'online';

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static visitAndSetOnlineValue(jsonObject: object, online: boolean) {
        return (new BriefcaseVisitor(jsonObject)).visitAndSetOnlineValue(online);
    }

    // --- State Management --- //

    public visitOnlineValue(): boolean {
        return this.visitPropertyValueAt(BriefcaseVisitor.ONLINE_PROPERTY_NAME);
    }

    public visitAndSetOnlineValue(onlineValue: boolean) {
        this.visitAndSetPropertyValueAt(BriefcaseVisitor.ONLINE_PROPERTY_NAME, onlineValue);
    }

}
