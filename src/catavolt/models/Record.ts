import {DataAnnotation} from "./DataAnnotation";
import {Property} from "./Property";

export interface Record {

    readonly annotations?: DataAnnotation[];
    readonly id: string;
    properties: Property[];
    type: string;

    backgroundColor: string;
    foregroundColor: string;
    imageName: string;
    imagePlacement: string;
    isBoldText: boolean;
    isItalicText: boolean;
    isPlacementCenter: boolean;
    isPlacementLeft: boolean;
    isPlacementRight: boolean;
    isPlacementStretchUnder: boolean;
    isPlacementUnder: boolean;
    isUnderline: boolean;
    overrideText: string;
    propCount: number;
    propNames: string[];
    propValues: any[];
    tipText: string;

    annotationsAtName(propName: string): DataAnnotation[];

    afterEffects(after: Record): Record;

    backgroundColorFor(propName: string): string;

    foregroundColorFor(propName: string): string;

    imageNameFor(propName: string): string;

    imagePlacementFor(propName: string): string;

    isBoldTextFor(propName: string): boolean;

    isItalicTextFor(propName: string): boolean;

    isPlacementCenterFor(propName: string): boolean;

    isPlacementLeftFor(propName: string): boolean;

    isPlacementRightFor(propName: string): boolean;

    isPlacementStretchUnderFor(propName: string): boolean;

    isPlacementUnderFor(propName: string): boolean;

    isUnderlineFor(propName: string): boolean;

    overrideTextFor(propName: string): string;

    propAtIndex(index: number): Property;

    propAtName(propName: string): Property;

    tipTextFor(propName: string): string;

    toJSON();

    valueAtName(propName: string): any;

}
