/**
 */
export class MobileComment_CommentNotAvailable_RECORD {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/16/record';

    private static RESPONSE = {
        "dialogAlias": "MobileComment_CommentNotAvailable",
        "annotations": [],
        "id": null,
        "type": "hxgn.api.dialog.Record",
        "dialogName": "MobileComment_CommentNotAvailable",
        "properties": []
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
