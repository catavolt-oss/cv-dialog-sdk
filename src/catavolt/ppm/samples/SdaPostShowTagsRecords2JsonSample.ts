/**
 */
export class SdaPostShowTagsRecords2JsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/16/records';

    private static BODY = {
        "fetchDirection": "FORWARD",
        "fetchMaxRecords": 50,
        "fromRecordId": "{\"C\":\"'6FQA03BA'\",\"N\":\"FusionTags(Id='6FQA03BA')\"}",
        "type": "hxgn.api.dialog.QueryParameters"
    };

    private static RESPONSE = {
        "defaultActionId": "open",
        "records": [],
        "dialogAlias": "Workpackage_Tags_Tags",
        "hasMore": false,
        "type": "hxgn.api.dialog.RecordSet",
        "dialogName": "Workpackage_Tags_Tags"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
