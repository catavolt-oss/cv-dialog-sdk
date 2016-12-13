export declare abstract class Spec {
    protected nodeChildDict: Object;
    constructor(node: Node);
}
export declare abstract class Component extends Spec {
    private _backgroundColor;
    private _binding;
    private _id;
    private _layout;
    private _padding;
    private _actualHeights;
    private _actualWidths;
    private _actualX;
    private _actualY;
    private _height;
    private _width;
    private _x;
    private _y;
    constructor(node: Node);
    backgroundColor: Color;
    binding: Binding;
    id: string;
    layout: Layout;
    padding: Edges;
    actualHeights: Array<number>;
    actualWidths: Array<number>;
    actualX: number;
    actualY: number;
    height: number;
    width: number;
    x: number;
    y: number;
}
export declare abstract class Container extends Component {
    private _children;
    constructor(node: Node);
    children: Array<Component>;
}
export declare abstract class Property extends Spec {
    constructor(node: Node);
}
/**
 * *********************************
 */
export declare enum AspectMode {
    None = 0,
    Fit = 1,
    Fill = 2,
}
export declare enum BindingType {
    Data = 0,
    Meta = 1,
}
export declare enum FormMode {
    Display = 0,
    Edit = 1,
}
export declare enum ResizeMode {
    Stretch = 0,
    Tile = 1,
}
export declare enum RichNumUsage {
    Undefined = 0,
    Absolute = 1,
    FillParent = 2,
    HorizontalCenter = 3,
    HorizontalLeft = 4,
    HorizontalRight = 5,
    PercentOfParent = 6,
    Remainder = 7,
    VerticalBottom = 8,
    VerticalCenter = 9,
    VerticalTop = 10,
}
export declare enum TextAlignment {
    Left = 0,
    Center = 1,
    Right = 2,
}
export declare enum ValuePlacement {
    absolute = 0,
    none = 1,
}
export declare enum ValueType {
    Undefined = 0,
    Boolean = 1,
    Date = 2,
    DateTime = 3,
    Decimal = 4,
    Float = 5,
    Integer = 6,
    LargeBinary = 7,
    LargeString = 8,
    String = 9,
    Time = 10,
}
export declare class Binding extends Property {
    private _path;
    private _type;
    constructor(node: Node);
    path: string;
    type: BindingType;
}
export declare class Button extends Component {
    private _aspectMode;
    private _capInsets;
    private _resizeMode;
    private _URLString;
    private _enabledInReadMode;
    constructor(node: Node);
    aspectMode: AspectMode;
    capInsets: Edges;
    resizeMode: ResizeMode;
    URLString: string;
    enableInReadMode: boolean;
}
export declare class CaptureBounds extends Property {
    private _height;
    _width: number;
    constructor(node: Node);
    height: number;
    width: number;
}
export declare class Cell extends Container {
    private _borderColor;
    private _borderWidths;
    constructor(node: Node);
    borderColor: Color;
    borderWidths: Edges;
}
export declare class Checkbox extends Component {
    private _checkedColor;
    private _entrySeq;
    private _lineColor;
    private _lineWidth;
    private _radioGroup;
    private _uncheckedColor;
    constructor(node: Node);
    checkedColor: Color;
    entrySeq: number;
    lineColor: Color;
    lineWidth: number;
    radioGroup: string;
    uncheckedColor: Color;
}
export declare class Color extends Spec {
    private _red;
    _green: number;
    _blue: number;
    _alpha: number;
    constructor(node: Node);
    alpha: number;
    red: number;
    green: number;
    blue: number;
}
export declare class DatePicker extends Component {
    private _entrySeq;
    private _bold;
    private _text;
    private _textAlignment;
    private _textColor;
    constructor(node: Node);
    entrySeq: number;
    bold: boolean;
    text: string;
    textAlignment: TextAlignment;
    textColor: Color;
}
export declare class Edges extends Spec {
    private _top;
    _left: number;
    _bottom: number;
    _right: number;
    constructor(node: Node, top?: number, left?: number, bottom?: number, right?: number);
    top: number;
    left: number;
    bottom: number;
    right: number;
}
export declare class Form extends Container {
    private _hideControlFraming;
    private _hideSaveCancelButtons;
    private _settings;
    constructor(node: Node);
    hideControlFraming: boolean;
    hideSaveCancelButtons: boolean;
    settings: Settings;
}
export declare class Grid extends Container {
}
export declare class Image extends Component {
    private _allowAnnotations;
    private _allowPicker;
    private _allowPickOptions;
    private _aspectMode;
    private _capInsets;
    private _resizeMode;
    private _urlString;
    private _captureBounds;
    constructor(node: Node);
    allowAnnotations: boolean;
    allowPicker: boolean;
    allowPickOptions: boolean;
    aspectMode: AspectMode;
    capInsets: Edges;
    resizeMode: ResizeMode;
    urlString: string;
    capatureBounds: CaptureBounds;
}
export declare class Label extends Component {
    private _bold;
    private _italic;
    private _underline;
    private _numberOfLines;
    private _text;
    private _textAlignment;
    private _textColor;
    constructor(node: Node);
    bold: boolean;
    italic: boolean;
    underline: boolean;
    numberOfLines: number;
    text: string;
    textAlignment: TextAlignment;
    textColor: Color;
}
export declare class Layout extends Spec {
    private _uom;
    private _heights;
    private _widths;
    private _x;
    private _y;
    private _column;
    private _row;
    constructor(node: Node);
    uom: string;
    heights: number[];
    widths: number[];
    x: number;
    y: number;
    column: number;
    row: number;
}
export declare class Page extends Container {
}
export declare class Settings extends Spec {
    private _refreshTimer;
    constructor(node: Node);
    refreshTimer: number;
}
export declare class SignatureCapture extends Component {
    private _captureBounds;
    private _lineColor;
    constructor(node: Node);
    captureBounds: CaptureBounds;
    lineColor: Color;
}
export declare class TextArea extends Component {
    private _entrySeq;
    private _bold;
    private _italic;
    private _underline;
    private _numberOfLines;
    private _text;
    private _textColor;
    constructor(node: Node);
    entrySeq: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    numberOfLines: number;
    text: string;
    textColor: Color;
}
export declare class TextField extends Component {
    private _entrySeq;
    private _bold;
    private _italic;
    private _underline;
    private _numberOfLines;
    private _text;
    private _textAlignment;
    private _textColor;
    constructor(node: Node);
    entrySeq: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    numberOfLines: number;
    text: string;
    textAlignment: TextAlignment;
    textColor: Color;
}
export declare class TimePicker extends Component {
    private _entrySeq;
    private _bold;
    private _text;
    private _textAlignment;
    private _textColor;
    constructor(node: Node);
    entrySeq: number;
    bold: boolean;
    text: string;
    textAlignment: TextAlignment;
    textColor: Color;
}
export declare class ValuePicker extends Component {
    private _entrySeq;
    private _bold;
    private _numberOfLines;
    private _text;
    private _textAlignment;
    private _textColor;
    constructor(node: Node);
    entrySeq: number;
    bold: boolean;
    numberOfLines: number;
    text: string;
    textAlignment: TextAlignment;
    textColor: Color;
}
