import { Dictionary } from '../util/Dictionary';
import { StringDictionary } from '../util/StringDictionary';
import { AttributeCellValue } from './AttributeCellValue';
import { Cell } from './Cell';
import { CellValue } from './CellValue';
import { View } from './View';

export class PrintMarkup extends View {
    public readonly cancelButtonText: string;
    public readonly commitButtonText: string;
    public readonly editable: boolean;
    public readonly focusPropName: string;
    public readonly printMarkupXML: string;
    public readonly rows: Cell[][];

    private _orderedCellValue: Dictionary<AttributeCellValue> = null;

    get orderedCellValues(): StringDictionary {
        if (!this._orderedCellValue) {
            this._orderedCellValue = {};
            this.rows.forEach((cellRow: Cell[]) => {
                cellRow.forEach((cell: Cell) => {
                    cell.values.forEach((cellValue: CellValue) => {
                        if (cellValue instanceof AttributeCellValue) {
                            const attributeCellValue = cellValue as AttributeCellValue;
                            this._orderedCellValue[attributeCellValue.propertyName] = attributeCellValue;
                        }
                    });
                });
            });
        }
        return this._orderedCellValue;
    }
}
