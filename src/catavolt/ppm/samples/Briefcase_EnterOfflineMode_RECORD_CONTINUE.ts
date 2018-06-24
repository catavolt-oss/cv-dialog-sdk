/**
 */
export class Briefcase_EnterOfflineMode_RECORD_CONTINUE {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/15/record';

    private static BODY = {
        "id": null,
        "properties": [{
            "name": "P_PASSWORD",
            "value": "ABC_PASS",
            "type": "hxgn.api.dialog.Property",
            "propertyType": null,
            "format": null
        }],
        "type": "hxgn.api.dialog.Record"
    };

    private static RESPONSE = {};

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
