/**
 */
export class Briefcase_Briefcase_FORM_REDIRECTION {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/workbenches/SDAWorkbench/actions/Briefcase';

    private static BODY = {};

    private static RESPONSE = {
        "dialogMode": "READ",
        "referringObject": {
            "actionId": "Briefcase",
            "type": "hxgn.api.dialog.ReferringWorkbench",
            "workbenchId": "SDAWorkbench"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "8",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAAF8B.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.briefcase",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "1",
        "dialogAlias": "Briefcase_Briefcase_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "8",
        "dialogName": "Briefcase_Briefcase_FORM",
        "selectedViewId": "AAABACcXAAAAAF8e",
        "dialogDescription": "Briefcase: 1"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
