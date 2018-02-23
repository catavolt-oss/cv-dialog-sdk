import {Annotation} from "./Annotation";
import {ArrayUtil} from "../util/ArrayUtil";

export class DataAnnotation implements Annotation {

    private static BOLD_TEXT = "BOLD_TEXT";
    private static BACKGROUND_COLOR = "BGND_COLOR";
    private static FOREGROUND_COLOR = "FGND_COLOR";
    private static IMAGE_NAME = "IMAGE_NAME";
    private static IMAGE_PLACEMENT = "IMAGE_PLACEMENT";
    private static ITALIC_TEXT = "ITALIC_TEXT";
    private static OVERRIDE_TEXT = "OVRD_TEXT";
    private static TIP_TEXT = "TIP_TEXT";
    private static UNDERLINE = "UNDERLINE";
    private static TRUE_VALUE = "1";
    private static PLACEMENT_CENTER = "CENTER";
    private static PLACEMENT_LEFT = "LEFT";
    private static PLACEMENT_RIGHT = "RIGHT";
    private static PLACEMENT_UNDER = "UNDER";
    private static PLACEMENT_STRETCH_UNDER = "STRETCH_UNDER";

    public static backgroundColor(annotations: DataAnnotation[]): string {
        const result: DataAnnotation = ArrayUtil.find(annotations, (anno) => {
            return anno.isBackgroundColor;
        });
        return result ? result.backgroundColor : null;
    }

    public static foregroundColor(annotations: DataAnnotation[]): string {
        const result: DataAnnotation = ArrayUtil.find(annotations, (anno) => {
            return anno.isForegroundColor;
        });
        return result ? result.foregroundColor : null;
    }

    public static imageName(annotations: DataAnnotation[]): string {
        const result: DataAnnotation = ArrayUtil.find(annotations, (anno) => {
            return anno.isImageName;
        });
        return result ? result.value : null;
    }

    public static imagePlacement(annotations: DataAnnotation[]): string {
        const result: DataAnnotation = ArrayUtil.find(annotations, (anno) => {
            return anno.isImagePlacement;
        });
        return result ? result.value : null;
    }

    public static isBoldText(annotations: DataAnnotation[]): boolean {
        return annotations.some((anno) => {
            return anno.isBoldText;
        });
    }

    public static isItalicText(annotations: DataAnnotation[]): boolean {
        return annotations.some((anno) => {
            return anno.isItalicText;
        });
    }

    public static isPlacementCenter(annotations: DataAnnotation[]): boolean {
        return annotations.some((anno) => {
            return anno.isPlacementCenter;
        });
    }

    public static isPlacementLeft(annotations: DataAnnotation[]): boolean {
        return annotations.some((anno) => {
            return anno.isPlacementLeft;
        });
    }

    public static isPlacementRight(annotations: DataAnnotation[]): boolean {
        return annotations.some((anno) => {
            return anno.isPlacementRight;
        });
    }

    public static isPlacementStretchUnder(annotations: DataAnnotation[]): boolean {
        return annotations.some((anno) => {
            return anno.isPlacementStretchUnder;
        });
    }

    public static isPlacementUnder(annotations: DataAnnotation[]): boolean {
        return annotations.some((anno) => {
            return anno.isPlacementUnder;
        });
    }

    public static isUnderlineText(annotations: DataAnnotation[]): boolean {
        return annotations.some((anno) => {
            return anno.isUnderlineText;
        });
    }

    public static overrideText(annotations: DataAnnotation[]): string {
        const result: DataAnnotation = ArrayUtil.find(annotations, (anno) => {
            return anno.isOverrideText;
        });
        return result ? result.value : null;
    }

    public static tipText(annotations: DataAnnotation[]): string {
        const result: DataAnnotation = ArrayUtil.find(annotations, (anno) => {
            return anno.isTipText;
        });
        return result ? result.value : null;
    }

    constructor(readonly name: string, readonly value: string, readonly type: string) {
    }

    get backgroundColor(): string {
        return this.isBackgroundColor ? this.value : null;
    }

    get foregroundColor(): string {
        return this.isForegroundColor ? this.value : null;
    }

    public equals(dataAnno: Annotation): boolean {
        return this.name === dataAnno.name;
    }

    get isBackgroundColor(): boolean {
        return this.name === DataAnnotation.BACKGROUND_COLOR;
    }

    get isBoldText(): boolean {
        return this.name === DataAnnotation.BOLD_TEXT && this.value === DataAnnotation.TRUE_VALUE;
    }

    get isForegroundColor(): boolean {
        return this.name === DataAnnotation.FOREGROUND_COLOR;
    }

    get isImageName(): boolean {
        return this.name === DataAnnotation.IMAGE_NAME;
    }

    get isImagePlacement(): boolean {
        return this.name === DataAnnotation.IMAGE_PLACEMENT;
    }

    get isItalicText(): boolean {
        return this.name === DataAnnotation.ITALIC_TEXT && this.value === DataAnnotation.TRUE_VALUE;
    }

    get isOverrideText(): boolean {
        return this.name === DataAnnotation.OVERRIDE_TEXT;
    }

    get isPlacementCenter(): boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_CENTER;
    }

    get isPlacementLeft(): boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_LEFT;
    }

    get isPlacementRight(): boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_RIGHT;
    }

    get isPlacementStretchUnder(): boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_STRETCH_UNDER;
    }

    get isPlacementUnder(): boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_UNDER;
    }

    get isTipText(): boolean {
        return this.name === DataAnnotation.TIP_TEXT;
    }

    get isUnderlineText(): boolean {
        return this.name === DataAnnotation.UNDERLINE && this.value === DataAnnotation.TRUE_VALUE;
    }

    public toJSON(): Annotation {
        return {name: this.name, value: this.value, type: this.type};
    }

}
