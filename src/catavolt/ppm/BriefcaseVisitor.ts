import { RecordVisitor } from '../proxy/RecordVisitor';

/**
 *
 */
export class BriefcaseVisitor extends RecordVisitor {
    private static ONLINE_PROPERTY_NAME = 'online';

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static visitAndSetOnline(jsonObject: object, online: boolean) {
        return new BriefcaseVisitor(jsonObject).visitAndSetOnline(online);
    }

    // --- State Management --- //

    public visitOnline(): boolean {
        return this.visitPropertyValueAt(BriefcaseVisitor.ONLINE_PROPERTY_NAME);
    }

    public visitAndSetOnline(onlineValue: boolean) {
        this.visitAndSetPropertyValueAt(BriefcaseVisitor.ONLINE_PROPERTY_NAME, onlineValue);
    }
}
