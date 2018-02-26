import { DataAnnotation } from './DataAnnotation';
import { Property } from './Property';
import { Record } from './Record';
import { TypeNames } from './types';

/**
 * An empty or uninitialized {@link Record}.
 * Represents a 'Record' or set of {@link Property} (names and values).
 * An Record may also have {@link Annotation}s (style annotations) that apply to the whole 'record'
 */
export class NullRecord implements Record {
    public static singleton: NullRecord = new NullRecord();

    get annotations(): DataAnnotation[] {
        return [];
    }

    public annotationsAtName(propName: string): DataAnnotation[] {
        return [];
    }

    public afterEffects(after: Record): Record {
        return after;
    }

    get backgroundColor(): string {
        return null;
    }

    public backgroundColorFor(propName: string): string {
        return null;
    }

    get foregroundColor(): string {
        return null;
    }

    public foregroundColorFor(propName: string): string {
        return null;
    }

    get id(): string {
        return null;
    }

    get imageName(): string {
        return null;
    }

    public imageNameFor(propName: string): string {
        return null;
    }

    get imagePlacement(): string {
        return null;
    }

    public imagePlacementFor(propName: string): string {
        return null;
    }

    get isBoldText(): boolean {
        return false;
    }

    public isBoldTextFor(propName: string): boolean {
        return false;
    }

    get isItalicText(): boolean {
        return false;
    }

    public isItalicTextFor(propName: string): boolean {
        return false;
    }

    get isPlacementCenter(): boolean {
        return false;
    }

    public isPlacementCenterFor(propName: string): boolean {
        return false;
    }

    get isPlacementLeft(): boolean {
        return false;
    }

    public isPlacementLeftFor(propName: string): boolean {
        return false;
    }

    get isPlacementRight(): boolean {
        return false;
    }

    public isPlacementRightFor(propName: string): boolean {
        return false;
    }

    get isPlacementStretchUnder(): boolean {
        return false;
    }

    public isPlacementStretchUnderFor(propName: string): boolean {
        return false;
    }

    get isPlacementUnder(): boolean {
        return false;
    }

    public isPlacementUnderFor(propName: string): boolean {
        return false;
    }

    get isUnderline(): boolean {
        return false;
    }

    public isUnderlineFor(propName: string): boolean {
        return false;
    }

    get objectId(): string {
        return null;
    }

    get overrideText(): string {
        return null;
    }

    public overrideTextFor(propName: string): string {
        return null;
    }

    public propAtIndex(index: number): Property {
        return null;
    }

    public propAtName(propName: string): Property {
        return null;
    }

    get propCount(): number {
        return 0;
    }

    get propNames(): string[] {
        return [];
    }

    get properties(): Property[] {
        return [];
    }

    get propValues(): any[] {
        return [];
    }

    get tipText(): string {
        return null;
    }

    get type(): string {
        return null;
    }

    public tipTextFor(propName: string): string {
        return null;
    }

    public toRecord(): Record {
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            properties: this.properties,
            type: TypeNames.RecordTypeName
        };
    }

    public valueAtName(propName: string): any {
        return null;
    }
}
