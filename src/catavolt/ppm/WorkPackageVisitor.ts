import { RecordVisitor } from '../proxy/RecordVisitor';

/**
 *
 */
export class WorkPackageVisitor extends RecordVisitor {
    private static BRIEFCASE_PROPERTY_NAME = 'briefcase';
    private static CLASSIFICATION_PROPERTY_NAME = 'Classification';
    private static CONFIG_PROPERTY_NAME = 'Config';
    private static CONTRACT_PROPERTY_NAME = 'Contract';
    private static CREATION_DATE_PROPERTY_NAME = 'Creation_Date';
    private static CREATION_USER_PROPERTY_NAME = 'Creation_User';
    private static DESCRIPTION_PROPERTY_NAME = 'Description';
    private static DISCIPLINES_PROPERTY_NAME = 'Disciplines';
    private static ID_PROPERTY_NAME = 'Id';
    private static LAST_UPDATE_DATE_PROPERTY_NAME = 'Last_Update_Date';
    private static NAME_PROPERTY_NAME = 'Name';
    private static ORGANIZATIONS_GROUP_PROPERTY_NAME = 'Organizations';
    private static OWNING_GROUP_PROPERTY_NAME = 'Owning_Group';
    private static UID_PROPERTY_NAME = 'UID';

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    // --- State Management --- //

    public visitBriefcase(): boolean {
        return this.visitPropertyValueAt(WorkPackageVisitor.BRIEFCASE_PROPERTY_NAME);
    }

    public visitClassification(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CLASSIFICATION_PROPERTY_NAME);
    }

    public visitConfig(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CONFIG_PROPERTY_NAME);
    }

    public visitContract(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CONTRACT_PROPERTY_NAME);
    }

    public visitCreationDate(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CREATION_DATE_PROPERTY_NAME);
    }

    public visitCreationUser(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.CREATION_USER_PROPERTY_NAME);
    }

    public visitDescription(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.DESCRIPTION_PROPERTY_NAME);
    }

    public visitDisciplines(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.DISCIPLINES_PROPERTY_NAME);
    }

    public visitId(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.ID_PROPERTY_NAME);
    }

    public visitLastUpdateDate(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.LAST_UPDATE_DATE_PROPERTY_NAME);
    }

    public visitName(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.NAME_PROPERTY_NAME);
    }

    public visitOrganizationsGroup(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.ORGANIZATIONS_GROUP_PROPERTY_NAME);
    }

    public visitOwningGroup(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.OWNING_GROUP_PROPERTY_NAME);
    }

    public visitUid(): string {
        return this.visitPropertyValueAt(WorkPackageVisitor.UID_PROPERTY_NAME);
    }
}
