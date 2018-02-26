import { ReferringObject } from './ReferringObject';
import { DialogMode } from './types';

export class ReferringDialog extends ReferringObject {
    public readonly dialogId: string;
    public readonly dialogMode: DialogMode;
}
