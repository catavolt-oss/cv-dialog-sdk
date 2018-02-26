import { DialogException } from './DialogException';
import { View } from './View';

/**
 * *********************************
 */

export class ErrorMessage extends View {
    public readonly exception: DialogException;
}
