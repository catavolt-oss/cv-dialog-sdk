/**
 * Created by rburson on 3/30/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var FormDef = (function (_super) {
            __extends(FormDef, _super);
            function FormDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _formLayout, _formStyle, _borderStyle, _headerDef, _childrenDefs) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._formLayout = _formLayout;
                this._formStyle = _formStyle;
                this._borderStyle = _borderStyle;
                this._headerDef = _headerDef;
                this._childrenDefs = _childrenDefs;
            }
            FormDef.fromOpenFormResult = function (formXOpenResult, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs) {
                var settings = { 'open': true };
                ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties, settings);
                var headerDef = null;
                var childrenDefs = [];
                for (var i = 0; i < childrenXOpens.length; i++) {
                    var childXOpen = childrenXOpens[i];
                    var childXPaneDef = childrenXPaneDefs[i];
                    var childXActiveColDefs = childrenXActiveColDefs[i];
                    var childMenuDefs = childrenMenuDefs[i];
                    var childXComp = formXOpenResult.formModel.children[i];
                    var childXPaneDefRef = formXFormDef.paneDefRefs[i];
                    var paneDefTry = dialog.PaneDef.fromOpenPaneResult(childXOpen, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs);
                    if (paneDefTry.isFailure) {
                        return new Failure(paneDefTry.failure);
                    }
                    else {
                        childrenDefs.push(paneDefTry.success);
                    }
                }
                return new Success(new FormDef(formXFormDef.paneId, formXFormDef.name, formXOpenResult.formModel.form.label, formXFormDef.title, formMenuDefs, formXOpenResult.entityRecDef, formXOpenResult.formRedirection, settings, formXFormDef.formLayout, formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childrenDefs));
            };
            Object.defineProperty(FormDef.prototype, "borderStyle", {
                get: function () {
                    return this._borderStyle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "childrenDefs", {
                get: function () {
                    return this._childrenDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "formLayout", {
                get: function () {
                    return this._formLayout;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "formStyle", {
                get: function () {
                    return this._formStyle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "headerDef", {
                get: function () {
                    return this._headerDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isFlowingLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'FLOWING';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isFlowingTopDownLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'FLOWING_TOP_DOWN';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isFourBoxSquareLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isHorizontalLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'H';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isOptionsFormLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'OPTIONS_FORM';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isTabsLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'TABS';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isThreeBoxOneLeftLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'THREE_ONE_LEFT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isThreeBoxOneOverLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'THREE_ONE_OVER';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isThreeBoxOneRightLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'THREE_ONE_RIGHT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isThreeBoxOneUnderLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'THREE_ONE_UNDER';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isTopDownLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'TOP_DOWN';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isTwoVerticalLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'H(2,V)';
                },
                enumerable: true,
                configurable: true
            });
            return FormDef;
        })(dialog.PaneDef);
        dialog.FormDef = FormDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
