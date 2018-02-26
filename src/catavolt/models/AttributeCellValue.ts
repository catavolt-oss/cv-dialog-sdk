import { CellValue } from './CellValue';
import { Menu } from './Menu';
import { AttributeCellValueEntryMethod } from './types';

/**
 * Defines how to present a business-value in a UI component
 */
export class AttributeCellValue extends CellValue {
    constructor(
        readonly propertyName: string,
        readonly entryMethod: AttributeCellValueEntryMethod,
        readonly hint: string,
        readonly tooltip: string,
        readonly mask: string,
        readonly autoFillCapable: boolean,
        readonly actions: Menu[],
        style: string
    ) {
        super(style);
    }

    get isComboBoxEntryMethod(): boolean {
        return this.entryMethod && this.entryMethod === 'COMBO_BOX';
    }

    get isDropDownEntryMethod(): boolean {
        return this.entryMethod && this.entryMethod === 'DROP_DOWN';
    }

    get isIconEntryMethod(): boolean {
        return this.entryMethod && this.entryMethod === 'ICON_CHOOSER';
    }

    get isTextFieldEntryMethod(): boolean {
        return !this.entryMethod || this.entryMethod === 'TEXT_FIELD';
    }
}
