/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
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
                    return Future.createFailedFuture('FormContextBuilder::build', 'Forms with a root query model are not supported');
                }
                var xOpenFr = dialog.DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);
                var openAllFr = xOpenFr.bind(function (formXOpen) {
                    var formXOpenFr = Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
                    var formXFormDefFr = _this.fetchXFormDef(formXOpen);
                    var formMenuDefsFr = dialog.DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, _this.sessionContext);
                    var formChildrenFr = formXFormDefFr.bind(function (xFormDef) {
                        var childrenXOpenFr = _this.openChildren(formXOpen);
                        var childrenXPaneDefsFr = _this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                        var childrenActiveColDefsFr = _this.fetchChildrenActiveColDefs(formXOpen);
                        var childrenMenuDefsFr = _this.fetchChildrenMenuDefs(formXOpen);
                        return Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
                    });
                    return Future.sequence([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
                });
                return openAllFr.bind(function (value) {
                    var formDefTry = _this.completeOpenPromise(value);
                    var formContextTry = null;
                    if (formDefTry.isFailure) {
                        formContextTry = new Failure(formDefTry.failure);
                    }
                    else {
                        var formDef = formDefTry.success;
                        var childContexts = _this.createChildrenContexts(formDef);
                        var formContext = new dialog.FormContext(_this.dialogRedirection, _this._actionSource, formDef, childContexts, false, false, _this.sessionContext);
                        formContextTry = new Success(formContext);
                    }
                    return Future.createCompletedFuture('FormContextBuilder::build', formContextTry);
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
                var flattenedTry = Try.flatten(openAllResults);
                if (flattenedTry.isFailure) {
                    return new Failure('FormContextBuilder::build: ' + ObjUtil.formatRecAttr(flattenedTry.failure));
                }
                var flattened = flattenedTry.success;
                if (flattened.length != 4)
                    return new Failure('FormContextBuilder::build: Open form should have resulted in 4 elements');
                var formXOpen = flattened[0];
                var formXFormDef = flattened[1];
                var formMenuDefs = flattened[2];
                var formChildren = flattened[3];
                if (formChildren.length != 4)
                    return new Failure('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');
                var childrenXOpens = formChildren[0];
                var childrenXPaneDefs = formChildren[1];
                var childrenXActiveColDefs = formChildren[2];
                var childrenMenuDefs = formChildren[3];
                return dialog.FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);
            };
            FormContextBuilder.prototype.createChildrenContexts = function (formDef) {
                var result = [];
                formDef.childrenDefs.forEach(function (paneDef, i) {
                    if (paneDef instanceof dialog.ListDef) {
                        result.push(new dialog.ListContext(i));
                    }
                    else if (paneDef instanceof dialog.DetailsDef) {
                        result.push(new dialog.DetailsContext(i));
                    }
                    else if (paneDef instanceof dialog.MapDef) {
                        result.push(new dialog.MapContext(i));
                    }
                    else if (paneDef instanceof dialog.GraphDef) {
                        result.push(new dialog.GraphContext(i));
                    }
                    else if (paneDef instanceof dialog.CalendarDef) {
                        result.push(new dialog.CalendarContext(i));
                    }
                    else if (paneDef instanceof dialog.ImagePickerDef) {
                        result.push(new dialog.ImagePickerContext(i));
                    }
                    else if (paneDef instanceof dialog.BarcodeScanDef) {
                        result.push(new dialog.BarcodeScanContext(i));
                    }
                    else if (paneDef instanceof dialog.GeoFixDef) {
                        result.push(new dialog.GeoFixContext(i));
                    }
                    else if (paneDef instanceof dialog.GeoLocationDef) {
                        result.push(new dialog.GeoLocationContext(i));
                    }
                });
                return result;
            };
            FormContextBuilder.prototype.fetchChildrenActiveColDefs = function (formXOpen) {
                var _this = this;
                var xComps = formXOpen.formModel.children;
                var seqOfFutures = xComps.map(function (xComp) {
                    if (xComp.redirection.isQuery) {
                        return dialog.DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, _this.sessionContext);
                    }
                    else {
                        return Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
                    }
                });
                return Future.sequence(seqOfFutures);
            };
            FormContextBuilder.prototype.fetchChildrenMenuDefs = function (formXOpen) {
                var _this = this;
                var xComps = formXOpen.formModel.children;
                var seqOfFutures = xComps.map(function (xComp) {
                    if (xComp.redirection.isEditor) {
                        return dialog.DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
                    }
                    else {
                        return dialog.DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
                    }
                });
                return Future.sequence(seqOfFutures);
            };
            FormContextBuilder.prototype.fetchChildrenXPaneDefs = function (formXOpen, xFormDef) {
                var _this = this;
                var formHandle = formXOpen.formModel.form.redirection.dialogHandle;
                var xRefs = xFormDef.paneDefRefs;
                var seqOfFutures = xRefs.map(function (xRef) {
                    return dialog.DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, _this.sessionContext);
                });
                return Future.sequence(seqOfFutures);
            };
            FormContextBuilder.prototype.fetchXFormDef = function (xformOpenResult) {
                var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
                var formPaneId = xformOpenResult.formPaneId;
                return dialog.DialogService.getEditorModelPaneDef(dialogHandle, formPaneId, this.sessionContext).bind(function (value) {
                    if (value instanceof dialog.XFormDef) {
                        return Future.createSuccessfulFuture('fetchXFormDef/success', value);
                    }
                    else {
                        return Future.createFailedFuture('fetchXFormDef/failure', 'Expected reponse to contain an XFormDef but got ' + ObjUtil.formatRecAttr(value));
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
                        nextFr = dialog.DialogService.openEditorModelFromRedir(nextXComp.redirection, _this.sessionContext);
                    }
                    else {
                        nextFr = dialog.DialogService.openQueryModelFromRedir(nextXComp.redirection, _this.sessionContext);
                    }
                    seqOfFutures.push(nextFr);
                });
                return Future.sequence(seqOfFutures);
            };
            return FormContextBuilder;
        })();
        dialog.FormContextBuilder = FormContextBuilder;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
