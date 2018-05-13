/**
 */
export class Briefcase_Briefcase_Details_RECORD {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/3/record';

    private static RESPONSE = {
        "dialogAlias": "Briefcase_Briefcase_Details",
        "annotations": [],
        "id": "1",
        "type": "hxgn.api.dialog.Record",
        "dialogName": "Briefcase_Briefcase_Details",
        "properties": [{
            "name": "password",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": null
        }, {
            "name": "briefcaseid",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": "1"
        }, {
            "name": "online",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": true
        }, {
            "name": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": true
        }]
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
