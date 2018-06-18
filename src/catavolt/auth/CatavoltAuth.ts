import { JsonClientResponse } from '../client';
import { FetchClient } from '../ws';

export class CatavoltAuth {
    public static async getOAuthUrl(tenantId: string, proofKey: string): Promise<string> {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        };
        const jsonResponse: JsonClientResponse = await new FetchClient().postJson(
            this._getOAuthReqUrl(tenantId),
            null,
            { clientState: proofKey }
        );
        if (jsonResponse.statusCode !== 200) {
            throw new Error(`CatavoltAuth::getOAuthUrl failed with status code: ${jsonResponse.statusCode}`);
        }
        return jsonResponse.value['redirection'];
    }

    public static _getOAuthReqUrl(tenantId: string): string {
        return `https://oauth.catavolt.net/oauth/${tenantId}/v1/authorize?callback=true&redirection=false`;
    }
}
