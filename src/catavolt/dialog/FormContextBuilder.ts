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

            return xOpenFr.bind((result)=>{
                Log.debug(Log.formatRecString(result));
                return Future.createSuccessfulFuture('FormContextBuilder::build', new FormContext());
            });

        }

        get dialogRedirection():DialogRedirection {
            return this._dialogRedirection;
        }

        get sessionContext():SessionContext {
            return this._sessionContext;
        }

    }
}
