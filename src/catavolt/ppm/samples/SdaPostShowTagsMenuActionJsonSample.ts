/**
 */
export class SdaPostShowTagsMenuActionJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/9/actions/alias_ShowTags';

    private static BODY = {"targets": [], "type": "hxgn.api.dialog.ActionParameters"};

    private static RESPONSE = {
        "dialogMode": "READ",
        "referringObject": {
            "dialogMode": "DESTROYED",
            "dialogAlias": "Documents_ShowTags_FORM",
            "dialogProperties": {
                "globalRefresh": "true",
                "destroyed": "TRUE",
                "localRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"ShowTags\",\"DataObject\":\"Documents\",\"DataSource\":\"HexagonSDA\",\"Form\":\"FORM\"}",
                "dialogAlias": "Documents_ShowTags_FORM"
            },
            "actionId": "alias_ShowTags",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "9",
            "dialogName": "Documents_ShowTags_FORM"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "13",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAAChJ.com.catavolt.odata.hexagonsdaopAAABACcRAAAAACdo.Intergraph.SPF.Server.API.Model.Workpackage",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "{\"C\":\"'6GW7000A'\",\"N\":\"Workpackages(Id='6GW7000A')\"}",
        "dialogAlias": "Workpackage_Tags_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "13",
        "dialogName": "Workpackage_Tags_FORM",
        "selectedViewId": "AAABACcXAAAAAChM",
        "dialogDescription": "Work Package: SDA Mobile Test Package"
    };

}
