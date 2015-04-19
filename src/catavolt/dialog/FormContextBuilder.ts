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
                //@TODO Test this!
                var formXFormDefFr = this.fetchXFormDef(formXOpen);

                return formXFormDefFr.bind((value)=>{
                    Log.debug('formDef is :' + ObjUtil.formatRecAttr(value));
                    return Future.createSuccessfulFuture('FormContextBuilder::build', new FormContext());
                });
            });

        }

        get dialogRedirection():DialogRedirection {
            return this._dialogRedirection;
        }

        get sessionContext():SessionContext {
            return this._sessionContext;
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

    }
}
