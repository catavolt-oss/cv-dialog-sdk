import {DataAnnotation} from "./DataAnnotation";
import {Record} from "./Record";
import {Property} from "./Property";
import {RecordImpl} from "./RecordImpl";
import {ArrayUtil} from "../util";
import {NullRecord} from "./NullRecord";

/**
 * An {@link Record} that manages two copies internally, a before and after, for 'undo' and comparison purposes.
 * An Record Represents a 'Record' or set of {@link Property} (names and values).
 * An Record may also have {@link Annotation}s (style annotations) that apply to the whole 'record'
 */
export class RecordBuffer implements Record {

    public static createRecordBuffer(id: string, before: Property[], after: Property[], annotations: DataAnnotation[], type: string): RecordBuffer {
        return new RecordBuffer(RecordUtil.newRecord(id, before, annotations, type), RecordUtil.newRecord(id, after, annotations, type));
    }

    constructor(private _before: Record, private _after?: Record) {
        if (!_before) {
            throw new Error("_before is null in RecordBuffer");
        }
        if (!_after) {
            this._after = _before;
        }
    }

    get after(): Record {
        return this._after;
    }

    get annotations(): DataAnnotation[] {
        return this._after.annotations;
    }

    public annotationsAtName(propName: string): DataAnnotation[] {
        return this._after.annotationsAtName(propName);
    }

    public afterEffects(afterAnother?: Record): Record {
        if (afterAnother) {
            return this._after.afterEffects(afterAnother);
        } else {
            return this._before.afterEffects(this._after);
        }
    }

    get backgroundColor(): string {
        return this._after.backgroundColor;
    }

    public backgroundColorFor(propName: string): string {
        return this._after.backgroundColorFor(propName);
    }

    get before(): Record {
        return this._before;
    }

    get foregroundColor(): string {
        return this._after.foregroundColor;
    }

    public foregroundColorFor(propName: string): string {
        return this._after.foregroundColorFor(propName);
    }

    get imageName(): string {
        return this._after.imageName;
    }

    public imageNameFor(propName: string): string {
        return this._after.imageNameFor(propName);
    }

    get imagePlacement(): string {
        return this._after.imagePlacement;
    }

    public imagePlacementFor(propName: string): string {
        return this._after.imagePlacement;
    }

    get isBoldText(): boolean {
        return this._after.isBoldText;
    }

    public isBoldTextFor(propName: string): boolean {
        return this._after.isBoldTextFor(propName);
    }

    public isChanged(name: string): boolean {
        const before = this._before.propAtName(name);
        const after = this._after.propAtName(name);
        return (before && after) ? !before.equals(after) : !(!before && !after);
    }

    get isItalicText(): boolean {
        return this._after.isItalicText;
    }

    public isItalicTextFor(propName: string): boolean {
        return this._after.isItalicTextFor(propName);
    }

    get isPlacementCenter(): boolean {
        return this._after.isPlacementCenter;
    }

    public isPlacementCenterFor(propName: string): boolean {
        return this._after.isPlacementCenterFor(propName);
    }

    get isPlacementLeft(): boolean {
        return this._after.isPlacementLeft;
    }

    public isPlacementLeftFor(propName: string): boolean {
        return this._after.isPlacementLeftFor(propName);
    }

    get isPlacementRight(): boolean {
        return this._after.isPlacementRight;
    }

    public isPlacementRightFor(propName: string): boolean {
        return this._after.isPlacementRightFor(propName);
    }

    get isPlacementStretchUnder(): boolean {
        return this._after.isPlacementStretchUnder;
    }

    public isPlacementStretchUnderFor(propName: string): boolean {
        return this._after.isPlacementStretchUnderFor(propName);
    }

    get isPlacementUnder(): boolean {
        return this._after.isPlacementUnder;
    }

    public isPlacementUnderFor(propName: string): boolean {
        return this._after.isPlacementUnderFor(propName);
    }

    get isUnderline(): boolean {
        return this._after.isUnderline;
    }

    public isUnderlineFor(propName: string): boolean {
        return this._after.isUnderlineFor(propName);
    }

    get id(): string {
        return this._after.id;
    }

    get overrideText(): string {
        return this._after.overrideText;
    }

    public overrideTextFor(propName: string): string {
        return this._after.overrideTextFor(propName);
    }

    public propAtIndex(index: number): Property {
        return this.properties[index];
    }

    public propAtName(propName: string): Property {
        return this._after.propAtName(propName);
    }

    get propCount(): number {
        return this._after.propCount;
    }

    get propNames(): string[] {
        return this._after.propNames;
    }

    get properties(): Property[] {
        return this._after.properties;
    }

    get propValues(): any[] {
        return this._after.propValues;
    }

    get type(): string {
        return this._after.type;
    }

    public setValue(name: string, value) {
        const newProps = [];
        let found = false;
        this.properties.forEach((prop: Property) => {
            if (prop.name === name) {
                newProps.push(new Property(name, value, prop.propertyType, prop.format, prop.annotations));
                found = true;
            } else {
                newProps.push(prop);
            }
        });
        if (!found) {
            newProps.push(new Property(name, value));
        }
        this._after = RecordUtil.newRecord(this.id, newProps, this.annotations, this.type);
    }

    get tipText(): string {
        return this._after.tipText;
    }

    public tipTextFor(propName: string): string {
        return this._after.tipTextFor(propName);
    }

    public toRecord(): Record {
        return RecordUtil.newRecord(this.id, this.properties, this.annotations, this.type);
    }

    public toJSON() {
        return this.afterEffects().toJSON();
    }

    public valueAtName(propName: string): any {
        return this._after.valueAtName(propName);
    }

}

/**
 * Utility for working with Records
 */
class RecordUtil {

    public static newRecord(id: string, properties: Property[], annotations: DataAnnotation[], type: string): Record {
        return annotations ? new RecordImpl(id, ArrayUtil.copy(properties), ArrayUtil.copy(annotations), type) :
            new RecordImpl(id, ArrayUtil.copy(properties), null, type);
    }

    public static isRecord(o: any): boolean {

        return (o instanceof RecordImpl)
            || (o instanceof RecordBuffer)
            || (o instanceof NullRecord);
    }

    /*
     static union(l1:Array<Property>, l2:Array<Property>):Array<Property> {
     var result:Array<Property> = ArrayUtil.copy(l1);
     l2.forEach((p2:Property)=> {
     if (!l1.some((p1:Property, i)=> {
     if (p1.name === p2.name) {
     result[i] = p2;
     return true;
     }
     return false;
     })) {
     result.push(p2);
     }
     });
     return result;
     }*/
}

