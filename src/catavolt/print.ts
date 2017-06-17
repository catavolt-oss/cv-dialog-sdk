
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

// Skipped in initial port: BarChart, BarcodeScanner, BarOrientation, Defaults, GaugeChart

const XML_CELL = "Cell";
const XML_FORM = "Form";
const XML_GRID = "Grid";
const XML_PAGE = "Page";

const XML_BUTTON = "Button";
const XML_CHECKBOX = "CheckBox";
const XML_DATE_PICKER = "DatePicker";
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
const XML_FILL_PARENT= "FillParent";
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

export class TextAttributes {
    bold:boolean=false;
    italic:boolean=false;
    underline:boolean=false;
    numberOfLines:number=1;
    textAlignment:TextAlignment;
    textColor:Color;
}

export interface Textish {
    // get textAttributes():TextAttributes;
}


/**
 * *********************************
 */
var GenID=1;  //  Generate a unique number if need be for IDs

export abstract class Spec {
    protected nodeChildDict:Object = {};
    constructor(node?:Node) {
        if (node) {
            PrintUtil.forEachChildNode(node, (n: Node)=> {
                this.nodeChildDict[n.nodeName] = n;
            })
        }
    }
}

export abstract class Component extends Spec {
    private _backgroundColor:Color;
    private _binding:Binding;
    private _id:string;
    private _layout:Layout;
    private _padding:Edges;
    private _parentContainer:Container;
    protected _textAttributes:TextAttributes;  // (only for DatePicker,Label,TextArea,TextField,TimePicker,ValuePicker, otherwise null)

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
    constructor(parentContainer:Container, node?:Node, overrideLayout?:Layout) {
        super(node);
        this._parentContainer = parentContainer;
        if (node) {
            PrintUtil.ifChild(this.nodeChildDict[XML_BACKGROUND_COLOR], (n:Node)=>{ this._backgroundColor = new Color(n) });
            PrintUtil.ifChild(this.nodeChildDict[XML_BINDING], (n:Node)=>{ this._binding = new Binding(n) });
            PrintUtil.ifChild(this.nodeChildDict[XML_ID], (n:Node)=>{ this._id = PrintUtil.singleChildText(n) });
            PrintUtil.ifChild(this.nodeChildDict[XML_LAYOUT], (n:Node)=>{ this._layout = new Layout(n) });
            PrintUtil.ifChild(this.nodeChildDict[XML_PADDING], (n:Node)=>{ this._padding = new Edges(n) });
            if (!this.id) {
                this._id="GenID-" + GenID++;
            }
        }
    }
    public initComponentWith(overrideLayout?:Layout):void {
        if (overrideLayout) { this._layout=overrideLayout }
        if (!this.id) {
            this._id="Generated-" + GenID++;
        }
    }

    get backgroundColor():Color { return this._backgroundColor }
    get binding():Binding { return this._binding }
    get id():string { return this._id }
    get layout():Layout { return this._layout }
    get padding():Edges { return this._padding}
    get actualHeights():Array<number> { return this._actualHeights }
    get actualWidths():Array<number> { return this._actualWidths }
    get actualX():number { return this._actualX }
    get actualY():number { return this._actualY }
    get height():number { return this._height }
    get parentContainer():Container { return this._parentContainer }
    get textAttributes():TextAttributes { return this._textAttributes }
    get width():number { return this._width }
    get x():number { return this._x }
    get y():number { return this._y }
}

export abstract class Container extends Component {
    private _children:Array<Component> = new Array();
    private _containerWidth:number;
    constructor(parentContainer:Container, node?:Node, overrideContainerWidth?:number) {
        super(parentContainer, node);
        if (this.nodeChildDict[XML_CHILDREN]) {
            PrintUtil.forEachChildNode(this.nodeChildDict[XML_CHILDREN], (n: Node)=> {
                let c: Component = ComponentFactory.fromNode(n, this);
                if (c) {
                    this._children.push(c);
                }
            });
        }
    }
    get children():Array<Component> { return this._children };
    get containerWidth():number {
        if (!this._containerWidth) {
            this.calcAndAssignContainerWidth(this.parentContainer);
        }
        return this._containerWidth
    }
    protected assignChildren(c:Array<Component>) {
        this._children=c;
    }
    protected assignContainerWidth(width:number) {
        this._containerWidth = width;
    }
    protected assignParentWidth(parentWidth:number) {
        this.assignContainerWidth(this.layout.sumOfWidths(parentWidth));
    }
    protected calcAndAssignContainerWidth(parentContainer:Container) {
        // Overriden by Form and Cell for altered behavior
        let parentWidth=parentContainer.containerWidth;
        if (this.layout == null) {
            throw Error("Bogus");
        }
        this.assignContainerWidth(this.layout.sumOfWidths(parentWidth));
    }
    initContainerWith(overrideLayout?:Layout, overideChildren?:Array<Component>) {
        this.initComponentWith(overrideLayout);
        if (overideChildren) { this.assignChildren(overideChildren) }
    }
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
export enum RichNumUsage { Undefined, Absolute, FillParent, PercentOfParent }
export enum RichNumUsageRef { Undefined, Absolute, FillParent, HorizontalCenter, HorizontalLeft, HorizontalRight,
    PercentOfParent, Remainder, VerticalBottom, VerticalCenter, VerticalTop }  // Just for reference
export enum TextAlignmentUsage { Left, Center, Right }
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
    get constantValue():any {
        // Constants are of the form propName[c], where c is the constant
        let w = null;
        if (this.hasConstant) {
            let left = this.path.indexOf("[");
            let right = this.path.indexOf("]");
            w = this.path.substr(left+1, right - left -1);
        }
        return w;
    }
    get hasAction():boolean {
        return (this.path.indexOf("catavolt:action") > -1);
    }
    get hasConstant():boolean {
        // Constants are of the form propName[c], where c is the constant
        let left = this.path.indexOf("[");
        let right = this.path.indexOf("]");
        return (left > -1 && right > -1 && (right - left > 0));
    }
    get path():string { return this._path }
    get propertyName():string {
        let w:string = null;
        if (this.hasConstant) {
            // Constants are of the form propName[c], where c is the constant
            // The binding still refrences a property name.
            w = this.path.substr(0, this.path.indexOf("["));
        } else if (this.hasAction) {
            // No property for an action
        } else {
            w = this.path;
        }
        return w;
    }
    get type():BindingType { return this._type }

}

export class Button extends Component {
    private _aspectMode:AspectMode;
    private _capInsets:Edges;
    private _resizeMode:ResizeMode;
    private _urlString:string ;
    private _enabledInReadMode:boolean ;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ASPECT_MODE], (n:Node)=>{ this._aspectMode = PrintUtil.enumValue(n, AspectMode) })
        PrintUtil.ifChild(this.nodeChildDict[XML_CAP_INSETS], (n:Node)=>{ this._capInsets = new Edges(node) })
        PrintUtil.ifChild(this.nodeChildDict[XML_RESIZE_MODE], (n:Node)=>{ this._resizeMode = PrintUtil.enumValue(n, ResizeMode) })
        PrintUtil.ifChild(this.nodeChildDict[XML_URL], (n:Node)=>{ this._urlString = PrintUtil.singleChildText(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ENABLED_IN_READ_MODE], (n:Node)=>{ this._enabledInReadMode = PrintUtil.singleChildBoolean(n)})
    }
    get aspectMode():AspectMode { return this._aspectMode }
    get capInsets():Edges { return this._capInsets }
    get resizeMode():ResizeMode { return this._resizeMode }
    get urlString():string { return this._urlString }
    get enableInReadMode():boolean { return this._enabledInReadMode}
}

export class CaptureBounds extends Property {
    private _height:RichNum; _width:RichNum;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_HEIGHT], (n:Node)=>{ this._height = PrintUtil.singleChildRichNum(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_WIDTH], (n:Node)=>{ this._width= PrintUtil.singleChildRichNum(n) })
    }
    get height():RichNum { return this._height }
    get width():RichNum { return this._width }
}

export class Cell extends Container {
    private _borderColor:Color;
    private _borderWidths:Edges;
    private _grid:Grid;
    constructor(parentContainer:Container, node?:Node) {
        super(parentContainer, node);
        this._grid = parentContainer as Grid;
        PrintUtil.ifChild(this.nodeChildDict[XML_BORDER_COLOR], (n:Node)=>{ this._borderColor = new Color(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BORDER_WIDTHS], (n:Node)=>{ this._borderWidths = new Edges(n) })
    }
    get borderColor():Color { return this._borderColor }
    get borderWidths():Edges { return this._borderWidths }
    get cellHeight():number { return this._grid.layout.heights[this.layout.row].value }
    get cellWidth():number { return this._grid.layout.widths[this.layout.column].resolveWithFill(this._grid.containerWidth) }
    get componentChildren():Array<Component> {
        let answer:Array<Component>=[];
        this.children.map((c)=>{
            if (!(c instanceof Grid)) {
                answer.push(c as Component);
            }
        });
        return answer;
    }
    get gridChildren():Array<Grid> {
        let answer:Array<Grid>=[];
        this.children.map((c)=>{
            if (c instanceof Grid) {
                answer.push(c as Grid);
            }
        });
        return answer;
    }
    initCellWith(overrideLayout?:Layout, overrideChildren?:Array<Component>):void {
        let ol = overrideLayout;
        if (!this.layout && !overrideLayout) {
            ol = new Layout(null, NaN, NaN, NaN, NaN, 0, 0);
        }
        this.initContainerWith(ol, overrideChildren);
        if (!this.borderWidths) {
            this._borderWidths = new Edges();
            this._borderWidths.initEdgesWith(0,0,0,0);
        }
    }
    protected calcAndAssignContainerWidth(parentContainer:Container) {
        if ((parentContainer as Grid).layout == null) {
            throw Error("bogus");
        }
        let cw = (parentContainer as Grid).layout.widths[this.layout.column].resolveWithFill(parentContainer.containerWidth);
        this.assignContainerWidth(cw);
    }

}

export class Checkbox extends Component {
    private _checkedColor:Color;
    private _entrySeq:number;
    private _lineColor:Color;
    private _lineWidth:number;
    private _radioGroup:string;
    private _uncheckedColor:Color;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_CHECKED_COLOR], (n:Node)=>{ this._checkedColor = new Color(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildInt(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_COLOR], (n:Node)=>{ this._lineColor = new Color(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_WIDTH], (n:Node)=>{ this._lineWidth = PrintUtil.singleChildFloat(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_RADIO_GROUP], (n:Node)=>{ this._radioGroup = PrintUtil.singleChildText(n)})
        PrintUtil.ifChild(this.nodeChildDict[XML_UNCHECKED_COLOR], (n:Node)=>{ this._uncheckedColor = new Color(n)})
    }
    get checkedColor():Color { return this._checkedColor }
    get entrySeq():number { return this._entrySeq }
    get lineColor():Color { return this._lineColor }
    get lineWidth():number { return this._lineWidth }
    get radioGroup():string { return this._radioGroup }
    get uncheckedColor():Color { return this._uncheckedColor }
}

export class Color extends Spec {
    public static WHITE():Color {let c:Color = new Color(null); c._red = 255; c._green = 255; c._blue = 255; c._alpha = 255; return c; }
    public static BLACK():Color {let c:Color = new Color(null); c._red = 0; c._green = 0; c._blue = 0; c._alpha = 255; return c; }
    private _red:number; _green:number; _blue:number; _alpha:number;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_RED], (n:Node)=>{ this._red = PrintUtil.singleChildInt(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_BLUE], (n:Node)=>{ this._blue = PrintUtil.singleChildInt(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_GREEN], (n:Node)=>{ this._green = PrintUtil.singleChildInt(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ALPHA], (n:Node)=>{ this._alpha = PrintUtil.singleChildFloat(n) })
    }
    get alpha():number { return this._alpha }
    get red():number { return this._red }
    get green():number { return this._green }
    get blue():number { return this._blue }
}

export class DatePicker extends Component implements Textish {
    private _entrySeq:number;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        this._textAttributes = new TextAttributes();
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildInt(n) })
        PrintUtil.importTextAttributes(this.nodeChildDict, this.textAttributes);
    }
    getTextAttributes():TextAttributes { return this.textAttributes }
    get entrySeq():number { return this._entrySeq }
}

export class Edges extends Spec {
    private _top:number; _left:number; _bottom:number; _right:number;
    constructor(node?:Node) {
        super(node);
        if (node) {
            PrintUtil.ifChild(this.nodeChildDict[XML_TOP], (n:Node)=>{ this._top = PrintUtil.singleChildFloat(n) })
            PrintUtil.ifChild(this.nodeChildDict[XML_LEFT], (n:Node)=>{ this._left = PrintUtil.singleChildFloat(n) })
            PrintUtil.ifChild(this.nodeChildDict[XML_BOTTOM], (n:Node)=>{ this._bottom = PrintUtil.singleChildFloat(n) })
            PrintUtil.ifChild(this.nodeChildDict[XML_RIGHT], (n:Node)=>{ this._right = PrintUtil.singleChildFloat(n) })
        }
    }
    initEdgesWith(top?:number, left?:number, bottom?:number, right?:number):void {
        this._top = top;
        this._left = left;
        this._bottom = bottom;
        this._right = right;
    }
    get top():number { return this._top }
    get left():number { return this._left }
    get bottom():number { return this._bottom }
    get right():number { return this._right }
}

export class Form extends Container {
    static fromXMLString(xmlString:string):Form {
        let xml:Document=(new DOMParser()).parseFromString(xmlString, 'text/xml');
        return new Form(xml.childNodes[0]);
    }
    private _hideControlFraming:boolean;
    private _hideSaveCancelButtons:boolean;
    private _settings:Settings;
    constructor(node:Node) {
        if (node) {
            // Because super fluffs children, we need to pre-get the Layout to know this Form's width
            PrintUtil.forEachChildNode(node, (n: Node)=> {
                if (n.nodeName == "Layout") {
                    let tempLayout:Layout = new Layout(n);
                    this.assignContainerWidth(tempLayout.singleWidthNum());
                }
            })
        }

        // node.childNodes.
        super(null, node);
        // NOTE: Some forms have no pages, other forms have pages.  A page always contains exactly
        //       one 1x1 grid positioned at 0,0 and is the size of the form.
        //       Doctor up the children such that there are always Pages.  If no pages exist, then
        //       create a Page and a Grid and add these children as the content.
        if (this.children && this.children.length && (this.children[0] instanceof Grid)) {
            let p:Page=new Page(this);
            let g:Grid=new Grid(p);
            let c:Cell=new Cell(g);
            c.initCellWith(new Layout(null,0,0,0,0,0,0), this.children);
            g.initGridWith(new Layout(null,0,0,this.layout.singleWidthNum(),this.layout.singleHeightNum()), [c]);
            p.initPageWith(g);
            this.assignChildren([p]);
        }
    }
    get hideControlFraming():boolean { return this._hideControlFraming }
    get hideSaveCancelButtons():boolean { return this._hideSaveCancelButtons }
    get pageChildren():Page[] { return this.children as Page[] }
    get settings():Settings { return this._settings }
    protected calcAndAssignContainerWidth(parentContainer:Container) {
        this.assignContainerWidth(this.layout.singleWidthNum());
    }

}

export class Grid extends Container {
    private _cellChildren:Cell[][];
    private _gridLines:GridLine[];
    constructor(parentContainer:Container, node?:Node) {
        super(parentContainer, node);
    }
    get gridLines():GridLine[] {
        if (!this._gridLines) {
            this._gridLines=new Array<GridLine>();
            let hasHLines=false;
            let hasVLines=false;
            let cols = this.layout.widths.length;
            let rows = this.layout.heights.length;
            let vLines=new Array<GridLine>(rows*cols+rows);  // Distinct vertical lines
            let hLines=new Array<GridLine>(rows*cols+cols);  // Distinct horizointal lines
            let colStart = 0;
            for (let c = 0; c < cols; c++) {
                let rowStart=0;
                let colWidth=this.layout.widths[c].resolveWithFill(this.parentContainer.containerWidth);
                for (let r = 0; r < rows; r++) {
                    let rowHeight=this.layout.heights[r].resolveWithFill(this.parentContainer.containerWidth);

                    // Vertical lines
                    let lineWidth=0;
                    if (c==0) {
                        // Left most vertical
                        lineWidth=this.cellChildren[r][c].borderWidths.left;
                    } else {
                        // Middle verticals
                        lineWidth = Math.max(this.cellChildren[r][c - 1].borderWidths.right, this.cellChildren[r][c].borderWidths.left);
                    }
                    if (lineWidth) {
                        vLines[c*rows+r] = new GridLine(new Point(colStart, rowStart), new Point(colStart, rowStart + rowHeight), lineWidth);
                        hasVLines = true;
                    }
                    if (c==cols-1) {
                        // Right most vertical
                        lineWidth = this.cellChildren[r][c].borderWidths.right;
                        if (lineWidth) {
                            // Place these appropriately so the combining logic can work.
                            vLines[cols*rows+r] = new GridLine(new Point(colStart+colWidth, rowStart), new Point(colStart+colWidth, rowStart + rowHeight), lineWidth);
                            hasVLines = true;
                        }
                    }

                    // Horizontal lines
                    lineWidth=0;
                    if (r==0) {
                        // Top most horizontal
                        lineWidth=this.cellChildren[r][c].borderWidths.top;
                    } else {
                        // Middle horizontals
                        lineWidth = Math.max(this.cellChildren[r-1][c].borderWidths.bottom, this.cellChildren[r][c].borderWidths.top);
                    }
                    if (lineWidth) {
                        hLines[r*cols+c] = new GridLine(new Point(colStart, rowStart), new Point(colStart + colWidth, rowStart), lineWidth);
                        hasHLines = true;
                    }
                    if (r==rows-1) {
                        // Bottom most horizontal
                        lineWidth = this.cellChildren[r][c].borderWidths.bottom;
                        if (lineWidth) {
                            // Place these appropriately so the combining logic can work.
                            hLines[cols*rows+c] = new GridLine(new Point(colStart, rowStart+rowHeight), new Point(colStart+colWidth, rowStart + rowHeight), lineWidth);
                            hasHLines = true;
                        }
                    }

                    rowStart += rowHeight;
                }
                colStart+=colWidth;
            }

            // Combine adjacent lines
            let lastX = NaN;
            let lastEndY = NaN;
            let lastLineWidth = NaN;
            let lastPush=this._gridLines.length -1;
            if (hasVLines) {
                for (let gl of vLines) {
                    if (gl) {
                        if (isNaN(lastEndY)) {
                            lastEndY = gl.end.y;
                            lastX = gl.end.x;
                            lastLineWidth = gl.lineWidth;
                            this._gridLines.push(gl);
                            lastPush++;
                        } else if (gl.start.y == lastEndY && (gl.start.x == lastX) && (gl.lineWidth == lastLineWidth)) {
                            // This line and the previous can be combined
                            lastEndY = gl.end.y;
                            this._gridLines[lastPush].end = gl.end;
                        } else {
                            this._gridLines.push(gl);
                            lastPush++;
                            lastEndY = gl.end.y;
                            lastX = gl.end.x;
                            lastLineWidth = gl.lineWidth;
                        }
                    }
                }
            }
            if (hasHLines) {
                let lastEndX = NaN;
                let lastY = NaN;
                lastLineWidth = NaN;
                lastPush=this._gridLines.length -1;
                for (let gl of hLines) {
                    if (gl) {
                        if (isNaN(lastEndX)) {
                            lastEndX = gl.end.x;
                            lastY = gl.end.y;
                            lastLineWidth = gl.lineWidth;
                            this._gridLines.push(gl);
                            lastPush++;
                        } else if (gl.start.x == lastEndX && (gl.start.y == lastY) && (gl.lineWidth == lastLineWidth)) {
                            // This line and the previous can be combined
                            lastEndX = gl.end.x;
                            this._gridLines[lastPush].end = gl.end;
                        } else {
                            this._gridLines.push(gl);
                            lastPush++;
                            lastEndX = gl.end.x;
                            lastY = gl.end.y;
                            lastLineWidth = gl.lineWidth;
                        }
                    }
                }
            }
        }
        return this._gridLines;
    }
    private initCells():void {
        // Structure the cells so that they can be retrieved
        this._cellChildren = new Array(this.layout.heights.length);
        for (var i = 0; i < this.layout.heights.length; i++) {
            this._cellChildren[i] = new Array(this.layout.widths.length);
        }
        this.children.map((c: Cell)=> {
            this._cellChildren[c.layout.row][c.layout.column] = c;
        });
    }
    get cellChildren():Cell[][] {
        if (this._cellChildren == null) {
            this.initCells();
        }
        return this._cellChildren;
    }
    initGridWith(overrideLayout?:Layout, overrideChildren?:Array<Component>):void {
        super.initContainerWith(overrideLayout, overrideChildren);
        this.initCells();
    }
}

export class GridLine {
    start:Point;
    end:Point;
    lineWidth:number;
    constructor(start:Point, end:Point, lineWidth:number) {
        this.start=start;
        this.end=end;
        this.lineWidth=lineWidth;
    }
}
export class Point {
    x:number;
    y:number;
    constructor(x:number, y:number) {
        this.x=x;
        this.y=y;
    }
}

export class Image extends Component {
    private _allowAnnotations:boolean;
    private _allowPicker:boolean;
    private _allowPickOptions:boolean;
    private _aspectMode:AspectMode;
    private _capInsets:Edges;
    private _resizeMode:ResizeMode;
    private _urlString:string;
    private _captureBounds:CaptureBounds;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_ANNOTATIONS], (n:Node)=>{ this._allowAnnotations=PrintUtil.singleChildBoolean(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_PICKER], (n:Node)=>{ this._allowPicker=PrintUtil.singleChildBoolean(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_PICK_OPTIONS], (n:Node)=>{ this._allowPickOptions=PrintUtil.singleChildBoolean(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_ASPECT_MODE], (n:Node)=>{ this._aspectMode=PrintUtil.enumValue(n, AspectMode) })
        PrintUtil.ifChild(this.nodeChildDict[XML_CAP_INSETS], (n:Node)=>{ this._capInsets=new Edges(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_RESIZE_MODE], (n:Node)=>{ this._resizeMode=PrintUtil.enumValue(n, ResizeMode) })
        PrintUtil.ifChild(this.nodeChildDict[XML_URL], (n:Node)=>{ this._urlString=PrintUtil.singleChildText(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_CAPTURE_BOUNDS], (n:Node)=>{ this._captureBounds=new CaptureBounds(n) })
    }
    get allowAnnotations():boolean { return this._allowAnnotations }
    get allowPicker():boolean { return this._allowPicker }
    get allowPickOptions():boolean { return this._allowPickOptions }
    get aspectMode():AspectMode { return this._aspectMode }
    get capInsets():Edges { return this._capInsets }
    get resizeMode():ResizeMode { return this._resizeMode }
    get urlString():string { return this._urlString }
    get capatureBounds():CaptureBounds { return this._captureBounds }
}

export class Label extends Component implements Textish {
    private _text:string;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        this._textAttributes = new TextAttributes();
        PrintUtil.importTextAttributes(this.nodeChildDict, this._textAttributes);
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], (n:Node)=>{ this._text=PrintUtil.singleChildText(n) })
    }
    get text():string { return this._text }
}

export class Layout extends Spec {
    private _uom:string;
    private _heights:Array<RichNum>;
    private _widths:Array<RichNum>;
    private _x:number;
    private _y:number;
    private _column:number;
    private _row:number;
    constructor(node:Node, x?:number, y?:number, width?:number, height?:number, row?:number, col?:number) {
        super(node);
        if (node) {
            PrintUtil.ifChild(this.nodeChildDict[XML_UOM], (n: Node)=> {
                this._uom = PrintUtil.singleChildText(n)
            })
            PrintUtil.ifChild(this.nodeChildDict[XML_COLUMN], (n: Node)=> {
                this._column = PrintUtil.singleChildInt(n)
            })
            PrintUtil.ifChild(this.nodeChildDict[XML_ROW], (n: Node)=> {
                this._row = PrintUtil.singleChildInt(n)
            })
            PrintUtil.ifChild(this.nodeChildDict[XML_SIZE], (n: Node)=> {
                this._heights = PrintUtil.arrayOfRichNums(n, "Height");
                this._widths = PrintUtil.arrayOfRichNums(n, "Width");
            })
            PrintUtil.ifChild(this.nodeChildDict[XML_FILL_PARENT], (n: Node)=> {
                this._heights = [new RichNum(NaN, RichNumUsage.FillParent)];
                this._widths = [new RichNum(NaN, RichNumUsage.FillParent)];
            })
            PrintUtil.ifChild(this.nodeChildDict[XML_ORIGIN], (n: Node)=> {
                PrintUtil.forEachChildNode(n, (n2: Node)=> {
                    switch (n2.nodeName) {
                        case "X":
                            this._x = PrintUtil.singleChildFloat(n2);
                            break;
                        case "Y":
                            this._y = PrintUtil.singleChildFloat(n2);
                            break;
                    }
                });
            })
        } else {
            this._x=x;
            this._y=y;
            this._widths=[new RichNum(width)];
            this._heights=[new RichNum(height)];
            this._column=col;
            this._row=row;
        }
    }
    get uom():string { return this._uom }
    get heights():RichNum[] { return this._heights }
    get widths():RichNum[] { return this._widths }
    get x():number { return this._x }
    get y():number { return this._y }
    get column():number { return this._column }
    get row():number { return this._row }

    singleHeightNum():number {
        let rn=this.singleHeightRichNum();
        if (!rn.isNumber) {
            throw Error("Expecting number on height layout")
        }
        return rn.value;
    }
    singleHeightRichNum():RichNum{
        if (!this.heights) {
            throw Error("No height values on Layout");
        } else if (this.heights.length != 1) {
            throw Error("Expecting exactly 1 height, but found: " + this.heights.length)
        } else {
            return this.heights[0];
        }
    }
    singleWidthNum():number {
        let rn=this.singleWidthRichNum();
        if (!rn.isNumber) {
            throw Error("Expecting number on width layout")
        }
        return rn.value;
    }
    singleWidthRichNum():RichNum{
        if (!this.widths) {
            throw Error("No width values on Layout");
        } else if (this.widths.length != 1) {
            throw Error("Expecting exactly 1 width, but found: " + this.widths.length)
        } else {
            return this.widths[0];
        }
    }
    sumOfHeights():number {
        let answer:number=0.0;
        if (!this.heights) {
            throw Error("No height values on Layout");
        }
        this.heights.map((rn:RichNum)=>{
            if (!rn) {
                throw Error("Unsupported ricn num usage on layout.heights")
            }
            if (!rn.isNumber) {
                throw Error("Expecting number on layout.heights")
            }
            answer+=rn.value;
        })
        return answer;
    }
    sumOfWidths(parentSize:number):number {
        let answer:number=0.0;
        if (!this.widths) {
            throw Error("No width values on Layout");
        }
        this.widths.map((rn:RichNum)=>{
            if (!rn) {
                throw Error("Unsupported ricn num usage on layout.widths")
            }
            if (rn.isFillParent) {
                if (this.widths.length != 1) {
                    throw Error("More than one value being summed and FillParentWidth used: layout.widths")
                }
                answer = parentSize;
            } else if (rn.isPercentOfParent) {
                answer += parentSize * rn.valueOfPercent;
            } else if (rn.isNumber) {
                answer+=rn.value;
            } else {
                throw Error("Unknown RichNum usage on layout.widths")
            }
        })
        return answer;
    }

}

export class Page extends Container {
    constructor(parentContainer:Container, node?:Node) {
        super(parentContainer, node);
    }
    get gridChildren():Grid[] { return this.children as Grid[] }
    initPageWith(grid:Grid):void {
        this.initContainerWith(null, [grid]);
    }
    protected calcAndAssignContainerWidth(parentContainer:Container) {
        this.assignContainerWidth(parentContainer.containerWidth);
    }

}

export class Settings extends Spec {
    private _refreshTimer:number;
    constructor(node:Node) {
        super(node);
        PrintUtil.ifChild(this.nodeChildDict[XML_REFRESH_TIMER], (n:Node)=>{ this._refreshTimer=PrintUtil.singleChildInt(n) })
    }
    get refreshTimer():number { return this._refreshTimer }
}

export class RichNum {
    static ZERO:RichNum = new RichNum(0);
    constructor(private _value:number, private _usage:RichNumUsage=RichNumUsage.Absolute) { }
    get value():number {
        if (!this.isNumber) { throw Error("RichNum is not a raw number.")}
        return this._value
    }
    get valueOfPercent():number {
        if (!this.isPercentOfParent) { throw Error("PercentOfParent requested for wrong usage.")}
        return this._value * .01;
    }
    get isNumber():boolean { return this._usage == RichNumUsage.Absolute }
    get isFillParent():boolean { return this._usage == RichNumUsage.FillParent }
    get isPercentOfParent():boolean { return this._usage == RichNumUsage.PercentOfParent }
    resolveWithFill(n:number) {
        let answer:number;
        if (this.isNumber) {
            answer = this._value;
        } else if (this.isFillParent) {
            answer = n;
        } else if (this.isPercentOfParent) {
            answer = this.valueOfPercent * n;
        } else {
            throw Error("Unknown RichNum usage on resolveWithFill")
        }
        return answer;
    }
}

export class SignatureCapture extends Component {
    private _captureBounds:CaptureBounds;
    private _lineColor:Color;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_CAPTURE_BOUNDS], (n:Node)=>{ this._captureBounds=new CaptureBounds(n) })
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_COLOR], (n:Node)=>{ this._lineColor=new Color(n) })
    }
    get captureBounds():CaptureBounds { return this._captureBounds }
    get lineColor():Color { return this._lineColor }
}

export class TextAlignment {
    constructor(private _usage:TextAlignmentUsage) { }
    get isCenter():boolean { return this._usage == TextAlignmentUsage.Center }
    get isLeft():boolean { return this._usage == TextAlignmentUsage.Left }
    get isRight():boolean { return this._usage == TextAlignmentUsage.Right }
}

export class TextArea extends Component implements Textish {
    private _entrySeq:number;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        this._textAttributes = new TextAttributes();
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildInt(n) })
        PrintUtil.importTextAttributes(this.nodeChildDict, this._textAttributes);
    }
    get entrySeq():number { return this._entrySeq }
}

export class TextField extends Component implements Textish {
    private _entrySeq:number;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        this._textAttributes = new TextAttributes();
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildInt(n) })
        PrintUtil.importTextAttributes(this.nodeChildDict, this._textAttributes);
    }
    get entrySeq():number { return this._entrySeq }
}

export class TimePicker extends Component implements Textish {
    private _entrySeq:number;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        this._textAttributes = new TextAttributes();
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildInt(n) })
        PrintUtil.importTextAttributes(this.nodeChildDict, this._textAttributes);
    }
    get entrySeq():number { return this._entrySeq }
}

export class ValuePicker extends Component implements Textish {
    private _entrySeq:number;
    constructor(parentContainer:Container, node:Node) {
        super(parentContainer, node);
        this._textAttributes = new TextAttributes();
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], (n:Node)=>{ this._entrySeq = PrintUtil.singleChildInt(n) })
        PrintUtil.importTextAttributes(this.nodeChildDict, this._textAttributes);
    }
    get entrySeq():number { return this._entrySeq }
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
    static fromNode(node:Node, parentContainer:Container):Component {
        var answer:Component = null;
        switch(node.nodeName) {
            case XML_BUTTON: answer = new Button(parentContainer, node); break;
            case XML_CHECKBOX: answer = new Checkbox(parentContainer, node); break;
            case XML_DATE_PICKER: answer = new DatePicker(parentContainer, node); break;
            case XML_IMAGE: answer = new Image(parentContainer, node); break;
            case XML_LABEL: answer = new Label(parentContainer, node); break;
            case XML_SIGNATURE_CAPTURE: answer = new SignatureCapture(parentContainer, node); break;
            case XML_TEXT_AREA: answer = new TextArea(parentContainer, node); break;
            case XML_TEXT_FIELD: answer = new TextField(parentContainer, node); break;
            case XML_TIME_PICKER: answer = new TimePicker(parentContainer, node); break;
            case XML_VALUE_PICKER: answer = new ValuePicker(parentContainer, node); break;

            case XML_CELL: answer = new Cell(parentContainer, node); break;
            case XML_FORM: answer = new Form(node); break;
            case XML_GRID: answer = new Grid(parentContainer, node); break;
            case XML_PAGE: answer = new Page(parentContainer, node); break;
        }
        return answer;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class PrintUtil {
    static arrayOfRichNums(node:Node, name:string):Array<RichNum> {
        let answer:Array<RichNum>=[];
        PrintUtil.forEachChildNode(node, (n:Node)=>{
            if (n.nodeName == name) { answer.push(PrintUtil.singleChildRichNum(n))}
        });
        return answer;
    }
    static enumValue(node:Node, e:Object):number {
        let answer = null;
        let sv: string = PrintUtil.singleChildText(node);
        let nv: number;
        if (sv) {
            nv = e[sv];
        }
        return nv;
    }
    static forEachChildNode(node:Node, f:(n:Node)=>void):void {
        for (let i:number=0; i < node.childNodes.length; i++) {
            f(node.childNodes[i]);
        }
    }
    static ifChild(node:Node, f:(n:Node)=>void):void {
        if (node) {
            f(node);
        }
    }
    static importTextAttributes(nodeChildDict:Object, textAttributes:TextAttributes):void {
        PrintUtil.ifChild(nodeChildDict[XML_BOLD], (n:Node)=>{ textAttributes.bold=PrintUtil.singleChildBoolean(n) });
        PrintUtil.ifChild(nodeChildDict[XML_ITALIC], (n:Node)=>{ textAttributes.italic=PrintUtil.singleChildBoolean(n) });
        PrintUtil.ifChild(nodeChildDict[XML_UNDERLINE], (n:Node)=>{ textAttributes.underline=PrintUtil.singleChildBoolean(n) });
        PrintUtil.ifChild(nodeChildDict[XML_TEXT_ALIGNMENT], (n:Node)=>{ textAttributes.textAlignment=new TextAlignment(PrintUtil.singleChildTextAlignmentUsage(n)) });
        PrintUtil.ifChild(nodeChildDict[XML_TEXT_COLOR], (n:Node)=>{ textAttributes.textColor=new Color(n) });
        PrintUtil.ifChild(nodeChildDict[XML_NUMBER_OF_LINES], (n:Node)=>{ textAttributes.numberOfLines=PrintUtil.singleChildInt(n) });
    }
    static singleChildBoolean(node:Node):boolean {
        let text:string=PrintUtil.singleChildText(node);
        if (text) {
            return text.toLocaleLowerCase() == "true";
        } else {
            return false;
        }
    }
    static singleChildInt(node:Node):number {
        var answer:number;
        if (node.childNodes.length != 1) {
            Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        } else if (node.childNodes[0].nodeName != "#text") {
            Log.error("XML error with " + node.nodeName + ".  Expected numeric node.");
        } else {
            answer = parseInt(node.childNodes[0].textContent);
        }
        return answer;
    }
    static singleChildFloat(node:Node):number {
        var answer:number;
        if (node.childNodes.length != 1) {
            Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        } else if (node.childNodes[0].nodeName != "#text") {
            Log.error("XML error with " + node.nodeName + ".  Expected numeric node.");
        } else {
            answer = parseFloat(node.childNodes[0].textContent);
        }
        return answer;
    }
    static singleChildRichNum(node:Node):RichNum {
        // Either there is a FillParent entry with surrounding white space, or a single text entry
        var answer:RichNum;
        for (let i:number=0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeName == RichNumUsage[RichNumUsage.PercentOfParent].toString()) {
                let v = this.singleChildFloat(node.childNodes[i]);
                answer = new RichNum(v, RichNumUsage.PercentOfParent);
                break;
            } else if (node.childNodes[i].nodeName == RichNumUsage[RichNumUsage.FillParent].toString()) {
                answer = new RichNum(NaN, RichNumUsage.FillParent);
                break;
            } else if (node.childNodes[i].nodeName == "#text") {
                let v:number = parseFloat(node.childNodes[i].textContent.trim());
                if (!isNaN(v)) {
                    answer = new RichNum(v);
                }
                // Don't break, keep looking for FillParent
            }
        }
        return answer;
    }
    static singleChildText(node:Node):string {
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
    static singleChildTextAlignmentUsage(node:Node):TextAlignmentUsage {
        // Either there is a FillParent entry with surrounding white space, or a single text entry
        var answer:TextAlignmentUsage = TextAlignmentUsage.Left;
        if (node.childNodes.length != 1) {
            Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        } else if (node.childNodes[0].nodeName != "#text") {
            Log.error("XML error with " + node.nodeName + ".  Expected text node.");
        } else {
            const a = node.childNodes[0].textContent;
            if (a == TextAlignmentUsage[TextAlignmentUsage.Center].toString()) {
                answer = TextAlignmentUsage.Center;
            } else if (a == TextAlignmentUsage[TextAlignmentUsage.Left].toString()) {
                answer = TextAlignmentUsage.Left;
            } else if (a == TextAlignmentUsage[TextAlignmentUsage.Right].toString()) {
                answer = TextAlignmentUsage.Right;
            } else {
                Log.error("XML error with " + node.nodeName + ".  Unknown TextAlignment: " + a);
            }
        }
        return answer;
    }

}
/**
 * *********************************
 */


/**
 * *********************************
 */
