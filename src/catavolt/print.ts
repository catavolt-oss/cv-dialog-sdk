
import {
    StringDictionary,
    TimeValue,
    DateValue,
    DateTimeValue,
    Log,
    ObjUtil,
    StringUtil,
    ArrayUtil,
    DataUrl
} from "./util";
import {Try, Either, Future, Success, Failure, TryClosure, MapFn} from "./fp";
import {SessionContext, SystemContext, Call, Get} from "./ws";
import * as moment from 'moment';

/*
 IMPORTANT!
 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */

// Skipped in initial port: BarChart, BarcodeScanner, BarOrientation,
//                          DatePicker, Defaults, GaugeChart

const XML_CELL = "Cell";
const XML_FORM = "Form";
const XML_GRID = "Grid";
const XML_PAGE = "Page";

const XML_BUTTON = "Button";
const XML_CHECKBOX = "CheckBox";
const XML_IMAGE = "Image";
const XML_LABEL = "Label";
const XML_SIGNATURE_CAPTURE = "SignatureCapture";
const XML_TEXT_AREA = "TextArea";
const XML_TEXT_FIELD = "TextField";
const XML_TIME_PICKER = "TimePicker";
const XML_VALUE_PICKER = "ValuePicker";

const XML_CHILDREN = "Children";

const XML_ALLOW_ANNOTATIONS = "AllowAnnotations";
const XML_ALLOW_PICKER = "AllowPicker";
const XML_ALLOW_PICK_OPTIONS = "AllowPickOptions";
const XML_ALPHA = "Alpha";
const XML_ASPECT_MODE = "AspectMode";
const XML_BACKGROUND_COLOR = "BackgroundColor";
const XML_BINDING = "Binding";
const XML_BLUE = "Blue";
const XML_BOLD = "Bold";
const XML_BORDER_COLOR = "BorderColor";
const XML_BORDER_WIDTHS = "BorderWidths";
const XML_BOTTOM = "Bottom";
const XML_CAP_INSETS = "CapInsets";
const XML_CAPTURE_BOUNDS = "CaptureBounds";
const XML_CHECKED_COLOR = "CheckedColor";
const XML_COLUMN = "Column";
const XML_ENABLED_IN_READ_MODE = "EnabledInReadMode";
const XML_ENTRY_SEQ = "EntrySeq";
const XML_GREEN = "Green";
const XML_HEIGHT = "Height";
const XML_ID = "Id";
const XML_ITALIC = "Italic";
const XML_LAYOUT = "Layout";
const XML_LEFT = "Left";
const XML_LINE_COLOR = "LineColor";
const XML_LINE_WIDTH = "LineWidth";
const XML_NUMBER_OF_LINES = "NumberOfLines";
const XML_ORIGIN = "Origin";
const XML_PADDING = "Padding";
const XML_RADIO_GROUP = "RadioGroup";
const XML_RED = "Red";
const XML_REFRESH_TIMER = "RefreshTimer";
const XML_RESIZE_MODE = "ResizeMode";
const XML_RIGHT = "Right";
const XML_ROW = "Row";
const XML_SIZE = "Size";
const XML_TEXT = "Text";
const XML_TEXT_ALIGNMENT = "TextAlignment";
const XML_TEXT_COLOR = "TextColor";
const XML_TOP = "Top";
const XML_UNCHECKED_COLOR = "UncheckedColor";
const XML_UNDERLINE = "Underline";
const XML_UOM = "UOM";
const XML_URL = "URL";
const XML_WIDTH = "Width";
const XML_X = "X";
const XML_Y = "Y";





/**
 * *********************************
 */
var GenID=1;  //  Generate a unique number if need be for IDs

export abstract class Spec {
    protected nodeChildDict:Object = {};
    constructor(node:Node) {
        PrintUtil.forEachChildNode(node, (n:Node)=>{
            this.nodeChildDict[n.nodeName] = n;
        })
    }
}

export abstract class Component extends Spec {
    private _backgroundColor:Color;
    private _binding:Binding;
    private _id:string;
    private _layout:Layout;
    private _padding:Edges;

    // PRIVATE MUTABLE FIELDS
    private _actualHeights:Array<number>;
    private _actualWidths:Array<number>;
    private _actualX:number;
    private _actualY:number;
    private _height:number;
    // private _parent:Container;
    private _width:number;
    private _x:number;
    private _y:number;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BACKGROUND_COLOR], (n:Node)=>{ this._backgroundColor = new Color(n) });
        PrintUtil.ifChild(this.nodeChildDict[XML_BINDING], (n:Node)=>{ this._binding = new Binding(n) });
        PrintUtil.ifChild(this.nodeChildDict[XML_ID], (n:Node)=>{ this._id = PrintUtil.singleChildText(n) });
        PrintUtil.ifChild(this.nodeChildDict[XML_LAYOUT], (n:Node)=>{ this._layout = new Layout(n) });
        PrintUtil.ifChild(this.nodeChildDict[XML_PADDING], (n:Node)=>{ this._padding = new Edges(n) });
        if (!this.id) {
            this._id="GenID-" + GenID++;
        }
    }

    public get backgroundColor():Color { return this._backgroundColor }
    public get binding():Binding { return this._binding }
    public get id():string { return this._id }
    public get layout():Layout { return this._layout }
    public get padding():Edges { return this._padding}
    public get actualHeights():Array<number> { return this._actualHeights }
    public get actualWidths():Array<number> { return this._actualWidths }
    public get actualX():number { return this._actualX }
    public get actualY():number { return this._actualY }
    public get height():number { return this._height }
    public get width():number { return this._width }
    public get x():number { return this._x }
    public get y():number { return this._y }
}

export abstract class Container extends Component {
    private _children:Array<Component> = new Array();
    constructor(node:Node) {
        super(node);
        if (this.nodeChildDict[XML_CHILDREN]) {
            PrintUtil.forEachChildNode(this.nodeChildDict[XML_CHILDREN], (n: Node)=> {
                let c: Component = ComponentFactory.fromNode(n);
                if (c) {
                    this._children.push(c);
                }
            });
        }
    }
    public get children():Array<Component> { return this._children };
}

export abstract class Property extends Spec {
    constructor(node:Node) {
        super(node);
    }
};

/**
 * *********************************
 */

export enum AspectMode { None, Fit, Fill };
export enum BindingType { Data, Meta }
export enum FormMode { Display, Edit };
export enum ResizeMode { Stretch, Tile };
export enum RichNumUsage { Undefined, Absolute, FillParent, HorizontalCenter, HorizontalLeft, HorizontalRight,
    PercentOfParent, Remainder, VerticalBottom, VerticalCenter, VerticalTop }
export enum TextAlignment { Left, Center, Right }
export enum ValuePlacement { absolute, none }
export enum ValueType { Undefined, Boolean, Date, DateTime, Decimal, Float, Integer, LargeBinary,
    LargeString, String, Time }

export class Binding extends Property {
    private _path:string;
    private _type:BindingType = BindingType.Data;
    constructor(node:Node){
        super(node);
        this._path = PrintUtil.singleChildText(node);
    };
    public get path():string { return this._path }
    public get type():BindingType { return this._type }

}

export class Button extends Component {
    private _aspectMode:AspectMode;
    private _capInsets:Edges;
    private _resizeMode:ResizeMode;
    private _URLString:string ;
    private _enabledInReadMode:boolean ;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ASPECT_MODE], (n:Node)=>{ this._aspectMode = PrintUtil.enumValue(n, AspectMode) })
        PrintUtil.ifChild(this.nodeChildDict[XML_CAP_INSETS], (n:Node)=>{ this._capInsets = new Edges(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_RESIZE_MODE], (n:Node)=>{ this._resizeMode = PrintUtil.enumValue(n, ResizeMode) })
        PrintUtil.ifChild(this.nodeChildDict[XML_URL], (n:Node)=>{ this._URLString = PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ENABLED_IN_READ_MODE], (n:Node)=>{ this._enabledInReadMode = PrintUtil.singleChildBoolean(node)})
    }
    public get aspectMode():AspectMode { return this._aspectMode }
    public get capInsets():Edges { return this._capInsets }
    public get resizeMode():ResizeMode { return this._resizeMode }
    public get URLString():string { return this._URLString }
    public get enableInReadMode():boolean { return this._enabledInReadMode}
}

export class CaptureBounds extends Property {
    private _height:number; _width:number;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_HEIGHT], (n:Node)=>{ this._height = PrintUtil.singleChildNumber(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_WIDTH], (n:Node)=>{ this._width= PrintUtil.singleChildNumber(n) })
    }
    public get height():number { return this._height }
    public get width():number { return this._width }
}

export class Cell extends Container {
    private _borderColor:Color;
    private _borderWidths:Edges;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BORDER_COLOR], (n:Node)=>{ this._borderColor = new Color(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BORDER_WIDTHS], (n:Node)=>{ this._borderWidths = new Edges(n) })
    }
    public get borderColor():Color { return this._borderColor }
    public get borderWidths():Edges { return this._borderWidths }
}

export class Checkbox extends Component {
    private _checkedColor:Color;
    private _entrySeq:number;
    private _lineColor:Color;
    private _lineWidth:number;
    private _radioGroup:string;
    private _uncheckedColor:Color;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_CHECKED_COLOR], (n:Node)=>{ this._checkedColor = new Color(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_COLOR], (n:Node)=>{ this._lineColor = new Color(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_WIDTH], (n:Node)=>{ this._lineWidth = PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_RADIO_GROUP], (n:Node)=>{ this._radioGroup = PrintUtil.singleChildText(node)})
        PrintUtil.ifChild(this.nodeChildDict[XML_UNCHECKED_COLOR], (n:Node)=>{ this._uncheckedColor = new Color(node)})
    }
    public get checkedColor():Color { return this._checkedColor }
    public get entrySeq():number { return this._entrySeq }
    public get lineColor():Color { return this._lineColor }
    public get lineWidth():number { return this._lineWidth }
    public get radioGroup():string { return this._radioGroup }
    public get uncheckedColor():Color { return this._uncheckedColor }
}

export class Color extends Spec {
    private _red:number; _green:number; _blue:number; _alpha:number;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_RED], (n:Node)=>{ this._red = PrintUtil.singleChildNumber(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BLUE], (n:Node)=>{ this._blue = PrintUtil.singleChildNumber(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_GREEN], (n:Node)=>{ this._green = PrintUtil.singleChildNumber(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ALPHA], (n:Node)=>{ this._alpha = PrintUtil.singleChildNumber(n) })
    }
    public get alpha():number { return this._alpha }
    public get red():number { return this._red }
    public get green():number { return this._green }
    public get blue():number { return this._blue }
}

export class DatePicker extends Component {
    private _entrySeq:number;
    private _bold:boolean;
    private _text:string;
    private _textAlignment:TextAlignment;
    private _textColor:Color;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], (n:Node)=>{ this._bold=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], (n:Node)=>{ this._text=PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], (n:Node)=>{ this._textAlignment=PrintUtil.enumValue(node, TextAlignment) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], (n:Node)=>{ this._textColor=new Color(node) })
    }
    public get entrySeq():number { return this._entrySeq }
    public get bold():boolean { return this._bold }
    public get text():string { return this._text }
    public get textAlignment():TextAlignment { return this._textAlignment }
    public get textColor():Color { return this._textColor }
}

export class Edges extends Spec {
    private _top:number; _left:number; _bottom:number; _right:number;
    constructor(node:Node, top?:number, left?:number, bottom?:number, right?:number) {
        super(node);
        if (node) {
            PrintUtil.ifChild(this.nodeChildDict[XML_TOP], (n:Node)=>{ this._top = PrintUtil.singleChildNumber(n) })
            PrintUtil.ifChild(this.nodeChildDict[XML_LEFT], (n:Node)=>{ this._left = PrintUtil.singleChildNumber(n) })
            PrintUtil.ifChild(this.nodeChildDict[XML_BOTTOM], (n:Node)=>{ this._bottom = PrintUtil.singleChildNumber(n) })
            PrintUtil.ifChild(this.nodeChildDict[XML_RIGHT], (n:Node)=>{ this._right = PrintUtil.singleChildNumber(n) })
        } else {
            this._top = top;
            this._left = left;
            this._bottom = bottom;
            this._right = right;
        }
    }
    public get top():number { return this._top }
    public get left():number { return this._left }
    public get bottom():number { return this._bottom }
    public get right():number { return this._right }
}

export class Form extends Container {
    private _hideControlFraming:boolean;
    private _hideSaveCancelButtons:boolean;
    private _settings:Settings;
    constructor(node:Node) {
        super(node);
    }
    public get hideControlFraming():boolean { return this._hideControlFraming }
    public get hideSaveCancelButtons():boolean { return this._hideSaveCancelButtons }
    public get settings():Settings { return this._settings }
}

export class Grid extends Container {}

export class Image extends Component {
    private _allowAnnotations:boolean;
    private _allowPicker:boolean;
    private _allowPickOptions:boolean;
    private _aspectMode:AspectMode;
    private _capInsets:Edges;
    private _resizeMode:ResizeMode;
    private _urlString:string;
    private _captureBounds:CaptureBounds;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_ANNOTATIONS], (n:Node)=>{ this._allowAnnotations=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_PICKER], (n:Node)=>{ this._allowPicker=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_PICK_OPTIONS], (n:Node)=>{ this._allowPickOptions=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ASPECT_MODE], (n:Node)=>{ this._aspectMode=PrintUtil.enumValue(node, AspectMode) })
        PrintUtil.ifChild(this.nodeChildDict[XML_CAP_INSETS], (n:Node)=>{ this._capInsets=new Edges(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_RESIZE_MODE], (n:Node)=>{ this._resizeMode=PrintUtil.enumValue(node, ResizeMode) })
        PrintUtil.ifChild(this.nodeChildDict[XML_URL], (n:Node)=>{ this._urlString=PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_CAPTURE_BOUNDS], (n:Node)=>{ this._captureBounds=new CaptureBounds(node) })
    }
    public get allowAnnotations():boolean { return this._allowAnnotations }
    public get allowPicker():boolean { return this._allowPicker }
    public get allowPickOptions():boolean { return this._allowPickOptions }
    public get aspectMode():AspectMode { return this._aspectMode }
    public get capInsets():Edges { return this._capInsets }
    public get resizeMode():ResizeMode { return this._resizeMode }
    public get urlString():string { return this._urlString }
    public get capatureBounds():CaptureBounds { return this._captureBounds }
}

export class Label extends Component {
    private _bold:boolean;
    private _italic:boolean;
    private _underline:boolean;
    private _numberOfLines:number;
    private _text:string;
    private _textAlignment:TextAlignment;
    private _textColor:Color;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], (n:Node)=>{ this._bold=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], (n:Node)=>{ this._italic=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], (n:Node)=>{ this._underline=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], (n:Node)=>{ this._numberOfLines=PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], (n:Node)=>{ this._text=PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], (n:Node)=>{ this._textAlignment=PrintUtil.enumValue(node, TextAlignment) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], (n:Node)=>{ this._textColor=new Color(node) })
    }
    public get bold():boolean { return this._bold }
    public get italic():boolean { return this._italic }
    public get underline():boolean { return this._underline }
    public get numberOfLines():number { return this._numberOfLines }
    public get text():string { return this._text }
    public get textAlignment():TextAlignment { return this._textAlignment }
    public get textColor():Color { return this._textColor }
}

export class Layout extends Spec {
    private _uom:string;
    private _heights:Array<number>;
    private _widths:Array<number>;
    private _x:number;
    private _y:number;
    private _column:number;
    private _row:number;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_UOM], (n:Node)=>{ this._uom=PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_COLUMN], (n:Node)=>{ this._column=PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ROW], (n:Node)=>{ this._row=PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_SIZE], (n:Node)=>{
            this._heights=PrintUtil.arrayOfNumbers(n, "Height");
            this._widths=PrintUtil.arrayOfNumbers(n, "Width");
        })
        PrintUtil.ifChild(this.nodeChildDict[XML_ORIGIN], (n:Node)=>{
            PrintUtil.forEachChildNode(n, (n2:Node)=>{
                switch (n2.nodeName) {
                    case "X":
                        this._x = PrintUtil.singleChildNumber(n2);
                        break;
                    case "Y":
                        this._y = PrintUtil.singleChildNumber(n2);
                        break;
                }
            });
        })
    }
    public get uom():string { return this._uom }
    public get heights():number[] { return this._heights }
    public get widths():number[] { return this._widths }
    public get x():number { return this._x }
    public get y():number { return this._y }
    public get column():number { return this._column }
    public get row():number { return this._row }
}

export class Page extends Container {}

export class Settings extends Spec {
    private _refreshTimer:number;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_REFRESH_TIMER], (n:Node)=>{ this._refreshTimer=PrintUtil.singleChildNumber(node) })
    }
    public get refreshTimer():number { return this._refreshTimer }
}

export class SignatureCapture extends Component {
    private _captureBounds:CaptureBounds;
    private _lineColor:Color;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_CAPTURE_BOUNDS], (n:Node)=>{ this._captureBounds=new CaptureBounds(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_COLOR], (n:Node)=>{ this._lineColor=new Color(node) })
    }
    public get captureBounds():CaptureBounds { return this._captureBounds }
    public get lineColor():Color { return this._lineColor }
}

export class TextArea extends Component {
    private _entrySeq:number;
    private _bold:boolean;
    private _italic:boolean;
    private _underline:boolean;
    private _numberOfLines:number;
    private _text:string;
    private _textColor:Color;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], (n:Node)=>{ this._bold=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], (n:Node)=>{ this._italic=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], (n:Node)=>{ this._underline=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], (n:Node)=>{ this._numberOfLines=PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], (n:Node)=>{ this._text=PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], (n:Node)=>{ this._textColor=new Color(node) })
    }
    public get entrySeq():number { return this._entrySeq }
    public get bold():boolean { return this._bold }
    public get italic():boolean { return this._italic }
    public get underline():boolean { return this._underline }
    public get numberOfLines():number { return this._numberOfLines }
    public get text():string { return this._text }
    public get textColor():Color { return this._textColor }
}

export class TextField extends Component {
    private _entrySeq:number;
    private _bold:boolean;
    private _italic:boolean;
    private _underline:boolean;
    private _numberOfLines:number;
    private _text:string;
    private _textAlignment:TextAlignment;
    private _textColor:Color;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], (n:Node)=>{ this._bold=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], (n:Node)=>{ this._italic=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], (n:Node)=>{ this._underline=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], (n:Node)=>{ this._numberOfLines=PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], (n:Node)=>{ this._text=PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], (n:Node)=>{ this._textAlignment=PrintUtil.enumValue(node, TextAlignment) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], (n:Node)=>{ this._textColor=new Color(node) })
    }
    public get entrySeq():number { return this._entrySeq }
    public get bold():boolean { return this._bold }
    public get italic():boolean { return this._italic }
    public get underline():boolean { return this._underline }
    public get numberOfLines():number { return this._numberOfLines }
    public get text():string { return this._text }
    public get textAlignment():TextAlignment { return this._textAlignment }
    public get textColor():Color { return this._textColor }
}

export class TimePicker extends Component {
    private _entrySeq:number;
    private _bold:boolean;
    private _text:string;
    private _textAlignment:TextAlignment;
    private _textColor:Color;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], (n:Node)=>{ this._bold=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], (n:Node)=>{ this._text=PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], (n:Node)=>{ this._textAlignment=PrintUtil.enumValue(node, TextAlignment) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], (n:Node)=>{ this._textColor=new Color(node) })
    }
    public get entrySeq():number { return this._entrySeq }
    public get bold():boolean { return this._bold }
    public get text():string { return this._text }
    public get textAlignment():TextAlignment { return this._textAlignment }
    public get textColor():Color { return this._textColor }
}

export class ValuePicker extends Component {
    private _entrySeq:number;
    private _bold:boolean;
    private _numberOfLines:number;
    private _text:string;
    private _textAlignment:TextAlignment;
    private _textColor:Color;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], (n:Node)=>{ this._bold=PrintUtil.singleChildBoolean(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], (n:Node)=>{ this._numberOfLines=PrintUtil.singleChildNumber(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], (n:Node)=>{ this._text=PrintUtil.singleChildText(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], (n:Node)=>{ this._textAlignment=PrintUtil.enumValue(node, TextAlignment) })
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], (n:Node)=>{ this._textColor=new Color(node) })
    }
    public get entrySeq():number { return this._entrySeq }
    public get bold():boolean { return this._bold }
    public get numberOfLines():number { return this._numberOfLines }
    public get text():string { return this._text }
    public get textAlignment():TextAlignment { return this._textAlignment }
    public get textColor():Color { return this._textColor }
}


// export class RichNum {
//     constructor(node:Node, public value?:number, public usage:RichNumUsage=RichNumUsage.Absolute) {
//         if (node) {
//
//         } else {
//             // Values held by constructor line
//         }
//     }
//
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class ComponentFactory {
    public static fromNode(node:Node):Component {
        var answer:Component = null;
        switch(node.nodeName) {
            case XML_BUTTON: answer = new Button(node); break;
            case XML_CHECKBOX: answer = new Checkbox(node); break;
            case XML_IMAGE: answer = new Image(node); break;
            case XML_LABEL: answer = new Label(node); break;
            case XML_SIGNATURE_CAPTURE: answer = new SignatureCapture(node); break;
            case XML_TEXT_AREA: answer = new TextArea(node); break;
            case XML_TEXT_FIELD: answer = new TextField(node); break;
            case XML_TIME_PICKER: answer = new TimePicker(node); break;
            case XML_VALUE_PICKER: answer = new ValuePicker(node); break;

            case XML_CELL: answer = new Cell(node); break;
            case XML_FORM: answer = new Form(node); break;
            case XML_GRID: answer = new Grid(node); break;
            case XML_PAGE: answer = new Page(node); break;
        }
        return answer;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class PrintUtil {
    public static arrayOfNumbers(node:Node, name:string):Array<number> {
        let answer:Array<number>=[];
        PrintUtil.forEachChildNode(node, (n:Node)=>{
            if (n.nodeName == name) { answer.push(PrintUtil.singleChildNumber(n))}
        });
        return answer;
    }
    public static enumValue(node:Node, e:Object):any {
        let answer = null;
        let sv: string = PrintUtil.singleChildText(node);
        if (sv) {
            let nv: number = e[sv];
            if (!isNaN(nv)) {
                answer = e[nv];
            }
        }
        return answer;
    }
    public static forEachChildNode(node:Node, f:(n:Node)=>void):void {
        for (let i:number=0; i < node.childNodes.length; i++) {
            f(node.childNodes[i]);
        }
    }
    public static ifChild(node:Node, f:(n:Node)=>void):void {
        if (node) {
            f(node);
        }
    }
    public static singleChildBoolean(node:Node):boolean {
        let text:string=PrintUtil.singleChildText(node);
        if (text) {
            return text.toLocaleLowerCase() == "true";
        } else {
            return false;
        }
    }
    public static singleChildNumber(node:Node):number {
        var answer:number= NaN;
        if (node.childNodes.length != 1) {
            Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        } else if (node.childNodes[0].nodeName != "#text") {
            Log.error("XML error with " + node.nodeName + ".  Expected numeric node.");
        } else {
            answer = parseInt(node.childNodes[0].textContent);
        }
        return answer;
    }
    public static singleChildText(node:Node):string {
        if (node.childNodes.length != 1) {
            var text:string = "ExpectedExactlyOneNode";
            Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        } else if (node.childNodes[0].nodeName != "#text") {
            text = "ExpectedNodeText";
            Log.error("XML error with " + node.nodeName + ".  Expected text node.");
        } else {
            text = node.childNodes[0].textContent;
        }
        return text;
    }
}
/**
 * *********************************
 */


/**
 * *********************************
 */
