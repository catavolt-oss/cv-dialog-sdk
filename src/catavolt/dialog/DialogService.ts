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

        static changePaneMode(dialogHandle:DialogHandle, paneMode:PaneMode,
                              sessionContext:SessionContext):Future<XChangePaneModeResult> {
            var method = 'changePaneMode';
            var params:StringDictionary = {
                'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                'paneMode':PaneMode[paneMode]
            };
            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                return Future.createCompletedFuture('changePaneMode',
                    DialogTriple.fromWSDialogObject<XChangePaneModeResult>(result, 'WSChangePaneModeResult', OType.factoryFn)
                );
            });
        }

        static closeEditorModel(dialogHandle:DialogHandle, sessionContext:SessionContext):Future<VoidResult> {

            var method = 'close';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')};
            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                return Future.createSuccessfulFuture<VoidResult>('closeEditorModel', result);
            });
        }

        static getAvailableValues(dialogHandle:DialogHandle, propertyName:string, pendingWrites:EntityRec,
                                  sessionContext:SessionContext):Future<XGetAvailableValuesResult> {

            var method = 'getAvailableValues';
            var params:StringDictionary = {
                'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                'propertyName':propertyName
            };
            if(pendingWrites) params['pendingWrites'] = pendingWrites.toWSEditorRecord();
            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                return Future.createCompletedFuture('getAvailableValues',
                    DialogTriple.fromWSDialogObject<XGetAvailableValuesResult>(result, 'WSGetAvailableValuesResult',
                        OType.factoryFn));
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

        static performQueryAction(dialogHandle:DialogHandle, actionId:string, targets:Array<string>,
                                  sessionContext:SessionContext):Future<Redirection> {

            var method = 'performAction';
            var params:StringDictionary = {
                'actionId':actionId,
                'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')
            };
            if(targets) {
               params['targets'] = targets;
            }
            var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
                if(redirectionTry.isSuccess) {
                    var r = redirectionTry.success;
                    r.fromDialogProperties = result['dialogProperties'];
                    redirectionTry = new Success(r);
                }
                return Future.createCompletedFuture('performQueryAction', redirectionTry);
            });
        }

        static processSideEffects(dialogHandle:DialogHandle, sessionContext:SessionContext,
                                  propertyName:string, propertyValue:any, pendingWrites:EntityRec):Future<XPropertyChangeResult> {

            var method = 'handlePropertyChange';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                'propertyName':propertyName,
                'propertyValue':Prop.toWSProperty(propertyValue),
                'pendingWrites':pendingWrites.toWSEditorRecord()
            };

            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
               return Future.createCompletedFuture<XPropertyChangeResult>('processSideEffects', DialogTriple.fromWSDialogObject<XPropertyChangeResult>(result,
                   'WSHandlePropertyChangeResult', OType.factoryFn));
            });
        }

        static queryQueryModel(dialogHandle:DialogHandle,
                               direction:QueryDirection,
                               maxRows:number,
                               fromObjectId:string,
                               sessionContext:SessionContext):Future<XQueryResult> {

            var method = 'query';
            var params:StringDictionary = {
                'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                'maxRows':maxRows,
                'direction':direction === QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
            };
            if(fromObjectId && fromObjectId.trim() !== '') {
               params['fromObjectId'] = fromObjectId.trim();
            }

            Log.info('Running query');
            var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return Future.createCompletedFuture('DialogService::queryQueryModel',
                    DialogTriple.fromWSDialogObject<XQueryResult>(result, 'WSQueryResult', OType.factoryFn));
            });

        }

        static readEditorModel(dialogHandle:DialogHandle, sessionContext:SessionContext):Future<XReadResult> {

            var method = 'read';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle')};
            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind<XReadResult>((result:StringDictionary)=>{
                return Future.createCompletedFuture('readEditorModel',
                    DialogTriple.fromWSDialogObject<XReadResult>(result, 'WSReadResult', OType.factoryFn));
            });
        }

        static writeEditorModel(dialogHandle:DialogHandle, entityRec:EntityRec,
                                sessionContext:SessionContext):Future<Either<Redirection,XWriteResult>> {
            var method = 'write';
            var params:StringDictionary = {'dialogHandle':OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                'editorRecord':entityRec.toWSEditorRecord()
            };

            var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind((result:StringDictionary)=>{
                var writeResultTry:Try<Either<Redirection,XWriteResult>> =
                    DialogTriple.fromWSDialogObject<Either<Redirection,XWriteResult>>(result, 'WSWriteResult', OType.factoryFn);
                    if(writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                        var redirection = writeResultTry.success.left;
                        redirection.fromDialogProperties = result['dialogProperties'] || {};
                        writeResultTry = new Success(Either.left<Redirection, XWriteResult>(redirection));
                    }
                return Future.createCompletedFuture('writeEditorModel', writeResultTry);
            });
        }

    }
}