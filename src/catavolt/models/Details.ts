import {StringDictionary} from "../util";
import { AttributeCellValue } from "./AttributeCellValue";
import { Cell } from './Cell';
import { CellValue } from './CellValue';
import {LabelCellValue} from "./LabelCellValue";
import { View } from './View';

/**
 * A abstract definition for small visual area populated with labels and values. Labels are typically presented as simple text phrases.
 * Values are usually presented inside a UI component, such as a TextField or ComboBox.
 */
export class Details extends View {
    public readonly cancelButtonText: string;
    public readonly commitButtonText: string;
    public readonly editable: boolean;
    public readonly focusPropertyName: string;
    public readonly gmlMarkup: string;
    public readonly rows: Cell[][];

    private attributeCellMap:StringDictionary;
    private propertyLabelMap:StringDictionary;
    private constantsArray:string[];

    public findCellValue(matcher:(cellValue:CellValue) => CellValue) {
        return this.findCellValueForRow((row:Cell[]) => {
            let cellValue = null;
            row.some((cell:Cell) => {
                return cell.values.some((value:CellValue) => {
                    cellValue = matcher(value);
                    return !!cellValue;
                });
            });
            return cellValue;
        });
    }

    /**
     * @param matcher - a function that given a row of cells, returns a matching CellValue (or null)
     */
    public findCellValueForRow(matcher:(row:Cell[]) => CellValue):CellValue {
        let cellValue:CellValue = null;
        this.rows.some(row => {
            cellValue = matcher(row);
            return !!cellValue;
        });
        return cellValue;
    }

    public getAttributeCellValue(propertyName:string):AttributeCellValue {
        return this.attributeCellsByPropName[propertyName];
    }
    /**
     * 1-based index
     * @param number
     */
    public getConstantByIndex(index:number):string {
        return this.constants.length >= index ? this.constants[index - 1] : null;
    }

    public getLabelForProperty(propertyName:string):LabelCellValue {
        return this.labelsByPropName[propertyName];
    }

    public get constants():string[] {
        if(!this.constantsArray) {
            this.initIndexes();
        }
        return this.constantsArray;
    }

    public get attributeCells():AttributeCellValue[] {
        return Object.keys(this.attributeCellsByPropName).map(key => this.attributeCellsByPropName[key]);
    }

    public get attributeCellsByPropName():StringDictionary {
        if(!this.attributeCellMap) {
            this.initIndexes();
        }
        return this.attributeCellMap;
    }

    public get labelsByPropName():StringDictionary {
        if(!this.propertyLabelMap) {
            this.initIndexes();
        }
        return this.propertyLabelMap;
    }

    private initIndexes() {
        this.attributeCellMap = {};
        this.propertyLabelMap = {};
        this.constantsArray = [];

        this.rows.forEach((row:Cell[]) => {
            const [ firstCell, secondCell ] = row;
            if (firstCell && firstCell.values) {
                const [labelCellValue] = firstCell.values;
                if(labelCellValue instanceof LabelCellValue) {
                    if(secondCell && secondCell.values) {
                        const [ cellValue ] = secondCell.values;
                        if(cellValue instanceof AttributeCellValue) {
                            this.propertyLabelMap[cellValue.propertyName] = labelCellValue;
                        } else if(cellValue instanceof LabelCellValue){
                            if(!cellValue.value) {
                                this.constantsArray.push(labelCellValue.value);
                            }
                        }
                    } else {
                        this.constantsArray.push(labelCellValue.value);
                    }
                }
            }
            row.forEach((cell:Cell) => {
                cell.values.forEach((cellValue:CellValue) => {
                    if(cellValue instanceof AttributeCellValue) {
                        this.attributeCellMap[cellValue.propertyName] = cellValue;
                    }
                });
            });
        });
    }

}
