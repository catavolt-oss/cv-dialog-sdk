/**
 */
export class MobileComment_CommentNotAvailable_FORM_REDIRECTION {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/9/actions/alias_ShowLatest';

    private static BODY = {
        "targets": ["{\"C\":\"'6P7102PA'\",\"N\":\"FDWDocumentRevisions(Id='6P7102PA')\"}"],
        "type": "hxgn.api.dialog.ActionParameters"
    };

    private static RESPONSE = {
        "dialogMode": "CREATE",
        "referringObject": {
            "dialogType": "hxgn.api.dialog.QueryDialog",
            "dialogMode": "LIST",
            "dialogAlias": "Workpackage_Documents_Documents",
            "dialogProperties": {
                "globalRefresh": "true",
                "localRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"ShowLatest\",\"DataObject\":\"Documents\",\"DataSource\":\"HexagonSDA\",\"Form\":\"FORM\"}",
                "dialogAlias": "Documents_ShowLatest_FORM"
            },
            "actionId": "alias_ShowLatest",
            "rootDialogName": "Workpackage_Documents_FORM",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "9",
            "dialogName": "Workpackage_Documents_Documents",
            "rootDialogId": "6"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "14",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "null",
        "dialogAlias": "MobileComment_CommentNotAvailable_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "14",
        "dialogName": "MobileComment_CommentNotAvailable_FORM",
        "selectedViewId": "AAABACcaAAAAA-nm404746552:17388:533459633:14",
        "dialogDescription": "New Run Action"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
