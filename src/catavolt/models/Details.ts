import {Cell} from "./Cell";
import {View} from "./View";

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

}
