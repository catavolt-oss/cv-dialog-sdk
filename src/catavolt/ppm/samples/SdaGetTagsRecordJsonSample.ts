/**
 *
 */
export class SdaGetTagsRecordJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/15/record';

    private static RESPONSE = {
        "dialogAlias": "Workpackage_Tags_Properties",
        "annotations": [],
        "id": "{\"C\":\"'6GW7000A'\",\"N\":\"Workpackages(Id='6GW7000A')\"}",
        "type": "hxgn.api.dialog.Record",
        "dialogName": "Workpackage_Tags_Properties",
        "properties": [{
            "name": "Description",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": "SDA Mobile Test Package"
        }, {
            "name": "Creation_Date",
            "format": "date",
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": "2017-10-11"
        }, {
            "name": "Last_Update_Date",
            "format": "date",
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": "2017-10-11"
        }, {
            "name": "Id",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": "6GW7000A"
        }, {
            "name": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": true
        }, {
            "name": "Name",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": "SDA Mobile Test Package"
        }]
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
