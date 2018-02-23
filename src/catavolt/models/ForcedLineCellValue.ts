import {CellValue} from "./CellValue";

/**
 * A purely declarative type. This object has no additional properties.
 */
export class ForcedLineCellValue extends CellValue {

    constructor(style?: string) {
        super(style);
    }

}
