import {RecordVisitor} from "../proxy/RecordVisitor";

/**
 *
 */
export class WorkPackageVisitor extends RecordVisitor {

    private static CLASSIFICATION_PROPERTY_NAME = "Classification";
    private static CONFIG_PROPERTY_NAME = "Config";
    private static CONTRACT_PROPERTY_NAME = "Contract";
    private static CREATION_DATE_PROPERTY_NAME = "Creation_Date";
    private static CREATION_USER_PROPERTY_NAME = "Creation_User";
    private static DESCRIPTION_PROPERTY_NAME = "Description";
    private static DISCIPLINES_PROPERTY_NAME = "Disciplines";
    private static ID_PROPERTY_NAME = "Id";
    private static LAST_UPDATE_DATE_PROPERTY_NAME = "Last_Update_Date";
    private static NAME_PROPERTY_NAME = "Name";
    private static ORGANIZATIONS_GROUP_PROPERTY_NAME = "Organizations";
    private static OWNING_GROUP_PROPERTY_NAME = "Owning_Group";
    private static UID_PROPERTY_NAME = "UID";

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    // --- State Management --- //

    public classification(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CLASSIFICATION_PROPERTY_NAME);
    }

    public config(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CONFIG_PROPERTY_NAME);
    }

    public contract(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CONTRACT_PROPERTY_NAME);
    }

    public creationDate(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CREATION_DATE_PROPERTY_NAME);
    }

    public creationUser(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CREATION_USER_PROPERTY_NAME);
    }

    public description(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.DESCRIPTION_PROPERTY_NAME);
    }

    public disciplines(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.DISCIPLINES_PROPERTY_NAME);
    }

    public id(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.ID_PROPERTY_NAME);
    }

    public lastUpdateDate(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.LAST_UPDATE_DATE_PROPERTY_NAME);
    }

    public name(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.NAME_PROPERTY_NAME);
    }

    public organizationsGroup(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.ORGANIZATIONS_GROUP_PROPERTY_NAME);
    }

    public owningGroup(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.OWNING_GROUP_PROPERTY_NAME);
    }

    public uid(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.UID_PROPERTY_NAME);
    }

}
