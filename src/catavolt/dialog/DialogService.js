/**
 * Created by rburson on 4/14/15.
 */
var PaneMode_1 = require("./PaneMode");
var Future_1 = require("../fp/Future");
var OType_1 = require("./OType");
var Request_1 = require("../ws/Request");
var DialogTriple_1 = require("./DialogTriple");
var Success_1 = require("../fp/Success");
var Prop_1 = require("./Prop");
var QueryContext_1 = require("./QueryContext");
var Log_1 = require("../util/Log");
var Either_1 = require("../fp/Either");
var DialogService = (function () {
    function DialogService() {
    }
    DialogService.changePaneMode = function (dialogHandle, paneMode, sessionContext) {
        var method = 'changePaneMode';
        var params = {
            'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'paneMode': PaneMode_1.PaneMode[paneMode]
        };
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('changePaneMode', DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSChangePaneModeResult', OType_1.OType.factoryFn));
        });
    };
    DialogService.closeEditorModel = function (dialogHandle, sessionContext) {
        var method = 'close';
        var params = { 'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createSuccessfulFuture('closeEditorModel', result);
        });
    };
    DialogService.getAvailableValues = function (dialogHandle, propertyName, pendingWrites, sessionContext) {
        var method = 'getAvailableValues';
        var params = {
            'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName
        };
        if (pendingWrites)
            params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('getAvailableValues', DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSGetAvailableValuesResult', OType_1.OType.factoryFn));
        });
    };
    DialogService.getActiveColumnDefs = function (dialogHandle, sessionContext) {
        var method = 'getActiveColumnDefs';
        var params = { 'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Request_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('getActiveColumnDefs', DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSGetActiveColumnDefsResult', OType_1.OType.factoryFn));
        });
    };
    DialogService.getEditorModelMenuDefs = function (dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('getEditorModelMenuDefs', DialogTriple_1.DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', OType_1.OType.factoryFn));
        });
    };
    DialogService.getEditorModelPaneDef = function (dialogHandle, paneId, sessionContext) {
        var method = 'getPaneDef';
        var params = { 'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        params['paneId'] = paneId;
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('getEditorModelPaneDef', DialogTriple_1.DialogTriple.fromWSDialogObjectResult(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', OType_1.OType.factoryFn));
        });
    };
    DialogService.getQueryModelMenuDefs = function (dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Request_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('getQueryModelMenuDefs', DialogTriple_1.DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', OType_1.OType.factoryFn));
        });
    };
    DialogService.openEditorModelFromRedir = function (redirection, sessionContext) {
        var method = 'open2';
        var params = {
            'editorMode': redirection.dialogMode,
            'dialogHandle': OType_1.OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')
        };
        if (redirection.objectId)
            params['objectId'] = redirection.objectId;
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('openEditorModelFromRedir', DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSOpenEditorModelResult', OType_1.OType.factoryFn));
        });
    };
    DialogService.openQueryModelFromRedir = function (redirection, sessionContext) {
        if (!redirection.isQuery)
            return Future_1.Future.createFailedFuture('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
        var method = 'open';
        var params = { 'dialogHandle': OType_1.OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
        var call = Request_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('openQueryModelFromRedir', DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSOpenQueryModelResult', OType_1.OType.factoryFn));
        });
    };
    DialogService.performEditorAction = function (dialogHandle, actionId, pendingWrites, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (pendingWrites)
            params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var redirectionTry = DialogTriple_1.DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new Success_1.Success(r);
            }
            return Future_1.Future.createCompletedFuture('performEditorAction', redirectionTry);
        });
    };
    DialogService.performQueryAction = function (dialogHandle, actionId, targets, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (targets) {
            params['targets'] = targets;
        }
        var call = Request_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var redirectionTry = DialogTriple_1.DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new Success_1.Success(r);
            }
            return Future_1.Future.createCompletedFuture('performQueryAction', redirectionTry);
        });
    };
    DialogService.processSideEffects = function (dialogHandle, sessionContext, propertyName, propertyValue, pendingWrites) {
        var method = 'handlePropertyChange';
        var params = {
            'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'propertyValue': Prop_1.Prop.toWSProperty(propertyValue),
            'pendingWrites': pendingWrites.toWSEditorRecord()
        };
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('processSideEffects', DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSHandlePropertyChangeResult', OType_1.OType.factoryFn));
        });
    };
    DialogService.queryQueryModel = function (dialogHandle, direction, maxRows, fromObjectId, sessionContext) {
        var method = 'query';
        var params = {
            'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'maxRows': maxRows,
            'direction': direction === QueryContext_1.QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
        };
        if (fromObjectId && fromObjectId.trim() !== '') {
            params['fromObjectId'] = fromObjectId.trim();
        }
        Log_1.Log.info('Running query');
        var call = Request_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var call = Request_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return Future_1.Future.createCompletedFuture('DialogService::queryQueryModel', DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSQueryResult', OType_1.OType.factoryFn));
        });
    };
    DialogService.readEditorModel = function (dialogHandle, sessionContext) {
        var method = 'read';
        var params = { 'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture('readEditorModel', DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSReadResult', OType_1.OType.factoryFn));
        });
    };
    DialogService.writeEditorModel = function (dialogHandle, entityRec, sessionContext) {
        var method = 'write';
        var params = {
            'dialogHandle': OType_1.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'editorRecord': entityRec.toWSEditorRecord()
        };
        var call = Request_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var writeResultTry = DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSWriteResult', OType_1.OType.factoryFn);
            if (writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                var redirection = writeResultTry.success.left;
                redirection.fromDialogProperties = result['dialogProperties'] || {};
                writeResultTry = new Success_1.Success(Either_1.Either.left(redirection));
            }
            return Future_1.Future.createCompletedFuture('writeEditorModel', writeResultTry);
        });
    };
    DialogService.EDITOR_SERVICE_NAME = 'EditorService';
    DialogService.EDITOR_SERVICE_PATH = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
    DialogService.QUERY_SERVICE_NAME = 'QueryService';
    DialogService.QUERY_SERVICE_PATH = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;
    return DialogService;
})();
exports.DialogService = DialogService;
