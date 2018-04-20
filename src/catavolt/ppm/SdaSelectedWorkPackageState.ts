import {RecordState} from "../proxy/RecordState";
import {SdaWorkPackageState} from "./SdaWorkPackageState";

/**
 *
 */
export class SdaSelectedWorkPackageState extends RecordState {

    private static CREATION_DATE_PROPERTY_NAME = "Creation_Date";
    private static DESCRIPTION_PROPERTY_NAME = "Description";
    private static DISCIPLINES_PROPERTY_NAME = "Disciplines";
    private static ID_PROPERTY_NAME = "Id";
    private static LAST_UPDATE_DATE_PROPERTY_NAME = "Last_Update_Date";
    private static NAME_PROPERTY_NAME = "Name";

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static createFromWorkPackageState(workPackageState: SdaWorkPackageState) {
        const selectedWorkPackageState = new SdaSelectedWorkPackageState({
            id: workPackageState.id(),
            properties: [],
            annotations: []
        });
        selectedWorkPackageState.setCreationDate(workPackageState.creationDate());
        selectedWorkPackageState.setDescription(workPackageState.description());
        selectedWorkPackageState.setDisciplines(workPackageState.disciplines());
        selectedWorkPackageState.setId(workPackageState.id());
        selectedWorkPackageState.setLastUpdateDate(workPackageState.lastUpdateDate());
        selectedWorkPackageState.setName(workPackageState.name());
    }

    // --- State Management --- //

    public creationDate(): string {
        return this.getPropertyValue(SdaSelectedWorkPackageState.CREATION_DATE_PROPERTY_NAME);
    }

    public setCreationDate(value: string) {
        this.setPropertyValue(SdaSelectedWorkPackageState.CREATION_DATE_PROPERTY_NAME, value);
    }

    public description(): string {
        return this.getPropertyValue(SdaSelectedWorkPackageState.DESCRIPTION_PROPERTY_NAME);
    }

    public setDescription(value: string) {
        this.setPropertyValue(SdaSelectedWorkPackageState.DESCRIPTION_PROPERTY_NAME, value);
    }

    public disciplines(): string {
        return this.getPropertyValue(SdaSelectedWorkPackageState.DISCIPLINES_PROPERTY_NAME);
    }

    public setDisciplines(value: string) {
        this.setPropertyValue(SdaSelectedWorkPackageState.DISCIPLINES_PROPERTY_NAME, value);
    }

    public id(): string {
        return this.getPropertyValue(SdaSelectedWorkPackageState.ID_PROPERTY_NAME);
    }

    public setId(value: string) {
        this.setPropertyValue(SdaSelectedWorkPackageState.ID_PROPERTY_NAME, value);
    }

    public lastUpdateDate(): string {
        return this.getPropertyValue(SdaSelectedWorkPackageState.LAST_UPDATE_DATE_PROPERTY_NAME);
    }

    public setLastUpdateDate(value: string) {
        this.setPropertyValue(SdaSelectedWorkPackageState.LAST_UPDATE_DATE_PROPERTY_NAME, value);
    }

    public name(): string {
        return this.getPropertyValue(SdaSelectedWorkPackageState.NAME_PROPERTY_NAME);
    }

    public setName(value: string) {
        this.setPropertyValue(SdaSelectedWorkPackageState.NAME_PROPERTY_NAME, value);
    }

}
