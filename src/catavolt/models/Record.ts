import {DataAnnotation} from "./DataAnnotation";
import {Property} from "./Property";

export interface Record {

    readonly annotations?: DataAnnotation[];
    readonly id: string;
    properties: Property[];
    type: string;

    annotationsAtName(propName: string): DataAnnotation[];

    afterEffects(after: Record): Record;

    backgroundColor: string;

    backgroundColorFor(propName: string): string;

    foregroundColor: string;

    foregroundColorFor(propName: string): string;

    imageName: string;

    imageNameFor(propName: string): string;

    imagePlacement: string;

    imagePlacementFor(propName: string): string;

    isBoldText: boolean;

    isBoldTextFor(propName: string): boolean;

    isItalicText: boolean;

    isItalicTextFor(propName: string): boolean;

    isPlacementCenter: boolean;

    isPlacementCenterFor(propName: string): boolean;

    isPlacementLeft: boolean;

    isPlacementLeftFor(propName: string): boolean;

    isPlacementRight: boolean;

    isPlacementRightFor(propName: string): boolean;

    isPlacementStretchUnder: boolean;

    isPlacementStretchUnderFor(propName: string): boolean;

    isPlacementUnder: boolean;

    isPlacementUnderFor(propName: string): boolean;

    isUnderline: boolean;

    isUnderlineFor(propName: string): boolean;

    overrideText: string;

    overrideTextFor(propName: string): string;

    propAtIndex(index: number): Property;

    propAtName(propName: string): Property;

    propCount: number;

    propNames: string[];

    propValues: any[];

    tipText: string;

    tipTextFor(propName: string): string;

    toJSON();

    valueAtName(propName: string): any;

}
