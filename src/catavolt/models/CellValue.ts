export abstract class CellValue {
    public static STYLE_HEADING1 = 'textHeading1';
    public static STYLE_HEADING2 = 'textHeading2';
    public static STYLE_HEADING3 = 'textHeading3';
    public static STYLE_HEADING4 = 'textHeading4';
    public static STYLE_INLINE_MEDIA = 'inlineMedia';
    public static STYLE_INLINE_MEDIA2 = 'Image/Video';

    public readonly type: string;

    constructor(readonly style: string) {}

    get isHeading1Style(): boolean {
        return this.style && this.style === CellValue.STYLE_HEADING1;
    }

    get isHeading2Style(): boolean {
        return this.style && this.style === CellValue.STYLE_HEADING2;
    }

    get isHeading3Style(): boolean {
        return this.style && this.style === CellValue.STYLE_HEADING3;
    }

    get isHeading4Style(): boolean {
        return this.style && this.style === CellValue.STYLE_HEADING4;
    }

    get isInlineMediaStyle(): boolean {
        return (
            this.style && (this.style === CellValue.STYLE_INLINE_MEDIA || this.style === CellValue.STYLE_INLINE_MEDIA2)
        );
    }
}
