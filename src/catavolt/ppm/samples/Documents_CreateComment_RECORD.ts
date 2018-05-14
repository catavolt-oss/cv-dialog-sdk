/**
 */
export class Documents_CreateComment_RECORD {

    private static PATH = 'tenants/hexagonsdaop/sessions/6562119136c2458fbce7dd90b3bf48f3_351699060_1257_331442876/dialogs/12/record';

    private static RESPONSE = {
        "dialogAlias": "Documents_CreateComment",
        "annotations": [],
        "id": null,
        "type": "hxgn.api.dialog.Record",
        "dialogName": "Documents_CreateComment",
        "properties": [{
            "name": "P_NAME",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": ""
        }, {
            "name": "P_DESCRIPTION",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": ""
        }, {
            "name": "P_IMAGE",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": null
        }]
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
