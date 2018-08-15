/**
 */
export class MobileComment_ImageNotAvailable_FORM_REDIRECTION {

    private static PATH = 'tenants/hexagonsdaop/sessions/904d23a3343b4805a4f2dd3f934e6fda_48191398_16492_311163987/dialogs/32/actions/alias_OpenLatestFile';

    private static BODY = {
        "pendingWrites": {
            "id": "{\"C\":\"'6Q06000A'\",\"N\":\"FieldObservations(Id='6Q06000A')\"}",
            "properties": [],
            "type": "hxgn.api.dialog.Record"
        }, "type": "hxgn.api.dialog.ActionParameters"
    };

    private static RESPONSE = {
        "dialogMode": "CREATE",
        "referringObject": {
            "dialogType": "hxgn.api.dialog.EditorDialog",
            "dialogMode": "READ",
            "dialogAlias": "MobileComment_Details_Properties",
            "dialogProperties": {"globalRefresh": "true", "localRefresh": "true"},
            "actionId": "alias_OpenLatestFile",
            "rootDialogName": "MobileComment_Details_FORM",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "32",
            "dialogName": "MobileComment_Details_Properties",
            "rootDialogId": "30"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "${dialogId}",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "null",
        "dialogAlias": "MobileComment_ImageNotAvailable_FORM",
        "tenantId": "hexagonsdaop",
        "refreshNeeded": false,
        "id": "37",
        "dialogName": "MobileComment_ImageNotAvailable_FORM",
        "selectedViewId": "AAABACcaAAAAA-oO48191398:16492:311163987:37",
        "dialogDescription": "New Run Action"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
