/**
 */
export class Briefcase_EnterOfflineMode_RECORD_CANCEL {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/21/viewMode/READ';

    private static BODY = {};

    private static RESPONSE = {};

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
