/**
 * Created by rburson on 4/14/15.
 */
import { PaneMode } from "./PaneMode";
import { Future } from "../fp/Future";
import { OType } from "./OType";
import { Call } from "../ws/Request";
import { DialogTriple } from "./DialogTriple";
import { Success } from "../fp/Success";
import { Prop } from "./Prop";
import { QueryDirection } from "./QueryContext";
import { Log } from "../util/Log";
import { Either } from "../fp/Either";
export class DialogService {
    static changePaneMode(dialogHandle, paneMode, sessionContext) {
        var method = 'changePaneMode';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'paneMode': PaneMode[paneMode]
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('changePaneMode', DialogTriple.fromWSDialogObject(result, 'WSChangePaneModeResult', OType.factoryFn));
        });
    }
    static closeEditorModel(dialogHandle, sessionContext) {
        var method = 'close';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createSuccessfulFuture('closeEditorModel', result);
        });
    }
    static getAvailableValues(dialogHandle, propertyName, pendingWrites, sessionContext) {
        var method = 'getAvailableValues';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName
        };
        if (pendingWrites)
            params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getAvailableValues', DialogTriple.fromWSDialogObject(result, 'WSGetAvailableValuesResult', OType.factoryFn));
        });
    }
    static getActiveColumnDefs(dialogHandle, sessionContext) {
        var method = 'getActiveColumnDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getActiveColumnDefs', DialogTriple.fromWSDialogObject(result, 'WSGetActiveColumnDefsResult', OType.factoryFn));
        });
    }
    static getEditorModelMenuDefs(dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getEditorModelMenuDefs', DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', OType.factoryFn));
        });
    }
    static getEditorModelPaneDef(dialogHandle, paneId, sessionContext) {
        var method = 'getPaneDef';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        params['paneId'] = paneId;
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getEditorModelPaneDef', DialogTriple.fromWSDialogObjectResult(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', OType.factoryFn));
        });
    }
    static getQueryModelMenuDefs(dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getQueryModelMenuDefs', DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', OType.factoryFn));
        });
    }
    static openEditorModelFromRedir(redirection, sessionContext) {
        var method = 'open2';
        var params = {
            'editorMode': redirection.dialogMode,
            'dialogHandle': OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')
        };
        if (redirection.objectId)
            params['objectId'] = redirection.objectId;
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('openEditorModelFromRedir', DialogTriple.fromWSDialogObject(result, 'WSOpenEditorModelResult', OType.factoryFn));
        });
    }
    static openQueryModelFromRedir(redirection, sessionContext) {
        if (!redirection.isQuery)
            return Future.createFailedFuture('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
        var method = 'open';
        var params = { 'dialogHandle': OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('openQueryModelFromRedir', DialogTriple.fromWSDialogObject(result, 'WSOpenQueryModelResult', OType.factoryFn));
        });
    }
    static performEditorAction(dialogHandle, actionId, pendingWrites, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (pendingWrites)
            params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new Success(r);
            }
            return Future.createCompletedFuture('performEditorAction', redirectionTry);
        });
    }
    static performQueryAction(dialogHandle, actionId, targets, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (targets) {
            params['targets'] = targets;
        }
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new Success(r);
            }
            return Future.createCompletedFuture('performQueryAction', redirectionTry);
        });
    }
    static processSideEffects(dialogHandle, sessionContext, propertyName, propertyValue, pendingWrites) {
        var method = 'handlePropertyChange';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'propertyValue': Prop.toWSProperty(propertyValue),
            'pendingWrites': pendingWrites.toWSEditorRecord()
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('processSideEffects', DialogTriple.fromWSDialogObject(result, 'WSHandlePropertyChangeResult', OType.factoryFn));
        });
    }
    static queryQueryModel(dialogHandle, direction, maxRows, fromObjectId, sessionContext) {
        var method = 'query';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'maxRows': maxRows,
            'direction': direction === QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
        };
        if (fromObjectId && fromObjectId.trim() !== '') {
            params['fromObjectId'] = fromObjectId.trim();
        }
        Log.info('Running query');
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return Future.createCompletedFuture('DialogService::queryQueryModel', DialogTriple.fromWSDialogObject(result, 'WSQueryResult', OType.factoryFn));
        });
    }
    static readEditorModel(dialogHandle, sessionContext) {
        var method = 'read';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('readEditorModel', DialogTriple.fromWSDialogObject(result, 'WSReadResult', OType.factoryFn));
        });
    }
    static readProperty(dialogHandle, propertyName, readSeq, readLength, sessionContext) {
        var method = 'readProperty';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'readSeq': readSeq,
            'readLength': readLength
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('readProperty', DialogTriple.fromWSDialogObject(result, 'WSReadPropertyResult', OType.factoryFn));
        });
    }
    static writeEditorModel(dialogHandle, entityRec, sessionContext) {
        var method = 'write';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'editorRecord': entityRec.toWSEditorRecord()
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            var writeResultTry = DialogTriple.fromWSDialogObject(result, 'WSWriteResult', OType.factoryFn);
            if (writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                var redirection = writeResultTry.success.left;
                redirection.fromDialogProperties = result['dialogProperties'] || {};
                writeResultTry = new Success(Either.left(redirection));
            }
            return Future.createCompletedFuture('writeEditorModel', writeResultTry);
        });
    }
    static writeProperty(dialogHandle, propertyName, data, append, sessionContext) {
        var method = 'writeProperty';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'data': data,
            'append': append
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('writeProperty', DialogTriple.fromWSDialogObject(result, 'WSWritePropertyResult', OType.factoryFn));
        });
    }
}
DialogService.EDITOR_SERVICE_NAME = 'EditorService';
DialogService.EDITOR_SERVICE_PATH = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
DialogService.QUERY_SERVICE_NAME = 'QueryService';
DialogService.QUERY_SERVICE_PATH = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;
