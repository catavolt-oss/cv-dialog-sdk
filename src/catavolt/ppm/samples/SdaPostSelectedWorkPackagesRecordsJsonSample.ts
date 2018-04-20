/**
 */
export class SdaPostSelectedWorkPackagesRecordsJsonSample {

    private static PATH = 'tenants/hexagonsdaop/sessions/0ed195f6fb0d406f998118c994ec169d_671398670_4260_1017952399/dialogs/9/records';

    private static BODY = {
        "fetchDirection": "FORWARD",
        "fetchMaxRecords": 50,
        "type": "hxgn.api.dialog.QueryParameters"
    };

    private static RESPONSE = {
        "dialogAlias": "Briefcase_Briefcase_Workpackages",
        "defaultActionId": null,
        "records": [{
            "annotations": [],
            "id": "6GW7000A",
            "type": "hxgn.api.dialog.Record",
            "properties": [{
                "name": "Creation_Date",
                "format": "date-time",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2017-10-11T10:32:31"
            }, {
                "name": "Last_Update_Date",
                "format": "date-time",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2017-10-11T10:32:31"
            }, {
                "name": "Disciplines",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "Id",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "6GW7000A"
            }, {
                "name": "Description",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "SDA Mobile Test Package"
            }, {
                "name": "Name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "SDA Mobile Test Package"
            }]
        }],
        "hasMore": false,
        "type": "hxgn.api.dialog.RecordSet"
    };

    private static EMPTY_RESPONSE = {
        "dialogAlias": "Briefcase_Briefcase_Workpackages",
        "defaultActionId": null,
        "records": [],
        "hasMore": false,
        "type": "hxgn.api.dialog.RecordSet"
    };

    public static copyOfEmptyResponse(): object {
        return JSON.parse(JSON.stringify(this.EMPTY_RESPONSE));
    }

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
