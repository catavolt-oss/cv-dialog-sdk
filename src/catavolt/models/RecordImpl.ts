import { DataAnnotation } from './DataAnnotation';
import { Property } from './Property';
import { Record } from './Record';
import { TypeNames } from './types';

/**
 * The implementation of {@link Record}.
 * Represents a 'Record' or set of {@link Property} (names and values).
 * An Record may also have {@link Annotation}s (style annotations) that apply to the whole 'record'
 */
export class RecordImpl implements Record {
    constructor(
        readonly id: string,
        readonly properties: Property[] = [],
        readonly annotations: DataAnnotation[] = [],
        readonly type: string
    ) {}

    public annotationsAtName(propName: string): DataAnnotation[] {
        const p = this.propAtName(propName);
        return p ? p.annotations : [];
    }

    public afterEffects(after: Record): Record {
        const effects = [];
        after.properties.forEach(afterProp => {
            const beforeProp = this.propAtName(afterProp.name);
            if (!afterProp.equals(beforeProp)) {
                effects.push(afterProp);
            }
        });
        return new RecordImpl(after.id, effects, after.annotations, after.type);
    }

    get backgroundColor(): string {
        return DataAnnotation.backgroundColor(this.annotations);
    }

    public backgroundColorFor(propName: string): string {
        const p = this.propAtName(propName);
        return p && p.backgroundColor ? p.backgroundColor : this.backgroundColor;
    }

    get foregroundColor(): string {
        return DataAnnotation.foregroundColor(this.annotations);
    }

    public foregroundColorFor(propName: string): string {
        const p = this.propAtName(propName);
        return p && p.foregroundColor ? p.foregroundColor : this.foregroundColor;
    }

    get imageName(): string {
        return DataAnnotation.imageName(this.annotations);
    }

    public imageNameFor(propName: string): string {
        const p = this.propAtName(propName);
        return p && p.imageName ? p.imageName : this.imageName;
    }

    get imagePlacement(): string {
        return DataAnnotation.imagePlacement(this.annotations);
    }

    public imagePlacementFor(propName: string): string {
        const p = this.propAtName(propName);
        return p && p.imagePlacement ? p.imagePlacement : this.imagePlacement;
    }

    get isBoldText(): boolean {
        return DataAnnotation.isBoldText(this.annotations);
    }

    public isBoldTextFor(propName: string): boolean {
        const p = this.propAtName(propName);
        return p && p.isBoldText ? p.isBoldText : this.isBoldText;
    }

    get isItalicText(): boolean {
        return DataAnnotation.isItalicText(this.annotations);
    }

    public isItalicTextFor(propName: string): boolean {
        const p = this.propAtName(propName);
        return p && p.isItalicText ? p.isItalicText : this.isItalicText;
    }

    get isPlacementCenter(): boolean {
        return DataAnnotation.isPlacementCenter(this.annotations);
    }

    public isPlacementCenterFor(propName: string): boolean {
        const p = this.propAtName(propName);
        return p && p.isPlacementCenter ? p.isPlacementCenter : this.isPlacementCenter;
    }

    get isPlacementLeft(): boolean {
        return DataAnnotation.isPlacementLeft(this.annotations);
    }

    public isPlacementLeftFor(propName: string): boolean {
        const p = this.propAtName(propName);
        return p && p.isPlacementLeft ? p.isPlacementLeft : this.isPlacementLeft;
    }

    get isPlacementRight(): boolean {
        return DataAnnotation.isPlacementRight(this.annotations);
    }

    public isPlacementRightFor(propName: string): boolean {
        const p = this.propAtName(propName);
        return p && p.isPlacementRight ? p.isPlacementRight : this.isPlacementRight;
    }

    get isPlacementStretchUnder(): boolean {
        return DataAnnotation.isPlacementStretchUnder(this.annotations);
    }

    public isPlacementStretchUnderFor(propName: string): boolean {
        const p = this.propAtName(propName);
        return p && p.isPlacementStretchUnder
            ? p.isPlacementStretchUnder
            : this.isPlacementStretchUnder;
    }

    get isPlacementUnder(): boolean {
        return DataAnnotation.isPlacementUnder(this.annotations);
    }

    public isPlacementUnderFor(propName: string): boolean {
        const p = this.propAtName(propName);
        return p && p.isPlacementUnder ? p.isPlacementUnder : this.isPlacementUnder;
    }

    get isUnderline(): boolean {
        return DataAnnotation.isUnderlineText(this.annotations);
    }

    public isUnderlineFor(propName: string): boolean {
        const p = this.propAtName(propName);
        return p && p.isUnderline ? p.isUnderline : this.isUnderline;
    }

    get overrideText(): string {
        return DataAnnotation.overrideText(this.annotations);
    }

    public overrideTextFor(propName: string): string {
        const p = this.propAtName(propName);
        return p && p.overrideText ? p.overrideText : this.overrideText;
    }

    public propAtIndex(index: number): Property {
        return this.properties[index];
    }

    public propAtName(propName: string): Property {
        let prop: Property = null;
        this.properties.some(p => {
            if (p.name === propName) {
                prop = p;
                return true;
            }
            return false;
        });
        return prop;
    }

    get propCount(): number {
        return this.properties.length;
    }

    get propNames(): string[] {
        return this.properties.map(p => {
            return p.name;
        });
    }

    get propValues(): any[] {
        return this.properties.map(p => {
            return p.value;
        });
    }

    get tipText(): string {
        return DataAnnotation.tipText(this.annotations);
    }

    public tipTextFor(propName: string): string {
        const p = this.propAtName(propName);
        return p && p.tipText ? p.tipText : this.tipText;
    }

    public toJSON() {
        return {
            id: this.id,
            properties: this.properties,
            type: TypeNames.RecordTypeName
        };
    }

    public toRecord(): Record {
        return this;
    }

    public valueAtName(propName: string): any {
        let value = null;
        this.properties.some(p => {
            if (p.name === propName) {
                value = p.value;
                return true;
            }
            return false;
        });
        return value;
    }
}
