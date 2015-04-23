/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class FormContextBuilder {

        constructor(private _dialogRedirection:DialogRedirection,
                    private _actionSource:ActionSource,
                    private _sessionContext:SessionContext){}

        get actionSource():ActionSource {
            return this._actionSource;
        }

        build():Future<FormContext> {
            if(!this.dialogRedirection.isEditor) {
               return Future.createFailedFuture<FormContext>('FormContextBuilder::build', 'Forms with a root query model are not supported');
            }
            var xOpenFr = DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);

            var openAllFr:Future<Array<Try<any>>> = xOpenFr.bind((formXOpen:XOpenEditorModelResult)=>{

                var formXOpenFr = Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
                var formXFormDefFr = this.fetchXFormDef(formXOpen);
                var formMenuDefsFr = DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, this.sessionContext);
                var formChildrenFr = formXFormDefFr.bind((xFormDef:XFormDef)=>{
                    var childrenXOpenFr = this.openChildren(formXOpen);
                    var childrenXPaneDefsFr = this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                    var childrenActiveColDefsFr = this.fetchChildrenActiveColDefs(formXOpen);
                    var childrenMenuDefsFr = this.fetchChildrenMenuDefs(formXOpen);
                    return Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
                });
                return Future.sequence<any>([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
            });

            return openAllFr.bind((value:Array<Try<any>>)=>{
                var formDefTry = this.completeOpenPromise(value);

                var formContextTry:Try<FormContext> = null;
                if(formDefTry.isFailure) {
                   formContextTry = new Failure<FormContext>(formDefTry.failure);
                } else {
                    var formDef:FormDef = formDefTry.success;

                }

                Log.debug('openall value is :' + ObjUtil.formatRecAttr(value));
                return Future.createSuccessfulFuture('FormContextBuilder::build', new FormContext());
            });

        }

        private completeOpenPromise(openAllResults:Array<Try<any>>):Try<FormDef> {

            var flattenedTry:Try<Array<any>> = Try.flatten(openAllResults);
            if (flattenedTry.isFailure) {
                return new Failure<FormDef>('FormContextBuilder::build: ' + ObjUtil.formatRecAttr(flattenedTry.failure));
            }
            var flattened = flattenedTry.success;

            if(flattened.length != 4) return new Failure<FormDef>('FormContextBuilder::build: Open form should have resulted in 4 elements');

            var formXOpen:XOpenEditorModelResult = flattened[0];
            var formXFormDef:XFormDef = flattened[1];
            var formMenuDefs:Array<MenuDef> = flattened[2];
            var formChildren:Array<any> = flattened[3];

            if(formChildren.length != 4) return new Failure<FormDef>('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');

            var childrenXOpens:Array<XOpenDialogModelResult> = formChildren[0];
            var childrenXPaneDefs:Array<XPaneDef> = formChildren[1];
            var childrenXActiveColDefs:Array<XGetActiveColumnDefsResult> = formChildren[2];
            var childrenMenuDefs:Array<Array<MenuDef>> = formChildren[3];

            return FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens,
                childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);

        }

        get dialogRedirection():DialogRedirection {
            return this._dialogRedirection;
        }

        get sessionContext():SessionContext {
            return this._sessionContext;
        }

        private fetchChildrenActiveColDefs(formXOpen:XOpenEditorModelResult):Future<Array<Try<XGetActiveColumnDefsResult>>> {
            var xComps = formXOpen.formModel.children;
            var seqOfFutures:Array<Future<XGetActiveColumnDefsResult>> = xComps.map((xComp:XFormModelComp)=>{
               if(xComp.redirection.isQuery) {
                  return DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, this.sessionContext);
               } else {
                   return Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
               }
            });
            return Future.sequence(seqOfFutures);
        }

        private fetchChildrenMenuDefs(formXOpen:XOpenEditorModelResult):Future<Array<Try<Array<MenuDef>>>> {
            var xComps = formXOpen.formModel.children;
            var seqOfFutures = xComps.map((xComp:XFormModelComp)=>{
                if(xComp.redirection.isEditor) {
                   return DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
                } else {
                    return DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
                }
            });
            return Future.sequence(seqOfFutures);
        }

        private fetchChildrenXPaneDefs(formXOpen:XOpenEditorModelResult, xFormDef:XFormDef):Future<Array<Try<XPaneDef>>> {

            var formHandle:DialogHandle = formXOpen.formModel.form.redirection.dialogHandle;
            var xRefs = xFormDef.paneDefRefs;
            var seqOfFutures:Array<Future<XPaneDef>> = xRefs.map((xRef:XPaneDefRef)=>{
                return DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, this.sessionContext);
            });
            return Future.sequence(seqOfFutures);
        }

        private fetchXFormDef(xformOpenResult:XOpenEditorModelResult):Future<XFormDef> {
            var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
            var formPaneId = xformOpenResult.formPaneId;
            return DialogService.getEditorModelPaneDef(dialogHandle, formPaneId,
                this.sessionContext).bind((value:XPaneDef)=>{
                    if(value instanceof XFormDef) {
                        return Future.createSuccessfulFuture('fetchXFormDef/success', value);
                    } else {
                        return Future.createFailedFuture<XFormDef>('fetchXFormDef/failure',
                            'Expected reponse to contain an XFormDef but got ' + ObjUtil.formatRecAttr(value));
                    }
            });

        }

        private openChildren(formXOpen:XOpenEditorModelResult):Future<Array<Try<XOpenDialogModelResult>>> {
            var xComps = formXOpen.formModel.children;
            var seqOfFutures:Array<Future<XOpenDialogModelResult>> = [];
            xComps.forEach((nextXComp:XFormModelComp)=>{
               var nextFr = null;
              if(nextXComp.redirection.isEditor) {
                 nextFr = DialogService.openEditorModelFromRedir(nextXComp.redirection, this.sessionContext);
              } else {
                 nextFr = DialogService.openQueryModelFromRedir(nextXComp.redirection, this.sessionContext);
              }
                seqOfFutures.push(nextFr);
            });
            return Future.sequence<XOpenDialogModelResult>(seqOfFutures);
        }

    }
}
