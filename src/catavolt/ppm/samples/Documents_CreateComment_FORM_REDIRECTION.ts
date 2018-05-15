/**
 */
export class Documents_CreateComment_FORM_REDIRECTION {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/9/actions/alias_CreateComment';

    private static BODY = {
        "targets": ["{\"C\":\"'6GRT04PA'\",\"N\":\"FusionDocuments(Id='6GRT04PA')\"}"],
        "type": "hxgn.api.dialog.ActionParameters"
    };

    private static RESPONSE = {
        "dialogMode": "CREATE",
        "referringObject": {
            "dialogMode": "LIST",
            "dialogAlias": "Workpackage_Documents_Documents",
            "dialogProperties": {
                "dialogAliasPath": "{\"DataObject\":\"Workpackage\",\"DataSource\":\"HexagonSDA\",\"Detail\":\"Documents\",\"QuerySection\":\"Documents\",\"ToQuery\":{\"DataObject\":\"Documents\",\"DataSource\":\"HexagonSDA\",\"Query\":\"WorkPackage\"}}",
                "dialogAlias": "Workpackage_Documents_Documents"
            },
            "actionId": "alias_CreateComment",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "9",
            "dialogName": "Workpackage_Documents_Documents"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "10",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "null",
        "dialogAlias": "Documents_CreateComment_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "10",
        "dialogName": "Documents_CreateComment_FORM",
        "selectedViewId": "AAABACcaAAAAACfn351699060:1257:331442876:10",
        "dialogDescription": "New Run Action"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
