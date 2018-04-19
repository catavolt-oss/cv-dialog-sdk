/**
 */
export class SdaPostAddToBriefcaseMenuActionJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/2/actions/alias_AddToBriefcase';

    private static BODY = {"targets": ["6GW7000A"], "type": "hxgn.api.dialog.ActionParameters"};

    private static RESPONSE = {
        "tenantId": "${tenantId}",
        "referringObject": {
            "dialogMode": "LIST",
            "dialogAliasPath": {
                "Action": "AddToBriefcase",
                "DataObject": "Workpackage",
                "Form": "FORM",
                "DataSource": "SDALocal"
            },
            "dialogAlias": "Workpackage_AddToBriefcase_FORM",
            "dialogProperties": {
                "globalRefresh": "true",
                "localRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"AddToBriefcase\",\"DataObject\":\"Workpackage\",\"DataSource\":\"SDALocal\",\"Form\":\"FORM\"}",
                "dialogAlias": "Workpackage_AddToBriefcase_FORM"
            },
            "actionId": "alias_AddToBriefcase",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "2"
        },
        "refreshNeeded": true,
        "sessionId": "${sessionId}",
        "id": "null_redirection__1524063296504_5529515320292151",
        "type": "hxgn.api.dialog.NullRedirection"
    };

    public static response(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
