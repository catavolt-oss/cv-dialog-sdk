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

            return xOpenFr.bind((formXOpen:XOpenEditorModelResult)=>{

                var formXOpenFr = Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
                var formXFormDefFr = this.fetchXFormDef(formXOpen);
                var formMenuDefsFr = DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, this.sessionContext);
                //var formChildrenFr
                return formXFormDefFr.bind((xFormDef:XFormDef)=>{

                    var childrenXOpenFr = this.openChildren(formXOpen);
                    var childrenXPaneDefsFr = this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                    var childrenActiveColDefsFr = this.fetchChildrenActiveColDefs(formXOpen);
                    var childrenMenuDefsFr = this.fetchChildrenMenuDefs(fromXOpen);

                    //debug
                    return childrenActiveColDefsFr.bind((value:Array<Try<XGetActiveColumnDefsResult>>)=>{
                      Log.debug('activeColDefsResult  is :' + ObjUtil.formatRecAttr(value));
                        return Future.createSuccessfulFuture('FormContextBuilder::build', new FormContext());
                    });
                });


            });

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
                    return DialogService.getQuery
                }
            });
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
