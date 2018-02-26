import { StringDictionary } from '../util/StringDictionary';
import { BinaryRef } from './BinaryRef';

export class ObjectBinaryRef extends BinaryRef {
    constructor(settings: StringDictionary) {
        super(settings);
    }
}
