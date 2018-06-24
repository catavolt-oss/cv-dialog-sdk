/**
 */
export class Briefcase_EnterOfflineMode_RECORD {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/15/record';

    private static RESPONSE = {
        "dialogAlias": "Briefcase_EnterOfflineMode",
        "annotations": [],
        "id": null,
        "type": "hxgn.api.dialog.Record",
        "dialogName": "Briefcase_EnterOfflineMode",
        "properties": [{
            "name": "P_PASSWORD",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": ""
        }, {
            "name": "P_USERID",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": "SomeUser"
        }, {
            "name": "P_ONLINE",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": true
        }, {
            "name": "P_PASSWORD_CONFIRM",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": ""
        }]
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
