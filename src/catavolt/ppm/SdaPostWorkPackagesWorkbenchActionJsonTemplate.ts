/**
 */
export class SdaPostWorkPackagesWorkbenchActionJsonTemplate {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/workbenches/SDAWorkbenchLOCAL/actions/WorkPackages';

    private static BODY = {};

    private static RESPONSE = {
        "dialogMode": "READ",
        "dialogAliasPath": {"DataObject": "Workpackage", "Query": "General", "Form": "FORM", "DataSource": "SDALocal"},
        "referringObject": {
            "actionId": "WorkPackages",
            "type": "hxgn.api.dialog.ReferringWorkbench",
            "workbenchId": "SDAWorkbenchLOCAL"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "1",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZCatavoltSatelliteEntityDashboardEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZCatavoltSatelliteEntityDashboard",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "AAABACcSAAAAAI59",
        "dialogAlias": "Workpackage_General_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "1",
        "selectedViewId": "ZZCatavoltSatelliteEntityDashboard_EditorView_Default",
        "dialogDescription": "Work Packages"
    };

    public static response(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
