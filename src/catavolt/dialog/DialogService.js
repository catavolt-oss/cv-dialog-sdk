/**
 * Created by rburson on 4/14/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogService = (function () {
            function DialogService() {
            }
            DialogService.changePaneMode = function (dialogHandle, paneMode, sessionContext) {
                var method = 'changePaneMode';
                var params = {
                    'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'paneMode': dialog.PaneMode[paneMode]
                };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('changePaneMode', dialog.DialogTriple.fromWSDialogObject(result, 'WSChangePaneModeResult', dialog.OType.factoryFn));
                });
            };
            DialogService.closeEditorModel = function (dialogHandle, sessionContext) {
                var method = 'close';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createSuccessfulFuture('closeEditorModel', result);
                });
            };
            DialogService.getAvailableValues = function (dialogHandle, propertyName, pendingWrites, sessionContext) {
                var method = 'getAvailableValues';
                var params = {
                    'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'propertyName': propertyName
                };
                if (pendingWrites)
                    params['pendingWrites'] = pendingWrites.toWSEditorRecord();
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getAvailableValues', dialog.DialogTriple.fromWSDialogObject(result, 'WSGetAvailableValuesResult', dialog.OType.factoryFn));
                });
            };
            DialogService.getActiveColumnDefs = function (dialogHandle, sessionContext) {
                var method = 'getActiveColumnDefs';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getActiveColumnDefs', dialog.DialogTriple.fromWSDialogObject(result, 'WSGetActiveColumnDefsResult', dialog.OType.factoryFn));
                });
            };
            DialogService.getEditorModelMenuDefs = function (dialogHandle, sessionContext) {
                var method = 'getMenuDefs';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getEditorModelMenuDefs', dialog.DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', dialog.OType.factoryFn));
                });
            };
            DialogService.getEditorModelPaneDef = function (dialogHandle, paneId, sessionContext) {
                var method = 'getPaneDef';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                params['paneId'] = paneId;
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getEditorModelPaneDef', dialog.DialogTriple.fromWSDialogObjectResult(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', dialog.OType.factoryFn));
                });
            };
            DialogService.getQueryModelMenuDefs = function (dialogHandle, sessionContext) {
                var method = 'getMenuDefs';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getQueryModelMenuDefs', dialog.DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', dialog.OType.factoryFn));
                });
            };
            DialogService.openEditorModelFromRedir = function (redirection, sessionContext) {
                var method = 'open2';
                var params = { 'editorMode': redirection.dialogMode,
                    'dialogHandle': dialog.OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
                if (redirection.objectId)
                    params['objectId'] = redirection.objectId;
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('openEditorModelFromRedir', dialog.DialogTriple.fromWSDialogObject(result, 'WSOpenEditorModelResult', dialog.OType.factoryFn));
                });
            };
            DialogService.openQueryModelFromRedir = function (redirection, sessionContext) {
                if (!redirection.isQuery)
                    return Future.createFailedFuture('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
                var method = 'open';
                var params = { 'dialogHandle': dialog.OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('openQueryModelFromRedir', dialog.DialogTriple.fromWSDialogObject(result, 'WSOpenQueryModelResult', dialog.OType.factoryFn));
                });
            };
            DialogService.performEditorAction = function (dialogHandle, actionId, pendingWrites, sessionContext) {
                var method = 'performAction';
                var params = { 'actionId': actionId, 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                if (pendingWrites)
                    params['pendingWrites'] = pendingWrites.toWSEditorRecord();
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    var redirectionTry = dialog.DialogTriple.extractRedirection(result, 'WSPerformActionResult');
                    if (redirectionTry.isSuccess) {
                        var r = redirectionTry.success;
                        r.fromDialogProperties = result['dialogProperties'];
                        redirectionTry = new Success(r);
                    }
                    return Future.createCompletedFuture('performEditorAction', redirectionTry);
                });
            };
            DialogService.performQueryAction = function (dialogHandle, actionId, targets, sessionContext) {
                var method = 'performAction';
                var params = {
                    'actionId': actionId,
                    'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle')
                };
                if (targets) {
                    params['targets'] = targets;
                }
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    var redirectionTry = dialog.DialogTriple.extractRedirection(result, 'WSPerformActionResult');
                    if (redirectionTry.isSuccess) {
                        var r = redirectionTry.success;
                        r.fromDialogProperties = result['dialogProperties'];
                        redirectionTry = new Success(r);
                    }
                    return Future.createCompletedFuture('performQueryAction', redirectionTry);
                });
            };
            DialogService.processSideEffects = function (dialogHandle, sessionContext, propertyName, propertyValue, pendingWrites) {
                var method = 'handlePropertyChange';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'propertyName': propertyName,
                    'propertyValue': dialog.Prop.toWSProperty(propertyValue),
                    'pendingWrites': pendingWrites.toWSEditorRecord()
                };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('processSideEffects', dialog.DialogTriple.fromWSDialogObject(result, 'WSHandlePropertyChangeResult', dialog.OType.factoryFn));
                });
            };
            DialogService.queryQueryModel = function (dialogHandle, direction, maxRows, fromObjectId, sessionContext) {
                var method = 'query';
                var params = {
                    'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'maxRows': maxRows,
                    'direction': direction === dialog.QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
                };
                if (fromObjectId && fromObjectId.trim() !== '') {
                    params['fromObjectId'] = fromObjectId.trim();
                }
                Log.info('Running query');
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                    return Future.createCompletedFuture('DialogService::queryQueryModel', dialog.DialogTriple.fromWSDialogObject(result, 'WSQueryResult', dialog.OType.factoryFn));
                });
            };
            DialogService.readEditorModel = function (dialogHandle, sessionContext) {
                var method = 'read';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('readEditorModel', dialog.DialogTriple.fromWSDialogObject(result, 'WSReadResult', dialog.OType.factoryFn));
                });
            };
            DialogService.writeEditorModel = function (dialogHandle, entityRec, sessionContext) {
                var method = 'write';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'editorRecord': entityRec.toWSEditorRecord()
                };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    var writeResultTry = dialog.DialogTriple.fromWSDialogObject(result, 'WSWriteResult', dialog.OType.factoryFn);
                    if (writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                        var redirection = writeResultTry.success.left;
                        redirection.fromDialogProperties = result['dialogProperties'] || {};
                        writeResultTry = new Success(Either.left(redirection));
                    }
                    return Future.createCompletedFuture('writeEditorModel', writeResultTry);
                });
            };
            DialogService.EDITOR_SERVICE_NAME = 'EditorService';
            DialogService.EDITOR_SERVICE_PATH = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
            DialogService.QUERY_SERVICE_NAME = 'QueryService';
            DialogService.QUERY_SERVICE_PATH = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;
            return DialogService;
        })();
        dialog.DialogService = DialogService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
