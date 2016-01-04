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
        var FormContext = (function (_super) {
            __extends(FormContext, _super);
            function FormContext(_dialogRedirection, _actionSource, _formDef, _childrenContexts, _offlineCapable, _offlineData, _sessionContext) {
                var _this = this;
                _super.call(this, null);
                this._dialogRedirection = _dialogRedirection;
                this._actionSource = _actionSource;
                this._formDef = _formDef;
                this._childrenContexts = _childrenContexts;
                this._offlineCapable = _offlineCapable;
                this._offlineData = _offlineData;
                this._sessionContext = _sessionContext;
                this._destroyed = false;
                this._offlineProps = {};
                this._childrenContexts = _childrenContexts || [];
                this._childrenContexts.forEach(function (c) { c.parentContext = _this; });
            }
            Object.defineProperty(FormContext.prototype, "actionSource", {
                get: function () {
                    return this.parentContext ? this.parentContext.actionSource : this._actionSource;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "childrenContexts", {
                get: function () {
                    return this._childrenContexts;
                },
                enumerable: true,
                configurable: true
            });
            FormContext.prototype.close = function () {
                return dialog.DialogService.closeEditorModel(this.dialogRedirection.dialogHandle, this.sessionContext);
            };
            Object.defineProperty(FormContext.prototype, "dialogRedirection", {
                get: function () {
                    return this._dialogRedirection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "entityRecDef", {
                get: function () {
                    return this.formDef.entityRecDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "formDef", {
                get: function () {
                    return this._formDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "headerContext", {
                get: function () {
                    throw new Error('FormContext::headerContext: Needs Impl');
                },
                enumerable: true,
                configurable: true
            });
            FormContext.prototype.performMenuAction = function (menuDef) {
                var _this = this;
                return dialog.DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, dialog.NullEntityRec.singleton, this.sessionContext).bind(function (value) {
                    var destroyedStr = value.fromDialogProperties['destroyed'];
                    if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
                        _this._destroyed = true;
                    }
                    var ca = new dialog.ContextAction(menuDef.actionId, _this.dialogRedirection.objectId, _this.actionSource);
                    return dialog.NavRequest.Util.fromRedirection(value, ca, _this.sessionContext);
                });
            };
            Object.defineProperty(FormContext.prototype, "isDestroyed", {
                get: function () {
                    return this._destroyed || this.isAnyChildDestroyed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "offlineCapable", {
                get: function () {
                    return this._offlineCapable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "menuDefs", {
                get: function () {
                    return this.formDef.menuDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "offlineProps", {
                get: function () {
                    return this._offlineProps;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "paneDef", {
                get: function () {
                    return this.formDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "sessionContext", {
                get: function () {
                    return this._sessionContext;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "isAnyChildDestroyed", {
                /** --------------------- MODULE ------------------------------*/
                //*** let's pretend this has module level visibility (no such thing (yet!))
                get: function () {
                    return this.childrenContexts.some(function (paneContext) {
                        if (paneContext instanceof dialog.EditorContext || paneContext instanceof dialog.QueryContext) {
                            return paneContext.isDestroyed;
                        }
                        return false;
                    });
                },
                enumerable: true,
                configurable: true
            });
            FormContext.prototype.processNavRequestForDestroyed = function (navRequest) {
                var fromDialogProps = {};
                if (navRequest instanceof FormContext) {
                    fromDialogProps = navRequest.offlineProps;
                }
                else if (navRequest instanceof dialog.NullNavRequest) {
                    fromDialogProps = navRequest.fromDialogProperties;
                }
                var destroyedStr = fromDialogProps['destroyed'];
                if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
                    this._destroyed = true;
                }
                var fromDialogDestroyed = fromDialogProps['fromDialogDestroyed'];
                if (fromDialogDestroyed) {
                    this._destroyed = true;
                }
            };
            return FormContext;
        })(dialog.PaneContext);
        dialog.FormContext = FormContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
