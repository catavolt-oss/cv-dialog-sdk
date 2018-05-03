/**
 */
export class SdaPostShowTagsRecords1JsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/16/records';

    private static BODY = {
        "fetchDirection": "FORWARD",
        "fetchMaxRecords": 50,
        "type": "hxgn.api.dialog.QueryParameters"
    };

    private static RESPONSE = {
        "defaultActionId": "open",
        "records": [{
            "annotations": [],
            "id": "{\"C\":\"'6FQA03BA'\",\"N\":\"FusionTags(Id='6FQA03BA')\"}",
            "type": "hxgn.api.dialog.Record",
            "properties": [{
                "name": "Id",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "6FQA03BA"
            }, {
                "name": "Name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "77-P-7703A"
            }, {
                "name": "Description",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }]
        }],
        "dialogAlias": "Workpackage_Tags_Tags",
        "hasMore": false,
        "type": "hxgn.api.dialog.RecordSet",
        "dialogName": "Workpackage_Tags_Tags"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
