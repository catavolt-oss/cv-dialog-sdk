/**
 */
export class SdaPostWorkPackagesRecords1JsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/2/records';

    private static BODY = {
        "fetchDirection": "FORWARD",
        "fetchMaxRecords": 50,
        "type": "hxgn.api.dialog.QueryParameters"
    };

    private static RESPONSE = {
        "defaultActionId": "alias_Open",
        "records": [{
            "annotations": [],
            "id": "6GW7000A",
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
                "value": "SDA Mobile Test Package"
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
                "value": "SDA Mobile Test Package"
            }, {
                "name": "UID",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "WP_PAP_SDA_Mobile_Test_Package"
            }, {
                "name": "Creation_User",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "FusionAdministrator"
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
                "name": "Contract",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }]
        }, {
            "annotations": [],
            "id": "6H9H000A",
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
                "value": "walkdown 1"
            }, {
                "name": "Config",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "Name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "walkdown 1"
            }, {
                "name": "UID",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "WP_walkdown_1"
            }, {
                "name": "Creation_User",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "FusionDocController"
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
                "value": "2017-11-30"
            }, {
                "name": "Last_Update_Date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2017-11-30"
            }, {
                "name": "Id",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "6H9H000A"
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

    public static response(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
