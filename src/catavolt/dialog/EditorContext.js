/**
 * Created by rburson on 4/27/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EditorState;
        (function (EditorState) {
            EditorState[EditorState["READ"] = 0] = "READ";
            EditorState[EditorState["WRITE"] = 1] = "WRITE";
            EditorState[EditorState["DESTROYED"] = 2] = "DESTROYED";
        })(EditorState || (EditorState = {}));
        ;
        var EditorContext = (function (_super) {
            __extends(EditorContext, _super);
            function EditorContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(EditorContext.prototype, "buffer", {
                get: function () {
                    if (!this._buffer) {
                        this._buffer = new dialog.EntityBuffer(dialog.NullEntityRec.singleton);
                    }
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.changePaneMode = function (paneMode) {
                var _this = this;
                return dialog.DialogService.changePaneMode(this.paneDef.dialogHandle, paneMode, this.sessionContext).bind(function (changePaneModeResult) {
                    _this.putSettings(changePaneModeResult.dialogProps);
                    if (_this.isDestroyedSetting) {
                        _this._editorState = EditorState.DESTROYED;
                    }
                    else {
                        _this.entityRecDef = changePaneModeResult.entityRecDef;
                        if (_this.isReadModeSetting) {
                            _this._editorState = EditorState.READ;
                        }
                        else {
                            _this._editorState = EditorState.WRITE;
                        }
                    }
                    return Future.createSuccessfulFuture('EditorContext::changePaneMode', _this.entityRecDef);
                });
            };
            Object.defineProperty(EditorContext.prototype, "entityRec", {
                get: function () {
                    return this._buffer.toEntityRec();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "entityRecNow", {
                get: function () {
                    return this.entityRec;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "entityRecDef", {
                get: function () {
                    return this._entityRecDef;
                },
                set: function (entityRecDef) {
                    this._entityRecDef = entityRecDef;
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.getAvailableValues = function (propName) {
                return dialog.DialogService.getAvailableValues(this.paneDef.dialogHandle, propName, this.buffer.afterEffects(), this.sessionContext).map(function (valuesResult) {
                    return valuesResult.list;
                });
            };
            EditorContext.prototype.isBinary = function (cellValueDef) {
                var propDef = this.propDefAtName(cellValueDef.propertyName);
                return propDef && (propDef.isBinaryType || (propDef.isURLType && cellValueDef.isInlineMediaStyle));
            };
            Object.defineProperty(EditorContext.prototype, "isDestroyed", {
                get: function () {
                    return this._editorState === EditorState.DESTROYED;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isReadMode", {
                get: function () {
                    return this._editorState === EditorState.READ;
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.isReadModeFor = function (propName) {
                if (!this.isReadMode) {
                    var propDef = this.propDefAtName(propName);
                    return !propDef || !propDef.maintainable || !propDef.writeEnabled;
                }
                return true;
            };
            Object.defineProperty(EditorContext.prototype, "isWriteMode", {
                get: function () {
                    return this._editorState === EditorState.WRITE;
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.performMenuAction = function (menuDef, pendingWrites) {
                var _this = this;
                return dialog.DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, pendingWrites, this.sessionContext).bind(function (redirection) {
                    var ca = new dialog.ContextAction(menuDef.actionId, _this.parentContext.dialogRedirection.objectId, _this.actionSource);
                    return dialog.NavRequest.Util.fromRedirection(redirection, ca, _this.sessionContext).map(function (navRequest) {
                        _this._settings = dialog.PaneContext.resolveSettingsFromNavRequest(_this._settings, navRequest);
                        if (_this.isDestroyedSetting) {
                            _this._editorState = EditorState.DESTROYED;
                        }
                        if (_this.isRefreshSetting) {
                            dialog.AppContext.singleton.lastMaintenanceTime = new Date();
                        }
                        return navRequest;
                    });
                });
            };
            EditorContext.prototype.processSideEffects = function (propertyName, value) {
                var _this = this;
                var sideEffectsFr = dialog.DialogService.processSideEffects(this.paneDef.dialogHandle, this.sessionContext, propertyName, value, this.buffer.afterEffects()).map(function (changeResult) {
                    return changeResult.sideEffects ? changeResult.sideEffects.entityRec : new dialog.NullEntityRec();
                });
                return sideEffectsFr.map(function (sideEffectsRec) {
                    var originalProps = _this.buffer.before.props;
                    var userEffects = _this.buffer.afterEffects().props;
                    var sideEffects = sideEffectsRec.props;
                    sideEffects = sideEffects.filter(function (prop) {
                        return prop.name !== propertyName;
                    });
                    _this._buffer = dialog.EntityBuffer.createEntityBuffer(_this.buffer.objectId, dialog.EntityRec.Util.union(originalProps, sideEffects), dialog.EntityRec.Util.union(originalProps, dialog.EntityRec.Util.union(userEffects, sideEffects)));
                    return null;
                });
            };
            EditorContext.prototype.read = function () {
                var _this = this;
                return dialog.DialogService.readEditorModel(this.paneDef.dialogHandle, this.sessionContext).map(function (readResult) {
                    _this.entityRecDef = readResult.entityRecDef;
                    return readResult.entityRec;
                }).map(function (entityRec) {
                    _this.initBuffer(entityRec);
                    _this.lastRefreshTime = new Date();
                    return entityRec;
                });
            };
            EditorContext.prototype.requestedAccuracy = function () {
                var accuracyStr = this.paneDef.settings[EditorContext.GPS_ACCURACY];
                return accuracyStr ? Number(accuracyStr) : 500;
            };
            EditorContext.prototype.requestedTimeoutSeconds = function () {
                var timeoutStr = this.paneDef.settings[EditorContext.GPS_SECONDS];
                return timeoutStr ? Number(timeoutStr) : 30;
            };
            EditorContext.prototype.write = function () {
                var _this = this;
                var result = dialog.DialogService.writeEditorModel(this.paneDef.dialogRedirection.dialogHandle, this.buffer.afterEffects(), this.sessionContext).bind(function (either) {
                    if (either.isLeft) {
                        var ca = new dialog.ContextAction('#write', _this.parentContext.dialogRedirection.objectId, _this.actionSource);
                        var navRequestFr = dialog.NavRequest.Util.fromRedirection(either.left, ca, _this.sessionContext).map(function (navRequest) {
                            return Either.left(navRequest);
                        });
                    }
                    else {
                        var writeResult = either.right;
                        _this.putSettings(writeResult.dialogProps);
                        _this.entityRecDef = writeResult.entityRecDef;
                        return Future.createSuccessfulFuture('EditorContext::write', Either.right(writeResult.entityRec));
                    }
                });
                return result.map(function (successfulWrite) {
                    var now = new Date();
                    dialog.AppContext.singleton.lastMaintenanceTime = now;
                    _this.lastRefreshTime = now;
                    if (successfulWrite.isLeft) {
                        _this._settings = dialog.PaneContext.resolveSettingsFromNavRequest(_this._settings, successfulWrite.left);
                    }
                    else {
                        _this.initBuffer(successfulWrite.right);
                    }
                    if (_this.isDestroyedSetting) {
                        _this._editorState = EditorState.DESTROYED;
                    }
                    else {
                        if (_this.isReadModeSetting) {
                            _this._editorState = EditorState.READ;
                        }
                    }
                    return successfulWrite;
                });
            };
            //Module level methods
            EditorContext.prototype.initialize = function () {
                this._entityRecDef = this.paneDef.entityRecDef;
                this._settings = ObjUtil.addAllProps(this.dialogRedirection.dialogProperties, {});
                this._editorState = this.isReadModeSetting ? EditorState.READ : EditorState.WRITE;
            };
            Object.defineProperty(EditorContext.prototype, "settings", {
                get: function () {
                    return this._settings;
                },
                enumerable: true,
                configurable: true
            });
            //Private methods
            EditorContext.prototype.initBuffer = function (entityRec) {
                this._buffer = entityRec ? new dialog.EntityBuffer(entityRec) : new dialog.EntityBuffer(dialog.NullEntityRec.singleton);
            };
            Object.defineProperty(EditorContext.prototype, "isDestroyedSetting", {
                get: function () {
                    var str = this._settings['destroyed'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isGlobalRefreshSetting", {
                get: function () {
                    var str = this._settings['globalRefresh'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isLocalRefreshSetting", {
                get: function () {
                    var str = this._settings['localRefresh'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isReadModeSetting", {
                get: function () {
                    var paneMode = this.paneModeSetting;
                    return paneMode && paneMode.toLowerCase() === 'read';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isRefreshSetting", {
                get: function () {
                    return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "paneModeSetting", {
                get: function () {
                    return this._settings['paneMode'];
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.putSetting = function (key, value) {
                this._settings[key] = value;
            };
            EditorContext.prototype.putSettings = function (settings) {
                ObjUtil.addAllProps(settings, this._settings);
            };
            EditorContext.GPS_ACCURACY = 'com.catavolt.core.domain.GeoFix.accuracy';
            EditorContext.GPS_SECONDS = 'com.catavolt.core.domain.GeoFix.seconds';
            return EditorContext;
        })(dialog.PaneContext);
        dialog.EditorContext = EditorContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
