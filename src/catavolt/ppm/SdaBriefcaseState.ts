import {RecordState} from "../proxy/RecordState";

/**
 *
 */
export class SdaBriefcaseState extends RecordState {

    private static ONLINE_PROPERTY_NAME = 'online';

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    // --- State Management --- //

    public online(): boolean {
        return this.getPropertyValue(SdaBriefcaseState.ONLINE_PROPERTY_NAME);
    }

    public setOnline(online: boolean) {
        this.setPropertyValue(SdaBriefcaseState.ONLINE_PROPERTY_NAME, online);
    }

}
