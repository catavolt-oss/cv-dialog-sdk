/**
 */
export class SdaPostOpenWorkPackageMenuActionJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/2/actions/alias_Open';

    private static BODY = {"targets": ["6GW7000A"], "type": "hxgn.api.dialog.ActionParameters"};

    private static RESPONSE = {
        "dialogMode": "READ",
        "referringObject": {
            "dialogMode": "LIST",
            "dialogAlias": "Workpackage_Open_FORM",
            "dialogName": "Workpackage_Open_FORM",
            "dialogProperties": {
                "globalRefresh": "true",
                "localRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"Open\",\"DataObject\":\"Workpackage\",\"DataSource\":\"SDALocal\",\"Form\":\"FORM\"}",
                "dialogAlias": "Workpackage_Open_FORM"
            },
            "actionId": "alias_Open",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "2"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "6",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAAI59.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.Workpackage",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "6GW7000A",
        "dialogAlias": "Workpackage_Documents_FORM",
        "dialogName": "Workpackage_Documents_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "6",
        "selectedViewId": "AAABACcXAAAAAI9D",
        "dialogDescription": "Work Package: SDA Mobile Test Package"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
