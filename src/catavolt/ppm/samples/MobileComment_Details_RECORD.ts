/**
 */
export class MobileComment_Details_RECORD {

    private static PATH = 'tenants/hexagonsdaop/sessions/9ad5dfd3e9224be3bdfaa5cf8840d88a_1819367476_6538_1632767848/dialogs/71/record';

    private static RESPONSE = {
        "dialogAlias": "MobileComment_Details_Properties",
        "annotations": [],
        "id": "{\"C\":\"'6HK7000A'\",\"N\":\"MobileComments(Id='6HK7000A')\"}",
        "type": "hxgn.api.dialog.Record",
        "dialogName": "MobileComment_Details_Properties",
        "properties": [{
            "name": "Description",
            "format": null,
            "annotations": [],
            "type": "hxgn.api.dialog.Property",
            "value": "Tag Doc desc 29 0718"
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
            "value": "Tag Doc name 29 0718"
        }]
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
