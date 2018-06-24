/**
 */
export class Briefcase_Briefcase_MobileComments_RECORDS {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/12/records';

    private static BODY = {
        "fetchDirection": "FORWARD",
        "fetchMaxRecords": 50,
        "fromRecordId": "6H9B000A",
        "type": "hxgn.api.dialog.QueryParameters"
    };

    private static RESPONSE = {
        "defaultActionId": null,
        "records": [{
            "annotations": [],
            "id": "6H9B000A",
            "type": "hxgn.api.dialog.Record",
            "properties": [{
                "name": "workpackageid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "6GW7000A"
            }, {
                "name": "tagid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "6FQA03BA"
            }, {
                "name": "name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "teacup"
            }, {
                "name": "description",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "teacup is empty"
            }, {
                "name": "documentid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "mobilecommentid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "6H9B000A"
            }, {
                "name": "picture",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {"name": "status", "format": null, "annotations": [], "type": "hxgn.api.dialog.Property", "value": null}]
        }],
        "dialogAlias": "Briefcase_Briefcase_MobileComments",
        "hasMore": false,
        "type": "hxgn.api.dialog.RecordSet",
        "dialogName": "Briefcase_Briefcase_MobileComments"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
