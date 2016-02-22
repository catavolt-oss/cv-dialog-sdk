/**
 * Created by rburson on 3/30/15.
 */
import { Future } from "../fp/Future";
import { FormContext } from "./FormContext";
import { DialogService } from "./DialogService";
import { Try } from "../fp/Try";
import { XFormDef } from "./XFormDef";
import { Failure } from "../fp/Failure";
import { FormDef } from "./FormDef";
import { Success } from "../fp/Success";
import { ObjUtil } from "../util/ObjUtil";
import { GeoLocationContext } from "./GeoLocationContext";
import { GeoLocationDef } from "./GeoLocationDef";
import { GeoFixContext } from "./GeoFixContext";
import { GeoFixDef } from "./GeoFixDef";
import { BarcodeScanContext } from "./BarcodeScanContext";
import { BarcodeScanDef } from "./BarcodeScanDef";
import { ImagePickerContext } from "./ImagePickerContext";
import { ListDef } from "./ListDef";
import { ListContext } from "./ListContext";
import { DetailsDef } from "./DetailsDef";
import { DetailsContext } from "./DetailsContext";
import { MapDef } from "./MapDef";
import { MapContext } from "./MapContext";
import { GraphDef } from "./GraphDef";
import { GraphContext } from "./GraphContext";
import { CalendarDef } from "./CalendarDef";
import { CalendarContext } from "./CalendarContext";
import { ImagePickerDef } from "./ImagePickerDef";
export class FormContextBuilder {
    constructor(_dialogRedirection, _actionSource, _sessionContext) {
        this._dialogRedirection = _dialogRedirection;
        this._actionSource = _actionSource;
        this._sessionContext = _sessionContext;
    }
    get actionSource() {
        return this._actionSource;
    }
    build() {
        if (!this.dialogRedirection.isEditor) {
            return Future.createFailedFuture('FormContextBuilder::build', 'Forms with a root query model are not supported');
        }
        var xOpenFr = DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);
        var openAllFr = xOpenFr.bind((formXOpen) => {
            var formXOpenFr = Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
            var formXFormDefFr = this.fetchXFormDef(formXOpen);
            var formMenuDefsFr = DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, this.sessionContext);
            var formChildrenFr = formXFormDefFr.bind((xFormDef) => {
                var childrenXOpenFr = this.openChildren(formXOpen);
                var childrenXPaneDefsFr = this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                var childrenActiveColDefsFr = this.fetchChildrenActiveColDefs(formXOpen);
                var childrenMenuDefsFr = this.fetchChildrenMenuDefs(formXOpen);
                return Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
            });
            return Future.sequence([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
        });
        return openAllFr.bind((value) => {
            var formDefTry = this.completeOpenPromise(value);
            var formContextTry = null;
            if (formDefTry.isFailure) {
                formContextTry = new Failure(formDefTry.failure);
            }
            else {
                var formDef = formDefTry.success;
                var childContexts = this.createChildrenContexts(formDef);
                var formContext = new FormContext(this.dialogRedirection, this._actionSource, formDef, childContexts, false, false, this.sessionContext);
                formContextTry = new Success(formContext);
            }
            return Future.createCompletedFuture('FormContextBuilder::build', formContextTry);
        });
    }
    get dialogRedirection() {
        return this._dialogRedirection;
    }
    get sessionContext() {
        return this._sessionContext;
    }
    completeOpenPromise(openAllResults) {
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
        return FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);
    }
    createChildrenContexts(formDef) {
        var result = [];
        formDef.childrenDefs.forEach((paneDef, i) => {
            if (paneDef instanceof ListDef) {
                result.push(new ListContext(i));
            }
            else if (paneDef instanceof DetailsDef) {
                result.push(new DetailsContext(i));
            }
            else if (paneDef instanceof MapDef) {
                result.push(new MapContext(i));
            }
            else if (paneDef instanceof GraphDef) {
                result.push(new GraphContext(i));
            }
            else if (paneDef instanceof CalendarDef) {
                result.push(new CalendarContext(i));
            }
            else if (paneDef instanceof ImagePickerDef) {
                result.push(new ImagePickerContext(i));
            }
            else if (paneDef instanceof BarcodeScanDef) {
                result.push(new BarcodeScanContext(i));
            }
            else if (paneDef instanceof GeoFixDef) {
                result.push(new GeoFixContext(i));
            }
            else if (paneDef instanceof GeoLocationDef) {
                result.push(new GeoLocationContext(i));
            }
        });
        return result;
    }
    fetchChildrenActiveColDefs(formXOpen) {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map((xComp) => {
            if (xComp.redirection.isQuery) {
                return DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, this.sessionContext);
            }
            else {
                return Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
            }
        });
        return Future.sequence(seqOfFutures);
    }
    fetchChildrenMenuDefs(formXOpen) {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map((xComp) => {
            if (xComp.redirection.isEditor) {
                return DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
            }
            else {
                return DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
            }
        });
        return Future.sequence(seqOfFutures);
    }
    fetchChildrenXPaneDefs(formXOpen, xFormDef) {
        var formHandle = formXOpen.formModel.form.redirection.dialogHandle;
        var xRefs = xFormDef.paneDefRefs;
        var seqOfFutures = xRefs.map((xRef) => {
            return DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, this.sessionContext);
        });
        return Future.sequence(seqOfFutures);
    }
    fetchXFormDef(xformOpenResult) {
        var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
        var formPaneId = xformOpenResult.formPaneId;
        return DialogService.getEditorModelPaneDef(dialogHandle, formPaneId, this.sessionContext).bind((value) => {
            if (value instanceof XFormDef) {
                return Future.createSuccessfulFuture('fetchXFormDef/success', value);
            }
            else {
                return Future.createFailedFuture('fetchXFormDef/failure', 'Expected reponse to contain an XFormDef but got ' + ObjUtil.formatRecAttr(value));
            }
        });
    }
    openChildren(formXOpen) {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = [];
        xComps.forEach((nextXComp) => {
            var nextFr = null;
            if (nextXComp.redirection.isEditor) {
                nextFr = DialogService.openEditorModelFromRedir(nextXComp.redirection, this.sessionContext);
            }
            else {
                nextFr = DialogService.openQueryModelFromRedir(nextXComp.redirection, this.sessionContext);
            }
            seqOfFutures.push(nextFr);
        });
        return Future.sequence(seqOfFutures);
    }
}
