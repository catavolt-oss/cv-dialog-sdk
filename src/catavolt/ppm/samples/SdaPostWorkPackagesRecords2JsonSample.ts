/**
 */
export class SdaPostWorkPackagesRecords2JsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/2/records';

    private static BODY = {
        "fetchDirection": "FORWARD",
        "fetchMaxRecords": 50,
        "fromRecordId": "AA48",
        "type": "hxgn.api.dialog.QueryParameters"
    };

    private static RESPONSE = {
        "dialogAlias": "Workpackage_General",
        "dialogName": "Workpackage_General",
        "defaultActionId": "alias_Open",
        "records": [{
            "annotations": [],
            "id": "AA49",
            "type": "hxgn.api.dialog.Record",
            "properties": [{
                "name": "Disciplines",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "Owning_Group",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "Description",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "Test 49"
            }, {
                "name": "Config",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "PL_PAP"
            }, {
                "name": "Name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "Test 49"
            }, {
                "name": "UID",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "Test 49"
            }, {
                "name": "Creation_User",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "SMU"
            }, {
                "name": "Classification",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "Work Pack for Mobile"
            }, {
                "name": "Organizations",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "Creation_Date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2018-01-01"
            }, {
                "name": "Last_Update_Date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2018-01-01"
            }, {
                "name": "Id",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "AA49"
            }, {
                "name": "Contract",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }]
        }, {
            "annotations": [],
            "id": "AA50",
            "type": "hxgn.api.dialog.Record",
            "properties": [{
                "name": "Disciplines",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "Owning_Group",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "Description",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "Test 50"
            }, {
                "name": "Config",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "PL_PAP"
            }, {
                "name": "Name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "Test 50"
            }, {
                "name": "UID",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "Test 50"
            }, {
                "name": "Creation_User",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "SMU"
            }, {
                "name": "Classification",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "Work Pack for Mobile"
            }, {
                "name": "Organizations",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "Creation_Date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2018-01-01"
            }, {
                "name": "Last_Update_Date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2018-01-01"
            }, {
                "name": "Id",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "AA50"
            }, {
                "name": "Contract",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }]
        }],
        "hasMore": true,
        "type": "hxgn.api.dialog.RecordSet"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
