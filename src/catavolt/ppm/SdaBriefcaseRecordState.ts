import {RecordState} from "../proxy/RecordState";

/**
 *
 */
export class SdaBriefcaseRecordState extends RecordState {

    private static ONLINE_PROPERTY_NAME = 'online';

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    // --- State Management --- //

    public online(): boolean {
        return this.getPropertyValue(SdaBriefcaseRecordState.ONLINE_PROPERTY_NAME);
    }

}
