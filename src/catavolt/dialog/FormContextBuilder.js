/**
 * Created by rburson on 3/30/15.
 */
var Future_1 = require("../fp/Future");
var FormContext_1 = require("./FormContext");
var DialogService_1 = require("./DialogService");
var Try_1 = require("../fp/Try");
var XFormDef_1 = require("./XFormDef");
var Failure_1 = require("../fp/Failure");
var FormDef_1 = require("./FormDef");
var Success_1 = require("../fp/Success");
var ObjUtil_1 = require("../util/ObjUtil");
var GeoLocationContext_1 = require("./GeoLocationContext");
var GeoLocationDef_1 = require("./GeoLocationDef");
var GeoFixContext_1 = require("./GeoFixContext");
var GeoFixDef_1 = require("./GeoFixDef");
var BarcodeScanContext_1 = require("./BarcodeScanContext");
var BarcodeScanDef_1 = require("./BarcodeScanDef");
var ImagePickerContext_1 = require("./ImagePickerContext");
var ListDef_1 = require("./ListDef");
var ListContext_1 = require("./ListContext");
var DetailsDef_1 = require("./DetailsDef");
var DetailsContext_1 = require("./DetailsContext");
var MapDef_1 = require("./MapDef");
var MapContext_1 = require("./MapContext");
var GraphDef_1 = require("./GraphDef");
var GraphContext_1 = require("./GraphContext");
var CalendarDef_1 = require("./CalendarDef");
var CalendarContext_1 = require("./CalendarContext");
var ImagePickerDef_1 = require("./ImagePickerDef");
var FormContextBuilder = (function () {
    function FormContextBuilder(_dialogRedirection, _actionSource, _sessionContext) {
        this._dialogRedirection = _dialogRedirection;
        this._actionSource = _actionSource;
        this._sessionContext = _sessionContext;
    }
    Object.defineProperty(FormContextBuilder.prototype, "actionSource", {
        get: function () {
            return this._actionSource;
        },
        enumerable: true,
        configurable: true
    });
    FormContextBuilder.prototype.build = function () {
        var _this = this;
        if (!this.dialogRedirection.isEditor) {
            return Future_1.Future.createFailedFuture('FormContextBuilder::build', 'Forms with a root query model are not supported');
        }
        var xOpenFr = DialogService_1.DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);
        var openAllFr = xOpenFr.bind(function (formXOpen) {
            var formXOpenFr = Future_1.Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
            var formXFormDefFr = _this.fetchXFormDef(formXOpen);
            var formMenuDefsFr = DialogService_1.DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, _this.sessionContext);
            var formChildrenFr = formXFormDefFr.bind(function (xFormDef) {
                var childrenXOpenFr = _this.openChildren(formXOpen);
                var childrenXPaneDefsFr = _this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                var childrenActiveColDefsFr = _this.fetchChildrenActiveColDefs(formXOpen);
                var childrenMenuDefsFr = _this.fetchChildrenMenuDefs(formXOpen);
                return Future_1.Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
            });
            return Future_1.Future.sequence([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
        });
        return openAllFr.bind(function (value) {
            var formDefTry = _this.completeOpenPromise(value);
            var formContextTry = null;
            if (formDefTry.isFailure) {
                formContextTry = new Failure_1.Failure(formDefTry.failure);
            }
            else {
                var formDef = formDefTry.success;
                var childContexts = _this.createChildrenContexts(formDef);
                var formContext = new FormContext_1.FormContext(_this.dialogRedirection, _this._actionSource, formDef, childContexts, false, false, _this.sessionContext);
                formContextTry = new Success_1.Success(formContext);
            }
            return Future_1.Future.createCompletedFuture('FormContextBuilder::build', formContextTry);
        });
    };
    Object.defineProperty(FormContextBuilder.prototype, "dialogRedirection", {
        get: function () {
            return this._dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContextBuilder.prototype, "sessionContext", {
        get: function () {
            return this._sessionContext;
        },
        enumerable: true,
        configurable: true
    });
    FormContextBuilder.prototype.completeOpenPromise = function (openAllResults) {
        var flattenedTry = Try_1.Try.flatten(openAllResults);
        if (flattenedTry.isFailure) {
            return new Failure_1.Failure('FormContextBuilder::build: ' + ObjUtil_1.ObjUtil.formatRecAttr(flattenedTry.failure));
        }
        var flattened = flattenedTry.success;
        if (flattened.length != 4)
            return new Failure_1.Failure('FormContextBuilder::build: Open form should have resulted in 4 elements');
        var formXOpen = flattened[0];
        var formXFormDef = flattened[1];
        var formMenuDefs = flattened[2];
        var formChildren = flattened[3];
        if (formChildren.length != 4)
            return new Failure_1.Failure('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');
        var childrenXOpens = formChildren[0];
        var childrenXPaneDefs = formChildren[1];
        var childrenXActiveColDefs = formChildren[2];
        var childrenMenuDefs = formChildren[3];
        return FormDef_1.FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);
    };
    FormContextBuilder.prototype.createChildrenContexts = function (formDef) {
        var result = [];
        formDef.childrenDefs.forEach(function (paneDef, i) {
            if (paneDef instanceof ListDef_1.ListDef) {
                result.push(new ListContext_1.ListContext(i));
            }
            else if (paneDef instanceof DetailsDef_1.DetailsDef) {
                result.push(new DetailsContext_1.DetailsContext(i));
            }
            else if (paneDef instanceof MapDef_1.MapDef) {
                result.push(new MapContext_1.MapContext(i));
            }
            else if (paneDef instanceof GraphDef_1.GraphDef) {
                result.push(new GraphContext_1.GraphContext(i));
            }
            else if (paneDef instanceof CalendarDef_1.CalendarDef) {
                result.push(new CalendarContext_1.CalendarContext(i));
            }
            else if (paneDef instanceof ImagePickerDef_1.ImagePickerDef) {
                result.push(new ImagePickerContext_1.ImagePickerContext(i));
            }
            else if (paneDef instanceof BarcodeScanDef_1.BarcodeScanDef) {
                result.push(new BarcodeScanContext_1.BarcodeScanContext(i));
            }
            else if (paneDef instanceof GeoFixDef_1.GeoFixDef) {
                result.push(new GeoFixContext_1.GeoFixContext(i));
            }
            else if (paneDef instanceof GeoLocationDef_1.GeoLocationDef) {
                result.push(new GeoLocationContext_1.GeoLocationContext(i));
            }
        });
        return result;
    };
    FormContextBuilder.prototype.fetchChildrenActiveColDefs = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map(function (xComp) {
            if (xComp.redirection.isQuery) {
                return DialogService_1.DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            }
            else {
                return Future_1.Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
            }
        });
        return Future_1.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchChildrenMenuDefs = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map(function (xComp) {
            if (xComp.redirection.isEditor) {
                return DialogService_1.DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            }
            else {
                return DialogService_1.DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            }
        });
        return Future_1.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchChildrenXPaneDefs = function (formXOpen, xFormDef) {
        var _this = this;
        var formHandle = formXOpen.formModel.form.redirection.dialogHandle;
        var xRefs = xFormDef.paneDefRefs;
        var seqOfFutures = xRefs.map(function (xRef) {
            return DialogService_1.DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, _this.sessionContext);
        });
        return Future_1.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchXFormDef = function (xformOpenResult) {
        var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
        var formPaneId = xformOpenResult.formPaneId;
        return DialogService_1.DialogService.getEditorModelPaneDef(dialogHandle, formPaneId, this.sessionContext).bind(function (value) {
            if (value instanceof XFormDef_1.XFormDef) {
                return Future_1.Future.createSuccessfulFuture('fetchXFormDef/success', value);
            }
            else {
                return Future_1.Future.createFailedFuture('fetchXFormDef/failure', 'Expected reponse to contain an XFormDef but got ' + ObjUtil_1.ObjUtil.formatRecAttr(value));
            }
        });
    };
    FormContextBuilder.prototype.openChildren = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = [];
        xComps.forEach(function (nextXComp) {
            var nextFr = null;
            if (nextXComp.redirection.isEditor) {
                nextFr = DialogService_1.DialogService.openEditorModelFromRedir(nextXComp.redirection, _this.sessionContext);
            }
            else {
                nextFr = DialogService_1.DialogService.openQueryModelFromRedir(nextXComp.redirection, _this.sessionContext);
            }
            seqOfFutures.push(nextFr);
        });
        return Future_1.Future.sequence(seqOfFutures);
    };
    return FormContextBuilder;
})();
exports.FormContextBuilder = FormContextBuilder;
