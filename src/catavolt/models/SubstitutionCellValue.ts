import {CellValue} from "./CellValue";

/**
 * A text template containing substitution parameters that is instantiated at presentation time and filled with business values.
 */
export class SubstitutionCellValue extends CellValue {

    constructor(style, readonly value: string) {
        super(style);
    }

}
