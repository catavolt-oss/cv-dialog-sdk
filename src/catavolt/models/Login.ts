import { StringDictionary } from '../util/StringDictionary';
import { ClientType } from './types';

export interface Login {
    readonly userId: string;
    readonly password: string;
    readonly clientType: ClientType;
    readonly deviceProperties: StringDictionary;
    readonly type: string;
}
