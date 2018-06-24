/**
 */
export class Briefcase_EnterOfflineMode_REDIRECTION {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/10/actions/alias_EnterOfflineMode';

    private static BODY = {
        "pendingWrites": {
            "id": "1",
            "properties": [],
            "type": "hxgn.api.dialog.Record"
        },
        "type": "hxgn.api.dialog.ActionParameters"
    };

    private static RESPONSE = {
        "dialogMode": "CREATE",
        "referringObject": {
            "dialogType": "hxgn.api.dialog.EditorDialog",
            "dialogMode": "READ",
            "dialogAlias": "Briefcase_Briefcase_Details",
            "dialogProperties": {},
            "actionId": "alias_EnterOfflineMode",
            "rootDialogName": "Briefcase_Briefcase_FORM",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "10",
            "dialogName": "Briefcase_Briefcase_Details",
            "rootDialogId": "8"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "13",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "null",
        "dialogAlias": "Briefcase_EnterOfflineMode_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "13",
        "dialogName": "Briefcase_EnterOfflineMode_FORM",
        "selectedViewId": "AAABACcaAAAAAGBT1241836571:477:139058878:13",
        "dialogDescription": "New Run Action"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
