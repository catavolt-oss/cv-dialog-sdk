/**
 * Created by rburson on 4/1/15.
 */
export class XGetActiveColumnDefsResult {
    constructor(columnsStyle, columns) {
        this.columnsStyle = columnsStyle;
        this.columns = columns;
    }
    get columnDefs() {
        return this.columns;
    }
}
