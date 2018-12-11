import { Column } from './Column';
import { Filter } from './Filter';
import { Record } from './Record';
import { Sort } from './Sort';
import { View } from './View';

/**
 * Columns, filter and sorts for a UI list component.
 */
export class List extends View {
    public readonly style: string;
    public readonly columnStyle: string;
    public readonly gmlMarkup: string;
    public readonly fixedColumnCount: number;
    public readonly columns: Column[];
    public readonly filter: Filter[];
    public readonly sort: Sort[];

    public getColumnAt(propName:string): Column {
        if(this.columns) {
            return this.columns.find((column) => {
                return propName === column.propertyName;
            });
        }
        return null;
    }

    get isDefaultStyle(): boolean {
        return this.style && this.style === 'DEFAULT';
    }

    get isDetailsFormStyle(): boolean {
        return this.style && this.style === 'DETAILS_FORM';
    }

    get isFormStyle(): boolean {
        return this.style && this.style === 'FORM';
    }

    get isTabularStyle(): boolean {
        return this.style && this.style === 'TABULAR';
    }

    get columnHeadings(): string[] {
        return this.columns.map((c: Column) => {
            return c.heading;
        });
    }

    public rowValues(record: Record): any[] {
        return this.columns.map((c: Column) => {
            return record.valueAtName(c.propertyName);
        });
    }
}
