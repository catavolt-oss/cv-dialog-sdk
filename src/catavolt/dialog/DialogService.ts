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

        static closeEditorModel(dialogHandle:DialogHandle, sessionContext:SessionContext):Future<VoidResult> {

            var method = 'close';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')};
            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                return Future.createSuccessfulFuture<VoidResult>('closeEditorModel', result);
            });
        }

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

        static getEditorModelMenuDefs(dialogHandle:DialogHandle,
                                      sessionContext:SessionContext):Future<Array<MenuDef>> {

            var method = 'getMenuDefs';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')};
            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                return Future.createCompletedFuture('getEditorModelMenuDefs',
                    DialogTriple.fromWSDialogObjectsResult<MenuDef>(result, 'WSGetMenuDefsResult', 'WSMenuDef',
                        'menuDefs', OType.factoryFn));
            });
        }

        static getEditorModelPaneDef(dialogHandle:DialogHandle,
                                     paneId:string,
                                     sessionContext:SessionContext):Future<XPaneDef> {

            var method = 'getPaneDef';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')};
            params['paneId'] = paneId;
            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind<XPaneDef>((result:StringDictionary)=>{
                return Future.createCompletedFuture<XPaneDef>('getEditorModelPaneDef',
                    DialogTriple.fromWSDialogObjectResult<XPaneDef>(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', OType.factoryFn));
            });
        }

        static getQueryModelMenuDefs(dialogHandle:DialogHandle,
                                     sessionContext:SessionContext):Future<Array<MenuDef>> {
            var method = 'getMenuDefs';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')};
            var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                return Future.createCompletedFuture('getQueryModelMenuDefs',
                    DialogTriple.fromWSDialogObjectsResult<MenuDef>(result, 'WSGetMenuDefsResult', 'WSMenuDef',
                        'menuDefs', OType.factoryFn));
            });
        }

        static openEditorModelFromRedir(redirection:DialogRedirection,
                                        sessionContext:SessionContext):Future<XOpenEditorModelResult> {

            var method = 'open2';
            var params:StringDictionary = {'editorMode':redirection.dialogMode,
                'dialogHandle':OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')};
            if(redirection.objectId) params['objectId'] = redirection.objectId;

            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                return Future.createCompletedFuture('openEditorModelFromRedir',
                    DialogTriple.fromWSDialogObject<XOpenEditorModelResult>(result, 'WSOpenEditorModelResult', OType.factoryFn));
            });

        }

        static openQueryModelFromRedir(redirection:DialogRedirection,
                                       sessionContext:SessionContext):Future<XOpenQueryModelResult> {

            if(!redirection.isQuery) return Future.createFailedFuture<XOpenQueryModelResult>('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
            var method = 'open';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')};

            var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                return Future.createCompletedFuture('openQueryModelFromRedir',
                    DialogTriple.fromWSDialogObject<XOpenQueryModelResult>(result, 'WSOpenQueryModelResult', OType.factoryFn));
            });

        }

        static performEditorAction(dialogHandle:DialogHandle, actionId:string,
                                   pendingWrites:EntityRec, sessionContext:SessionContext):Future<Redirection> {

            var method = 'performAction';
            var params:StringDictionary = {'actionId':actionId, 'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')};
            if(pendingWrites) params['pendingWrites'] = pendingWrites.toWSEditorRecord();

            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
                if(redirectionTry.isSuccess) {
                    var r = redirectionTry.success;
                    r.fromDialogProperties = result['dialogProperties'];
                    redirectionTry = new Success(r);
                }
                return Future.createCompletedFuture('performEditorAction', redirectionTry);
            });
        }

    }
}