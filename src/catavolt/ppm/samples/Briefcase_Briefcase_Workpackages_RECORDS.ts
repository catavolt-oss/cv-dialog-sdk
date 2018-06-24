/**
 */
export class Briefcase_Briefcase_Workpackages_RECORDS {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/11/records';

    private static BODY = {
        "fetchDirection": "FORWARD",
        "fetchMaxRecords": 50,
        "fromRecordId": "6GW7000A",
        "type": "hxgn.api.dialog.QueryParameters"
    };

    private static RESPONSE = {
        "defaultActionId": null,
        "records": [{
            "annotations": [],
            "id": "6GW7000A",
            "type": "hxgn.api.dialog.Record",
            "properties": [{
                "name": "name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "SDA Mobile Test Package"
            }, {
                "name": "workpackageid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "6GW7000A"
            }, {
                "name": "description",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "SDA Mobile Test Package"
            }, {
                "name": "creation_date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2017-10-11"
            }, {
                "name": "disciplines",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "last_update_date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2017-10-11"
            }]
        }],
        "dialogAlias": "Briefcase_Briefcase_Workpackages",
        "hasMore": false,
        "type": "hxgn.api.dialog.RecordSet",
        "dialogName": "Briefcase_Briefcase_Workpackages"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
