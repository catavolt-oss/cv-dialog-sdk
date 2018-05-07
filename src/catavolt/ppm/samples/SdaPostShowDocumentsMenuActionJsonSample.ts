/**
 */
export class SdaPostShowDocumentsMenuActionJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/16/actions/alias_ShowDocs';

    private static BODY = {"targets": [], "type": "hxgn.api.dialog.ActionParameters"};

    private static RESPONSE = {
        "dialogMode": "READ",
        "referringObject": {
            "dialogMode": "DESTROYED",
            "dialogAlias": "Tag_ShowDocs_FORM",
            "dialogProperties": {
                "globalRefresh": "true",
                "destroyed": "TRUE",
                "localRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"ShowDocs\",\"DataObject\":\"Tag\",\"DataSource\":\"HexagonSDA\",\"Form\":\"FORM\"}",
                "dialogAlias": "Tag_ShowDocs_FORM"
            },
            "actionId": "alias_ShowDocs",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "16",
            "dialogName": "Tag_ShowDocs_FORM"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "20",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAAChJ.com.catavolt.odata.hexagonsdaopAAABACcRAAAAACdo.Intergraph.SPF.Server.API.Model.Workpackage",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "{\"C\":\"'6GW7000A'\",\"N\":\"Workpackages(Id='6GW7000A')\"}",
        "dialogAlias": "Workpackage_Documents_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "20",
        "dialogName": "Workpackage_Documents_FORM",
        "selectedViewId": "AAABACcXAAAAAChO",
        "dialogDescription": "Work Package: SDA Mobile Test Package"
    };

}
