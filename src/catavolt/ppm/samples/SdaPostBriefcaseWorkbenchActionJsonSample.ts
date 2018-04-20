/**
 */
export class SdaPostBriefcaseWorkbenchActionJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/workbenches/SDAWorkbenchLOCAL/actions/Briefcase';

    private static BODY = {};

    private static RESPONSE = {
        "dialogMode": "READ",
        "dialogAliasPath": {"DataObject": "Briefcase", "Form": "FORM", "Detail": "Briefcase", "DataSource": "SDALocal"},
        "referringObject": {
            "actionId": "Briefcase",
            "type": "hxgn.api.dialog.ReferringWorkbench",
            "workbenchId": "SDAWorkbenchLOCAL"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "offline_briefcase",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAAKH*.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.Briefcase",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "1",
        "dialogAlias": "Briefcase_Briefcase_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "offline_briefcase",
        "selectedViewId": "AAABACcXAAAAAKIr",
        "dialogDescription": "Briefcase: 1"
    };

    public static response(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
