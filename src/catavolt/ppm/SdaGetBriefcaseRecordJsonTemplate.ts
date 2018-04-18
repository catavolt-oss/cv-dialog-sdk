/**
 */
export class SdaGetBriefcaseRecordJsonTemplate {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/8/record';

    private static RESPONSE = {
        "annotations": [],
        "id": "1",
        "type": "hxgn.api.dialog.Record",
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

    public static response(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
