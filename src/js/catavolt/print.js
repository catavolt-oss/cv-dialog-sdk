"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util_1 = require("./util");
/*
 IMPORTANT!
 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */
// Skipped in initial port: BarChart, BarcodeScanner, BarOrientation,
//                          DatePicker, Defaults, GaugeChart
var XML_CELL = "Cell";
var XML_FORM = "Form";
var XML_GRID = "Grid";
var XML_PAGE = "Page";
var XML_BUTTON = "Button";
var XML_CHECKBOX = "CheckBox";
var XML_IMAGE = "Image";
var XML_LABEL = "Label";
var XML_SIGNATURE_CAPTURE = "SignatureCapture";
var XML_TEXT_AREA = "TextArea";
var XML_TEXT_FIELD = "TextField";
var XML_TIME_PICKER = "TimePicker";
var XML_VALUE_PICKER = "ValuePicker";
var XML_CHILDREN = "Children";
var XML_ALLOW_ANNOTATIONS = "AllowAnnotations";
var XML_ALLOW_PICKER = "AllowPicker";
var XML_ALLOW_PICK_OPTIONS = "AllowPickOptions";
var XML_ALPHA = "Alpha";
var XML_ASPECT_MODE = "AspectMode";
var XML_BACKGROUND_COLOR = "BackgroundColor";
var XML_BINDING = "Binding";
var XML_BLUE = "Blue";
var XML_BOLD = "Bold";
var XML_BORDER_COLOR = "BorderColor";
var XML_BORDER_WIDTHS = "BorderWidths";
var XML_BOTTOM = "Bottom";
var XML_CAP_INSETS = "CapInsets";
var XML_CAPTURE_BOUNDS = "CaptureBounds";
var XML_CHECKED_COLOR = "CheckedColor";
var XML_COLUMN = "Column";
var XML_ENABLED_IN_READ_MODE = "EnabledInReadMode";
var XML_ENTRY_SEQ = "EntrySeq";
var XML_GREEN = "Green";
var XML_HEIGHT = "Height";
var XML_ID = "Id";
var XML_ITALIC = "Italic";
var XML_LAYOUT = "Layout";
var XML_LEFT = "Left";
var XML_LINE_COLOR = "LineColor";
var XML_LINE_WIDTH = "LineWidth";
var XML_NUMBER_OF_LINES = "NumberOfLines";
var XML_ORIGIN = "Origin";
var XML_PADDING = "Padding";
var XML_RADIO_GROUP = "RadioGroup";
var XML_RED = "Red";
var XML_REFRESH_TIMER = "RefreshTimer";
var XML_RESIZE_MODE = "ResizeMode";
var XML_RIGHT = "Right";
var XML_ROW = "Row";
var XML_SIZE = "Size";
var XML_TEXT = "Text";
var XML_TEXT_ALIGNMENT = "TextAlignment";
var XML_TEXT_COLOR = "TextColor";
var XML_TOP = "Top";
var XML_UNCHECKED_COLOR = "UncheckedColor";
var XML_UNDERLINE = "Underline";
var XML_UOM = "UOM";
var XML_URL = "URL";
var XML_WIDTH = "Width";
var XML_X = "X";
var XML_Y = "Y";
/**
 * *********************************
 */
var GenID = 1; //  Generate a unique number if need be for IDs
var Spec = (function () {
    function Spec(node) {
        var _this = this;
        this.nodeChildDict = {};
        PrintUtil.forEachChildNode(node, function (n) {
            _this.nodeChildDict[n.nodeName] = n;
        });
    }
    return Spec;
}());
exports.Spec = Spec;
var Component = (function (_super) {
    __extends(Component, _super);
    function Component(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BACKGROUND_COLOR], function (n) { _this._backgroundColor = new Color(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_BINDING], function (n) { _this._binding = new Binding(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ID], function (n) { _this._id = PrintUtil.singleChildText(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_LAYOUT], function (n) { _this._layout = new Layout(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_PADDING], function (n) { _this._padding = new Edges(n); });
        if (!this.id) {
            this._id = "GenID-" + GenID++;
        }
    }
    Object.defineProperty(Component.prototype, "backgroundColor", {
        get: function () { return this._backgroundColor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "binding", {
        get: function () { return this._binding; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "layout", {
        get: function () { return this._layout; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "padding", {
        get: function () { return this._padding; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "actualHeights", {
        get: function () { return this._actualHeights; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "actualWidths", {
        get: function () { return this._actualWidths; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "actualX", {
        get: function () { return this._actualX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "actualY", {
        get: function () { return this._actualY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "height", {
        get: function () { return this._height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "width", {
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "x", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "y", {
        get: function () { return this._y; },
        enumerable: true,
        configurable: true
    });
    return Component;
}(Spec));
exports.Component = Component;
var Container = (function (_super) {
    __extends(Container, _super);
    function Container(node) {
        var _this = this;
        _super.call(this, node);
        this._children = new Array();
        if (this.nodeChildDict[XML_CHILDREN]) {
            PrintUtil.forEachChildNode(this.nodeChildDict[XML_CHILDREN], function (n) {
                var c = ComponentFactory.fromNode(n);
                if (c) {
                    _this._children.push(c);
                }
            });
        }
    }
    Object.defineProperty(Container.prototype, "children", {
        get: function () { return this._children; },
        enumerable: true,
        configurable: true
    });
    ;
    return Container;
}(Component));
exports.Container = Container;
var Property = (function (_super) {
    __extends(Property, _super);
    function Property(node) {
        _super.call(this, node);
    }
    return Property;
}(Spec));
exports.Property = Property;
;
/**
 * *********************************
 */
(function (AspectMode) {
    AspectMode[AspectMode["None"] = 0] = "None";
    AspectMode[AspectMode["Fit"] = 1] = "Fit";
    AspectMode[AspectMode["Fill"] = 2] = "Fill";
})(exports.AspectMode || (exports.AspectMode = {}));
var AspectMode = exports.AspectMode;
;
(function (BindingType) {
    BindingType[BindingType["Data"] = 0] = "Data";
    BindingType[BindingType["Meta"] = 1] = "Meta";
})(exports.BindingType || (exports.BindingType = {}));
var BindingType = exports.BindingType;
(function (FormMode) {
    FormMode[FormMode["Display"] = 0] = "Display";
    FormMode[FormMode["Edit"] = 1] = "Edit";
})(exports.FormMode || (exports.FormMode = {}));
var FormMode = exports.FormMode;
;
(function (ResizeMode) {
    ResizeMode[ResizeMode["Stretch"] = 0] = "Stretch";
    ResizeMode[ResizeMode["Tile"] = 1] = "Tile";
})(exports.ResizeMode || (exports.ResizeMode = {}));
var ResizeMode = exports.ResizeMode;
;
(function (RichNumUsage) {
    RichNumUsage[RichNumUsage["Undefined"] = 0] = "Undefined";
    RichNumUsage[RichNumUsage["Absolute"] = 1] = "Absolute";
    RichNumUsage[RichNumUsage["FillParent"] = 2] = "FillParent";
    RichNumUsage[RichNumUsage["HorizontalCenter"] = 3] = "HorizontalCenter";
    RichNumUsage[RichNumUsage["HorizontalLeft"] = 4] = "HorizontalLeft";
    RichNumUsage[RichNumUsage["HorizontalRight"] = 5] = "HorizontalRight";
    RichNumUsage[RichNumUsage["PercentOfParent"] = 6] = "PercentOfParent";
    RichNumUsage[RichNumUsage["Remainder"] = 7] = "Remainder";
    RichNumUsage[RichNumUsage["VerticalBottom"] = 8] = "VerticalBottom";
    RichNumUsage[RichNumUsage["VerticalCenter"] = 9] = "VerticalCenter";
    RichNumUsage[RichNumUsage["VerticalTop"] = 10] = "VerticalTop";
})(exports.RichNumUsage || (exports.RichNumUsage = {}));
var RichNumUsage = exports.RichNumUsage;
(function (TextAlignment) {
    TextAlignment[TextAlignment["Left"] = 0] = "Left";
    TextAlignment[TextAlignment["Center"] = 1] = "Center";
    TextAlignment[TextAlignment["Right"] = 2] = "Right";
})(exports.TextAlignment || (exports.TextAlignment = {}));
var TextAlignment = exports.TextAlignment;
(function (ValuePlacement) {
    ValuePlacement[ValuePlacement["absolute"] = 0] = "absolute";
    ValuePlacement[ValuePlacement["none"] = 1] = "none";
})(exports.ValuePlacement || (exports.ValuePlacement = {}));
var ValuePlacement = exports.ValuePlacement;
(function (ValueType) {
    ValueType[ValueType["Undefined"] = 0] = "Undefined";
    ValueType[ValueType["Boolean"] = 1] = "Boolean";
    ValueType[ValueType["Date"] = 2] = "Date";
    ValueType[ValueType["DateTime"] = 3] = "DateTime";
    ValueType[ValueType["Decimal"] = 4] = "Decimal";
    ValueType[ValueType["Float"] = 5] = "Float";
    ValueType[ValueType["Integer"] = 6] = "Integer";
    ValueType[ValueType["LargeBinary"] = 7] = "LargeBinary";
    ValueType[ValueType["LargeString"] = 8] = "LargeString";
    ValueType[ValueType["String"] = 9] = "String";
    ValueType[ValueType["Time"] = 10] = "Time";
})(exports.ValueType || (exports.ValueType = {}));
var ValueType = exports.ValueType;
var Binding = (function (_super) {
    __extends(Binding, _super);
    function Binding(node) {
        _super.call(this, node);
        this._type = BindingType.Data;
        this._path = PrintUtil.singleChildText(node);
    }
    ;
    Object.defineProperty(Binding.prototype, "path", {
        get: function () { return this._path; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "type", {
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    return Binding;
}(Property));
exports.Binding = Binding;
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ASPECT_MODE], function (n) { _this._aspectMode = PrintUtil.enumValue(n, AspectMode); });
        PrintUtil.ifChild(this.nodeChildDict[XML_CAP_INSETS], function (n) { _this._capInsets = new Edges(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_RESIZE_MODE], function (n) { _this._resizeMode = PrintUtil.enumValue(n, ResizeMode); });
        PrintUtil.ifChild(this.nodeChildDict[XML_URL], function (n) { _this._URLString = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ENABLED_IN_READ_MODE], function (n) { _this._enabledInReadMode = PrintUtil.singleChildBoolean(node); });
    }
    Object.defineProperty(Button.prototype, "aspectMode", {
        get: function () { return this._aspectMode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "capInsets", {
        get: function () { return this._capInsets; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "resizeMode", {
        get: function () { return this._resizeMode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "URLString", {
        get: function () { return this._URLString; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "enableInReadMode", {
        get: function () { return this._enabledInReadMode; },
        enumerable: true,
        configurable: true
    });
    return Button;
}(Component));
exports.Button = Button;
var CaptureBounds = (function (_super) {
    __extends(CaptureBounds, _super);
    function CaptureBounds(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_HEIGHT], function (n) { _this._height = PrintUtil.singleChildNumber(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_WIDTH], function (n) { _this._width = PrintUtil.singleChildNumber(n); });
    }
    Object.defineProperty(CaptureBounds.prototype, "height", {
        get: function () { return this._height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CaptureBounds.prototype, "width", {
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    return CaptureBounds;
}(Property));
exports.CaptureBounds = CaptureBounds;
var Cell = (function (_super) {
    __extends(Cell, _super);
    function Cell(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BORDER_COLOR], function (n) { _this._borderColor = new Color(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_BORDER_WIDTHS], function (n) { _this._borderWidths = new Edges(n); });
    }
    Object.defineProperty(Cell.prototype, "borderColor", {
        get: function () { return this._borderColor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "borderWidths", {
        get: function () { return this._borderWidths; },
        enumerable: true,
        configurable: true
    });
    return Cell;
}(Container));
exports.Cell = Cell;
var Checkbox = (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_CHECKED_COLOR], function (n) { _this._checkedColor = new Color(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) { _this._entrySeq = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_COLOR], function (n) { _this._lineColor = new Color(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_WIDTH], function (n) { _this._lineWidth = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_RADIO_GROUP], function (n) { _this._radioGroup = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_UNCHECKED_COLOR], function (n) { _this._uncheckedColor = new Color(node); });
    }
    Object.defineProperty(Checkbox.prototype, "checkedColor", {
        get: function () { return this._checkedColor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "entrySeq", {
        get: function () { return this._entrySeq; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "lineColor", {
        get: function () { return this._lineColor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "lineWidth", {
        get: function () { return this._lineWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "radioGroup", {
        get: function () { return this._radioGroup; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "uncheckedColor", {
        get: function () { return this._uncheckedColor; },
        enumerable: true,
        configurable: true
    });
    return Checkbox;
}(Component));
exports.Checkbox = Checkbox;
var Color = (function (_super) {
    __extends(Color, _super);
    function Color(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_RED], function (n) { _this._red = PrintUtil.singleChildNumber(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_BLUE], function (n) { _this._blue = PrintUtil.singleChildNumber(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_GREEN], function (n) { _this._green = PrintUtil.singleChildNumber(n); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ALPHA], function (n) { _this._alpha = PrintUtil.singleChildNumber(n); });
    }
    Object.defineProperty(Color.prototype, "alpha", {
        get: function () { return this._alpha; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "red", {
        get: function () { return this._red; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "green", {
        get: function () { return this._green; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "blue", {
        get: function () { return this._blue; },
        enumerable: true,
        configurable: true
    });
    return Color;
}(Spec));
exports.Color = Color;
var DatePicker = (function (_super) {
    __extends(DatePicker, _super);
    function DatePicker(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) { _this._entrySeq = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) { _this._bold = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) { _this._text = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) { _this._textAlignment = PrintUtil.enumValue(node, TextAlignment); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) { _this._textColor = new Color(node); });
    }
    Object.defineProperty(DatePicker.prototype, "entrySeq", {
        get: function () { return this._entrySeq; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "bold", {
        get: function () { return this._bold; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "text", {
        get: function () { return this._text; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "textAlignment", {
        get: function () { return this._textAlignment; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "textColor", {
        get: function () { return this._textColor; },
        enumerable: true,
        configurable: true
    });
    return DatePicker;
}(Component));
exports.DatePicker = DatePicker;
var Edges = (function (_super) {
    __extends(Edges, _super);
    function Edges(node, top, left, bottom, right) {
        var _this = this;
        _super.call(this, node);
        if (node) {
            PrintUtil.ifChild(this.nodeChildDict[XML_TOP], function (n) { _this._top = PrintUtil.singleChildNumber(n); });
            PrintUtil.ifChild(this.nodeChildDict[XML_LEFT], function (n) { _this._left = PrintUtil.singleChildNumber(n); });
            PrintUtil.ifChild(this.nodeChildDict[XML_BOTTOM], function (n) { _this._bottom = PrintUtil.singleChildNumber(n); });
            PrintUtil.ifChild(this.nodeChildDict[XML_RIGHT], function (n) { _this._right = PrintUtil.singleChildNumber(n); });
        }
        else {
            this._top = top;
            this._left = left;
            this._bottom = bottom;
            this._right = right;
        }
    }
    Object.defineProperty(Edges.prototype, "top", {
        get: function () { return this._top; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edges.prototype, "left", {
        get: function () { return this._left; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edges.prototype, "bottom", {
        get: function () { return this._bottom; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edges.prototype, "right", {
        get: function () { return this._right; },
        enumerable: true,
        configurable: true
    });
    return Edges;
}(Spec));
exports.Edges = Edges;
var Form = (function (_super) {
    __extends(Form, _super);
    function Form(node) {
        _super.call(this, node);
    }
    Object.defineProperty(Form.prototype, "hideControlFraming", {
        get: function () { return this._hideControlFraming; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "hideSaveCancelButtons", {
        get: function () { return this._hideSaveCancelButtons; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "settings", {
        get: function () { return this._settings; },
        enumerable: true,
        configurable: true
    });
    return Form;
}(Container));
exports.Form = Form;
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.apply(this, arguments);
    }
    return Grid;
}(Container));
exports.Grid = Grid;
var Image = (function (_super) {
    __extends(Image, _super);
    function Image(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_ANNOTATIONS], function (n) { _this._allowAnnotations = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_PICKER], function (n) { _this._allowPicker = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ALLOW_PICK_OPTIONS], function (n) { _this._allowPickOptions = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ASPECT_MODE], function (n) { _this._aspectMode = PrintUtil.enumValue(node, AspectMode); });
        PrintUtil.ifChild(this.nodeChildDict[XML_CAP_INSETS], function (n) { _this._capInsets = new Edges(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_RESIZE_MODE], function (n) { _this._resizeMode = PrintUtil.enumValue(node, ResizeMode); });
        PrintUtil.ifChild(this.nodeChildDict[XML_URL], function (n) { _this._urlString = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_CAPTURE_BOUNDS], function (n) { _this._captureBounds = new CaptureBounds(node); });
    }
    Object.defineProperty(Image.prototype, "allowAnnotations", {
        get: function () { return this._allowAnnotations; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "allowPicker", {
        get: function () { return this._allowPicker; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "allowPickOptions", {
        get: function () { return this._allowPickOptions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "aspectMode", {
        get: function () { return this._aspectMode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "capInsets", {
        get: function () { return this._capInsets; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "resizeMode", {
        get: function () { return this._resizeMode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "urlString", {
        get: function () { return this._urlString; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "capatureBounds", {
        get: function () { return this._captureBounds; },
        enumerable: true,
        configurable: true
    });
    return Image;
}(Component));
exports.Image = Image;
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) { _this._bold = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], function (n) { _this._italic = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], function (n) { _this._underline = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], function (n) { _this._numberOfLines = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) { _this._text = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) { _this._textAlignment = PrintUtil.enumValue(node, TextAlignment); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) { _this._textColor = new Color(node); });
    }
    Object.defineProperty(Label.prototype, "bold", {
        get: function () { return this._bold; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "italic", {
        get: function () { return this._italic; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "underline", {
        get: function () { return this._underline; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "numberOfLines", {
        get: function () { return this._numberOfLines; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "text", {
        get: function () { return this._text; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "textAlignment", {
        get: function () { return this._textAlignment; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "textColor", {
        get: function () { return this._textColor; },
        enumerable: true,
        configurable: true
    });
    return Label;
}(Component));
exports.Label = Label;
var Layout = (function (_super) {
    __extends(Layout, _super);
    function Layout(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_UOM], function (n) { _this._uom = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_COLUMN], function (n) { _this._column = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ROW], function (n) { _this._row = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_SIZE], function (n) {
            _this._heights = PrintUtil.arrayOfNumbers(n, "Height");
            _this._widths = PrintUtil.arrayOfNumbers(n, "Width");
        });
        PrintUtil.ifChild(this.nodeChildDict[XML_ORIGIN], function (n) {
            PrintUtil.forEachChildNode(n, function (n2) {
                switch (n2.nodeName) {
                    case "X":
                        _this._x = PrintUtil.singleChildNumber(n2);
                        break;
                    case "Y":
                        _this._y = PrintUtil.singleChildNumber(n2);
                        break;
                }
            });
        });
    }
    Object.defineProperty(Layout.prototype, "uom", {
        get: function () { return this._uom; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "heights", {
        get: function () { return this._heights; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "widths", {
        get: function () { return this._widths; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "x", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "y", {
        get: function () { return this._y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "column", {
        get: function () { return this._column; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "row", {
        get: function () { return this._row; },
        enumerable: true,
        configurable: true
    });
    return Layout;
}(Spec));
exports.Layout = Layout;
var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        _super.apply(this, arguments);
    }
    return Page;
}(Container));
exports.Page = Page;
var Settings = (function (_super) {
    __extends(Settings, _super);
    function Settings(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_REFRESH_TIMER], function (n) { _this._refreshTimer = PrintUtil.singleChildNumber(node); });
    }
    Object.defineProperty(Settings.prototype, "refreshTimer", {
        get: function () { return this._refreshTimer; },
        enumerable: true,
        configurable: true
    });
    return Settings;
}(Spec));
exports.Settings = Settings;
var SignatureCapture = (function (_super) {
    __extends(SignatureCapture, _super);
    function SignatureCapture(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_CAPTURE_BOUNDS], function (n) { _this._captureBounds = new CaptureBounds(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_LINE_COLOR], function (n) { _this._lineColor = new Color(node); });
    }
    Object.defineProperty(SignatureCapture.prototype, "captureBounds", {
        get: function () { return this._captureBounds; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignatureCapture.prototype, "lineColor", {
        get: function () { return this._lineColor; },
        enumerable: true,
        configurable: true
    });
    return SignatureCapture;
}(Component));
exports.SignatureCapture = SignatureCapture;
var TextArea = (function (_super) {
    __extends(TextArea, _super);
    function TextArea(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) { _this._entrySeq = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) { _this._bold = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], function (n) { _this._italic = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], function (n) { _this._underline = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], function (n) { _this._numberOfLines = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) { _this._text = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) { _this._textColor = new Color(node); });
    }
    Object.defineProperty(TextArea.prototype, "entrySeq", {
        get: function () { return this._entrySeq; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "bold", {
        get: function () { return this._bold; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "italic", {
        get: function () { return this._italic; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "underline", {
        get: function () { return this._underline; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "numberOfLines", {
        get: function () { return this._numberOfLines; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "text", {
        get: function () { return this._text; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextArea.prototype, "textColor", {
        get: function () { return this._textColor; },
        enumerable: true,
        configurable: true
    });
    return TextArea;
}(Component));
exports.TextArea = TextArea;
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) { _this._entrySeq = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) { _this._bold = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_ITALIC], function (n) { _this._italic = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_UNDERLINE], function (n) { _this._underline = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], function (n) { _this._numberOfLines = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) { _this._text = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) { _this._textAlignment = PrintUtil.enumValue(node, TextAlignment); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) { _this._textColor = new Color(node); });
    }
    Object.defineProperty(TextField.prototype, "entrySeq", {
        get: function () { return this._entrySeq; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "bold", {
        get: function () { return this._bold; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "italic", {
        get: function () { return this._italic; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "underline", {
        get: function () { return this._underline; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "numberOfLines", {
        get: function () { return this._numberOfLines; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "text", {
        get: function () { return this._text; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textAlignment", {
        get: function () { return this._textAlignment; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textColor", {
        get: function () { return this._textColor; },
        enumerable: true,
        configurable: true
    });
    return TextField;
}(Component));
exports.TextField = TextField;
var TimePicker = (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) { _this._entrySeq = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) { _this._bold = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) { _this._text = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) { _this._textAlignment = PrintUtil.enumValue(node, TextAlignment); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) { _this._textColor = new Color(node); });
    }
    Object.defineProperty(TimePicker.prototype, "entrySeq", {
        get: function () { return this._entrySeq; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "bold", {
        get: function () { return this._bold; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "text", {
        get: function () { return this._text; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "textAlignment", {
        get: function () { return this._textAlignment; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "textColor", {
        get: function () { return this._textColor; },
        enumerable: true,
        configurable: true
    });
    return TimePicker;
}(Component));
exports.TimePicker = TimePicker;
var ValuePicker = (function (_super) {
    __extends(ValuePicker, _super);
    function ValuePicker(node) {
        var _this = this;
        _super.call(this, node);
        PrintUtil.ifChild(this.nodeChildDict[XML_ENTRY_SEQ], function (n) { _this._entrySeq = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_BOLD], function (n) { _this._bold = PrintUtil.singleChildBoolean(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_NUMBER_OF_LINES], function (n) { _this._numberOfLines = PrintUtil.singleChildNumber(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT], function (n) { _this._text = PrintUtil.singleChildText(node); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_ALIGNMENT], function (n) { _this._textAlignment = PrintUtil.enumValue(node, TextAlignment); });
        PrintUtil.ifChild(this.nodeChildDict[XML_TEXT_COLOR], function (n) { _this._textColor = new Color(node); });
    }
    Object.defineProperty(ValuePicker.prototype, "entrySeq", {
        get: function () { return this._entrySeq; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "bold", {
        get: function () { return this._bold; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "numberOfLines", {
        get: function () { return this._numberOfLines; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "text", {
        get: function () { return this._text; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "textAlignment", {
        get: function () { return this._textAlignment; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValuePicker.prototype, "textColor", {
        get: function () { return this._textColor; },
        enumerable: true,
        configurable: true
    });
    return ValuePicker;
}(Component));
exports.ValuePicker = ValuePicker;
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
var ComponentFactory = (function () {
    function ComponentFactory() {
    }
    ComponentFactory.fromNode = function (node) {
        var answer = null;
        switch (node.nodeName) {
            case XML_BUTTON:
                answer = new Button(node);
                break;
            case XML_CHECKBOX:
                answer = new Checkbox(node);
                break;
            case XML_IMAGE:
                answer = new Image(node);
                break;
            case XML_LABEL:
                answer = new Label(node);
                break;
            case XML_SIGNATURE_CAPTURE:
                answer = new SignatureCapture(node);
                break;
            case XML_TEXT_AREA:
                answer = new TextArea(node);
                break;
            case XML_TEXT_FIELD:
                answer = new TextField(node);
                break;
            case XML_TIME_PICKER:
                answer = new TimePicker(node);
                break;
            case XML_VALUE_PICKER:
                answer = new ValuePicker(node);
                break;
            case XML_CELL:
                answer = new Cell(node);
                break;
            case XML_FORM:
                answer = new Form(node);
                break;
            case XML_GRID:
                answer = new Grid(node);
                break;
            case XML_PAGE:
                answer = new Page(node);
                break;
        }
        return answer;
    };
    return ComponentFactory;
}());
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var PrintUtil = (function () {
    function PrintUtil() {
    }
    PrintUtil.arrayOfNumbers = function (node, name) {
        var answer = [];
        PrintUtil.forEachChildNode(node, function (n) {
            if (n.nodeName == name) {
                answer.push(PrintUtil.singleChildNumber(n));
            }
        });
        return answer;
    };
    PrintUtil.enumValue = function (node, e) {
        var answer = null;
        var sv = PrintUtil.singleChildText(node);
        if (sv) {
            var nv = e[sv];
            if (!isNaN(nv)) {
                answer = e[nv];
            }
        }
        return answer;
    };
    PrintUtil.forEachChildNode = function (node, f) {
        for (var i = 0; i < node.childNodes.length; i++) {
            f(node.childNodes[i]);
        }
    };
    PrintUtil.ifChild = function (node, f) {
        if (node) {
            f(node);
        }
    };
    PrintUtil.singleChildBoolean = function (node) {
        var text = PrintUtil.singleChildText(node);
        if (text) {
            return text.toLocaleLowerCase() == "true";
        }
        else {
            return false;
        }
    };
    PrintUtil.singleChildNumber = function (node) {
        var answer = NaN;
        if (node.childNodes.length != 1) {
            util_1.Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        }
        else if (node.childNodes[0].nodeName != "#text") {
            util_1.Log.error("XML error with " + node.nodeName + ".  Expected numeric node.");
        }
        else {
            answer = parseInt(node.childNodes[0].textContent);
        }
        return answer;
    };
    PrintUtil.singleChildText = function (node) {
        if (node.childNodes.length != 1) {
            var text = "ExpectedExactlyOneNode";
            util_1.Log.error("XML error with " + node.nodeName + ".  Expected exactly one child node.");
        }
        else if (node.childNodes[0].nodeName != "#text") {
            text = "ExpectedNodeText";
            util_1.Log.error("XML error with " + node.nodeName + ".  Expected text node.");
        }
        else {
            text = node.childNodes[0].textContent;
        }
        return text;
    };
    return PrintUtil;
}());
/**
 * *********************************
 */
/**
 * *********************************
 */
