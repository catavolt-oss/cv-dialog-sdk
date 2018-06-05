/**
 */
export class MobileComment_Details_FORM_REDIRECTION {

    private static PATH = 'tenants/hexagonsdaop/sessions/9ad5dfd3e9224be3bdfaa5cf8840d88a_1819367476_6538_1632767848/dialogs/20/actions/alias_ShowLatest';

    private static BODY = {
        "targets": ["{\"C\":\"'6FR0834A'\",\"N\":\"FusionDocuments(Id='6FR0834A')\"}"],
        "type": "hxgn.api.dialog.ActionParameters"
    };

    private static RESPONSE = {
        "dialogMode": "READ",
        "referringObject": {
            "dialogType": "hxgn.api.dialog.QueryDialog",
            "dialogMode": "LIST",
            "dialogAlias": "Tag_Details_Documents",
            "dialogProperties": {
                "globalRefresh": "true",
                "localRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"ShowLatest\",\"DataObject\":\"Documents\",\"DataSource\":\"HexagonSDA\",\"Form\":\"FORM\"}",
                "dialogAlias": "Documents_ShowLatest_FORM"
            },
            "actionId": "alias_ShowLatest",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "20",
            "dialogName": "Tag_Details_Documents"
        },
        "sessionId": "9ad5dfd3e9224be3bdfaa5cf8840d88a_1819367476_6538_1632767848",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "69",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAACfD.com.catavolt.odata.hexagonsdaopAAABACcRAAAAACdo.Intergraph.SPF.Server.API.Model.MobileComment",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "{\"C\":\"'6HK7000A'\",\"N\":\"MobileComments(Id='6HK7000A')\"}",
        "dialogAlias": "MobileComment_Details_FORM",
        "tenantId": "hexagonsdaop",
        "refreshNeeded": false,
        "id": "69",
        "dialogName": "MobileComment_Details_FORM",
        "selectedViewId": "AAABACcXAAAAAC0c",
        "dialogDescription": "Mobile Comment: Tad Doc name 29 0718"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
