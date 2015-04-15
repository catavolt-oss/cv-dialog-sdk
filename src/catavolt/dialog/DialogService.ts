/**
 * Created by rburson on 4/14/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class DialogService {

        private static EDITOR_SERVICE_NAME:string = 'EditorService';
        private static EDITOR_SERVICE_PATH:string = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
        private static QUERY_SERVICE_NAME:string = 'QueryService';
        private static QUERY_SERVICE_PATH:string = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;

        static getActiveColumnDefs(dialogHandle:DialogHandle,
                                   sessionContext:SessionContext):Future<XGetActiveColumnDefsResult> {

            var method = 'getActiveColumnDefs';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')};
            var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
              return Future.createCompletedFuture('getActiveColumnDefs',
                  DialogTriple.fromWSDialogObject<XGetActiveColumnDefsResult>(result, 'WSGetActiveColumnDefsResult',
                      OType.factoryFn));
            });
        }

        /*
        static getEditorModelMenuDefs(dialogHandle:DialogHandle,
                                      sessionContext:SessionContext):Future<List<MenuDef>> {

        }

        static getEditorModelPaneDef(dialogHandle:DialogHandle,
                                     paneId:string,
                                     sessionContext:SessionContext):Future<XPaneDef> {

        }

        static getQueryModelMenuDefs(dialogHandle:DialogHandle,
                                     sessionContext:SessionContext):Future<List<MenuDef>> {

        }*/

        static openEditorModelFromRedir(redirection:DialogRedirection,
                                        sessionContext:SessionContext):Future<XOpenEditorModelResult> {

            var method = 'open2';
            var params:StringDictionary = {'editorMode':redirection.dialogMode,
                'dialogHandle':OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')};
            if(redirection.objectId) params['objectId'] = redirection.objectId;

            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                Log.debug('got result ' + Log.formatRecString(result));
                return Future.createCompletedFuture('openEditorModelFromRedir',
                    DialogTriple.fromWSDialogObject<XOpenEditorModelResult>(result, 'WSOpenEditorModelResult', OType.factoryFn));
            });

        }

        /*
        static openQueryModelFromRedir(redirection:DialogRedirection,
                                       sessionContext:SessionContext):Future<XOpenQueryModelResult> {

        }
        */

    }
}