import { CellValue } from './CellValue';

/**
 * A text description typically preceeding a UI component as a prompt
 */
export class LabelCellValue extends CellValue {
    constructor(style, readonly value: string) {
        super(style);
    }
}
