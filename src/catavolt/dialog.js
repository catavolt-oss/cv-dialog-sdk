"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by rburson on 3/27/15.
 */
var util_1 = require("./util");
var fp_1 = require("./fp");
var fp_2 = require("./fp");
var fp_3 = require("./fp");
var util_2 = require("./util");
var util_3 = require("./util");
var fp_4 = require("./fp");
var fp_5 = require("./fp");
var util_4 = require("./util");
var util_5 = require("./util");
var ws_1 = require("./ws");
var ws_2 = require("./ws");
var util_6 = require("./util");
/*
 IMPORTANT!
 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */
/**
 * *********************************
 */
var CellValueDef = (function () {
    function CellValueDef(_style) {
        this._style = _style;
    }
    /* Note compact deserialization will be handled normally by OType */
    CellValueDef.fromWS = function (otype, jsonObj) {
        if (jsonObj['attributeCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['forcedLineCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['labelCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['substitutionCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['tabCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', OType.factoryFn);
        }
        else {
            return new fp_5.Failure('CellValueDef::fromWS: unknown CellValueDef type: ' + util_3.ObjUtil.formatRecAttr(jsonObj));
        }
    };
    Object.defineProperty(CellValueDef.prototype, "isInlineMediaStyle", {
        get: function () {
            return this.style && (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellValueDef.prototype, "style", {
        get: function () {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    return CellValueDef;
}());
exports.CellValueDef = CellValueDef;
/**
 * *********************************
 */
var AttributeCellValueDef = (function (_super) {
    __extends(AttributeCellValueDef, _super);
    function AttributeCellValueDef(_propertyName, _presentationLength, _entryMethod, _autoFillCapable, _hint, _toolTip, _fieldActions, style) {
        _super.call(this, style);
        this._propertyName = _propertyName;
        this._presentationLength = _presentationLength;
        this._entryMethod = _entryMethod;
        this._autoFillCapable = _autoFillCapable;
        this._hint = _hint;
        this._toolTip = _toolTip;
        this._fieldActions = _fieldActions;
    }
    Object.defineProperty(AttributeCellValueDef.prototype, "autoFileCapable", {
        get: function () {
            return this._autoFillCapable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "entryMethod", {
        get: function () {
            return this._entryMethod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "fieldActions", {
        get: function () {
            return this._fieldActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "hint", {
        get: function () {
            return this._hint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isComboBoxEntryMethod", {
        get: function () {
            return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_COMBO_BOX';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isDropDownEntryMethod", {
        get: function () {
            return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_DROP_DOWN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isTextFieldEntryMethod", {
        get: function () {
            return !this.entryMethod || this.entryMethod === 'ENTRY_METHOD_TEXT_FIELD';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "presentationLength", {
        get: function () {
            return this._presentationLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "propertyName", {
        get: function () {
            return this._propertyName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "toolTip", {
        get: function () {
            return this._toolTip;
        },
        enumerable: true,
        configurable: true
    });
    return AttributeCellValueDef;
}(CellValueDef));
exports.AttributeCellValueDef = AttributeCellValueDef;
/**
 * *********************************
 */
var ForcedLineCellValueDef = (function (_super) {
    __extends(ForcedLineCellValueDef, _super);
    function ForcedLineCellValueDef() {
        _super.call(this, null);
    }
    return ForcedLineCellValueDef;
}(CellValueDef));
exports.ForcedLineCellValueDef = ForcedLineCellValueDef;
/**
 * *********************************
 */
var LabelCellValueDef = (function (_super) {
    __extends(LabelCellValueDef, _super);
    function LabelCellValueDef(_value, style) {
        _super.call(this, style);
        this._value = _value;
    }
    Object.defineProperty(LabelCellValueDef.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return LabelCellValueDef;
}(CellValueDef));
exports.LabelCellValueDef = LabelCellValueDef;
/**
 * *********************************
 */
var SubstitutionCellValueDef = (function (_super) {
    __extends(SubstitutionCellValueDef, _super);
    function SubstitutionCellValueDef(_value, style) {
        _super.call(this, style);
        this._value = _value;
    }
    Object.defineProperty(SubstitutionCellValueDef.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return SubstitutionCellValueDef;
}(CellValueDef));
exports.SubstitutionCellValueDef = SubstitutionCellValueDef;
/**
 * *********************************
 */
var TabCellValueDef = (function (_super) {
    __extends(TabCellValueDef, _super);
    function TabCellValueDef() {
        _super.call(this, null);
    }
    return TabCellValueDef;
}(CellValueDef));
exports.TabCellValueDef = TabCellValueDef;
/**
 * *********************************
 */
var PaneContext = (function () {
    function PaneContext(paneRef) {
        this._lastRefreshTime = new Date(0);
        this._parentContext = null;
        this._paneRef = null;
        this._paneRef = paneRef;
        this._binaryCache = {};
    }
    PaneContext.resolveSettingsFromNavRequest = function (initialSettings, navRequest) {
        var result = util_3.ObjUtil.addAllProps(initialSettings, {});
        if (navRequest instanceof FormContext) {
            util_3.ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties, result);
            util_3.ObjUtil.addAllProps(navRequest.offlineProps, result);
        }
        else if (navRequest instanceof NullNavRequest) {
            util_3.ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
        }
        var destroyed = result['fromDialogDestroyed'];
        if (destroyed)
            result['destroyed'] = true;
        return result;
    };
    Object.defineProperty(PaneContext.prototype, "actionSource", {
        get: function () {
            return this.parentContext ? this.parentContext.actionSource : null;
        },
        enumerable: true,
        configurable: true
    });
    PaneContext.prototype.binaryAt = function (propName, entityRec) {
        var prop = entityRec.propAtName(propName);
        if (prop) {
            if (prop.value instanceof InlineBinaryRef) {
                var binRef = prop.value;
                return fp_3.Future.createSuccessfulFuture('binaryAt', new EncodedBinary(binRef.inlineData, binRef.settings['mime-type']));
            }
            else if (prop.value instanceof ObjectBinaryRef) {
                var binRef = prop.value;
                if (binRef.settings['webURL']) {
                    return fp_3.Future.createSuccessfulFuture('binaryAt', new UrlBinary(binRef.settings['webURL']));
                }
                else {
                    return this.readBinary(propName, entityRec);
                }
            }
            else if (typeof prop.value === 'string') {
                return fp_3.Future.createSuccessfulFuture('binaryAt', new UrlBinary(prop.value));
            }
            else {
                return fp_3.Future.createFailedFuture('binaryAt', 'No binary found at ' + propName);
            }
        }
        else {
            return fp_3.Future.createFailedFuture('binaryAt', 'No binary found at ' + propName);
        }
    };
    Object.defineProperty(PaneContext.prototype, "dialogAlias", {
        get: function () {
            return this.dialogRedirection.dialogProperties['dialogAlias'];
        },
        enumerable: true,
        configurable: true
    });
    PaneContext.prototype.findMenuDefAt = function (actionId) {
        var result = null;
        if (this.menuDefs) {
            this.menuDefs.some(function (md) {
                result = md.findAtId(actionId);
                return result != null;
            });
        }
        return result;
    };
    PaneContext.prototype.formatForRead = function (propValue, propName) {
        return PropFormatter.formatForRead(propValue, this.propDefAtName(propName));
    };
    PaneContext.prototype.formatForWrite = function (propValue, propName) {
        return PropFormatter.formatForWrite(propValue, this.propDefAtName(propName));
    };
    Object.defineProperty(PaneContext.prototype, "formDef", {
        get: function () {
            return this.parentContext.formDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "isRefreshNeeded", {
        get: function () {
            return this._lastRefreshTime.getTime() < AppContext.singleton.lastMaintenanceTime.getTime();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "lastRefreshTime", {
        get: function () {
            return this._lastRefreshTime;
        },
        set: function (time) {
            this._lastRefreshTime = time;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "menuDefs", {
        get: function () {
            return this.paneDef.menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "offlineCapable", {
        get: function () {
            return this._parentContext && this._parentContext.offlineCapable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "paneDef", {
        get: function () {
            if (this.paneRef == null) {
                return this.formDef.headerDef;
            }
            else {
                return this.formDef.childrenDefs[this.paneRef];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "paneRef", {
        get: function () {
            return this._paneRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "paneTitle", {
        get: function () {
            return this.paneDef.findTitle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "parentContext", {
        get: function () {
            return this._parentContext;
        },
        set: function (parentContext) {
            this._parentContext = parentContext;
            this.initialize();
        },
        enumerable: true,
        configurable: true
    });
    PaneContext.prototype.parseValue = function (formattedValue, propName) {
        return PropFormatter.parse(formattedValue, this.propDefAtName(propName));
    };
    PaneContext.prototype.propDefAtName = function (propName) {
        return this.entityRecDef.propDefAtName(propName);
    };
    Object.defineProperty(PaneContext.prototype, "sessionContext", {
        get: function () {
            return this.parentContext.sessionContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "dialogRedirection", {
        /** --------------------- MODULE ------------------------------*/
        //*** let's pretend this has module level visibility
        get: function () {
            return this.paneDef.dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    PaneContext.prototype.initialize = function () {
    };
    PaneContext.prototype.readBinaries = function (entityRec) {
        var _this = this;
        return fp_3.Future.sequence(this.entityRecDef.propDefs.filter(function (propDef) {
            return propDef.isBinaryType;
        }).map(function (propDef) {
            return _this.readBinary(propDef.name, entityRec);
        }));
    };
    //abstract
    PaneContext.prototype.readBinary = function (propName, entityRec) {
        return null;
    };
    PaneContext.prototype.writeBinaries = function (entityRec) {
        var _this = this;
        return fp_3.Future.sequence(entityRec.props.filter(function (prop) {
            return prop.value instanceof EncodedBinary;
        }).map(function (prop) {
            var ptr = 0;
            var encBin = prop.value;
            var data = encBin.data;
            var writeFuture = fp_3.Future.createSuccessfulFuture('startSeq', {});
            while (ptr < data.length) {
                var boundPtr = function (ptr) {
                    writeFuture = writeFuture.bind(function (prevResult) {
                        var encSegment = (ptr + PaneContext.CHAR_CHUNK_SIZE) <= data.length ? data.substring(ptr, PaneContext.CHAR_CHUNK_SIZE) : data.substring(ptr);
                        return DialogService.writeProperty(_this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, ptr != 0, _this.sessionContext);
                    });
                };
                boundPtr(ptr);
                ptr += PaneContext.CHAR_CHUNK_SIZE;
            }
            return writeFuture;
        }));
    };
    PaneContext.ANNO_NAME_KEY = "com.catavolt.annoName";
    PaneContext.PROP_NAME_KEY = "com.catavolt.propName";
    PaneContext.CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation
    PaneContext.BINARY_CHUNK_SIZE = 256 * 1024; //size in  byes for 'read' operation
    return PaneContext;
}());
exports.PaneContext = PaneContext;
/**
 * *********************************
 */
var EditorContext = (function (_super) {
    __extends(EditorContext, _super);
    function EditorContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(EditorContext.prototype, "buffer", {
        get: function () {
            if (!this._buffer) {
                this._buffer = new EntityBuffer(NullEntityRec.singleton);
            }
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    EditorContext.prototype.changePaneMode = function (paneMode) {
        var _this = this;
        return DialogService.changePaneMode(this.paneDef.dialogHandle, paneMode, this.sessionContext).bind(function (changePaneModeResult) {
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
            return fp_3.Future.createSuccessfulFuture('EditorContext::changePaneMode', _this.entityRecDef);
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
        return DialogService.getAvailableValues(this.paneDef.dialogHandle, propName, this.buffer.afterEffects(), this.sessionContext).map(function (valuesResult) {
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
        return DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, pendingWrites, this.sessionContext).bind(function (redirection) {
            var ca = new ContextAction(menuDef.actionId, _this.parentContext.dialogRedirection.objectId, _this.actionSource);
            return NavRequestUtil.fromRedirection(redirection, ca, _this.sessionContext).map(function (navRequest) {
                _this._settings = PaneContext.resolveSettingsFromNavRequest(_this._settings, navRequest);
                if (_this.isDestroyedSetting) {
                    _this._editorState = EditorState.DESTROYED;
                }
                if (_this.isRefreshSetting) {
                    AppContext.singleton.lastMaintenanceTime = new Date();
                }
                return navRequest;
            });
        });
    };
    EditorContext.prototype.processSideEffects = function (propertyName, value) {
        var _this = this;
        var sideEffectsFr = DialogService.processSideEffects(this.paneDef.dialogHandle, this.sessionContext, propertyName, value, this.buffer.afterEffects()).map(function (changeResult) {
            return changeResult.sideEffects ? changeResult.sideEffects.entityRec : new NullEntityRec();
        });
        return sideEffectsFr.map(function (sideEffectsRec) {
            var originalProps = _this.buffer.before.props;
            var userEffects = _this.buffer.afterEffects().props;
            var sideEffects = sideEffectsRec.props;
            sideEffects = sideEffects.filter(function (prop) {
                return prop.name !== propertyName;
            });
            _this._buffer = EntityBuffer.createEntityBuffer(_this.buffer.objectId, EntityRecUtil.union(originalProps, sideEffects), EntityRecUtil.union(originalProps, EntityRecUtil.union(userEffects, sideEffects)));
            return null;
        });
    };
    EditorContext.prototype.read = function () {
        var _this = this;
        return DialogService.readEditorModel(this.paneDef.dialogHandle, this.sessionContext).map(function (readResult) {
            _this.entityRecDef = readResult.entityRecDef;
            return readResult.entityRec;
        }).map(function (entityRec) {
            _this.initBuffer(entityRec);
            _this.lastRefreshTime = new Date();
            return entityRec;
        });
    };
    EditorContext.prototype.readBinary = function (propName, entityRec) {
        var _this = this;
        var seq = 0;
        var buffer = '';
        var f = function (result) {
            buffer += result.data;
            if (result.hasMore) {
                return DialogService.readEditorProperty(_this.paneDef.dialogRedirection.dialogHandle, propName, ++seq, PaneContext.BINARY_CHUNK_SIZE, _this.sessionContext).bind(f);
            }
            else {
                return fp_3.Future.createSuccessfulFuture('readProperty', new EncodedBinary(buffer));
            }
        };
        return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle, propName, seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
    };
    EditorContext.prototype.requestedAccuracy = function () {
        var accuracyStr = this.paneDef.settings[EditorContext.GPS_ACCURACY];
        return accuracyStr ? Number(accuracyStr) : 500;
    };
    EditorContext.prototype.requestedTimeoutSeconds = function () {
        var timeoutStr = this.paneDef.settings[EditorContext.GPS_SECONDS];
        return timeoutStr ? Number(timeoutStr) : 30;
    };
    EditorContext.prototype.setPropValue = function (name, value) {
        var propDef = this.propDefAtName(name);
        var parsedValue = null;
        if (propDef) {
            parsedValue = value ? this.parseValue(value, propDef.name) : null;
            this.buffer.setValue(propDef.name, parsedValue);
        }
        return parsedValue;
    };
    EditorContext.prototype.setBinaryPropWithDataUrl = function (name, dataUrl) {
        var urlObj = new util_6.DataUrl(dataUrl);
        this.setBinaryPropWithEncodedData(name, urlObj.data, urlObj.mimeType);
    };
    EditorContext.prototype.setBinaryPropWithEncodedData = function (name, encodedData, mimeType) {
        var propDef = this.propDefAtName(name);
        if (propDef) {
            var value = new EncodedBinary(encodedData, mimeType);
            this.buffer.setValue(propDef.name, value);
        }
    };
    EditorContext.prototype.write = function () {
        var _this = this;
        var deltaRec = this.buffer.afterEffects();
        return this.writeBinaries(deltaRec).bind(function (binResult) {
            var result = DialogService.writeEditorModel(_this.paneDef.dialogRedirection.dialogHandle, deltaRec, _this.sessionContext).bind(function (either) {
                if (either.isLeft) {
                    var ca = new ContextAction('#write', _this.parentContext.dialogRedirection.objectId, _this.actionSource);
                    return NavRequestUtil.fromRedirection(either.left, ca, _this.sessionContext).map(function (navRequest) {
                        return fp_2.Either.left(navRequest);
                    });
                }
                else {
                    var writeResult = either.right;
                    _this.putSettings(writeResult.dialogProps);
                    _this.entityRecDef = writeResult.entityRecDef;
                    return fp_3.Future.createSuccessfulFuture('EditorContext::write', fp_2.Either.right(writeResult.entityRec));
                }
            });
            return result.map(function (successfulWrite) {
                var now = new Date();
                AppContext.singleton.lastMaintenanceTime = now;
                _this.lastRefreshTime = now;
                if (successfulWrite.isLeft) {
                    _this._settings = PaneContext.resolveSettingsFromNavRequest(_this._settings, successfulWrite.left);
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
        });
    };
    //Module level methods
    EditorContext.prototype.initialize = function () {
        this._entityRecDef = this.paneDef.entityRecDef;
        this._settings = util_3.ObjUtil.addAllProps(this.dialogRedirection.dialogProperties, {});
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
        this._buffer = entityRec ? new EntityBuffer(entityRec) : new EntityBuffer(NullEntityRec.singleton);
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
        util_3.ObjUtil.addAllProps(settings, this._settings);
    };
    EditorContext.GPS_ACCURACY = 'com.catavolt.core.domain.GeoFix.accuracy';
    EditorContext.GPS_SECONDS = 'com.catavolt.core.domain.GeoFix.seconds';
    return EditorContext;
}(PaneContext));
exports.EditorContext = EditorContext;
/**
 * *********************************
 */
var FormContext = (function (_super) {
    __extends(FormContext, _super);
    function FormContext(_dialogRedirection, _actionSource, _formDef, _childrenContexts, _offlineCapable, _offlineData, _sessionContext) {
        var _this = this;
        _super.call(this, null);
        this._dialogRedirection = _dialogRedirection;
        this._actionSource = _actionSource;
        this._formDef = _formDef;
        this._childrenContexts = _childrenContexts;
        this._offlineCapable = _offlineCapable;
        this._offlineData = _offlineData;
        this._sessionContext = _sessionContext;
        this._destroyed = false;
        this._offlineProps = {};
        this._childrenContexts = _childrenContexts || [];
        this._childrenContexts.forEach(function (c) {
            c.parentContext = _this;
        });
    }
    Object.defineProperty(FormContext.prototype, "actionSource", {
        get: function () {
            return this.parentContext ? this.parentContext.actionSource : this._actionSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "childrenContexts", {
        get: function () {
            return this._childrenContexts;
        },
        enumerable: true,
        configurable: true
    });
    FormContext.prototype.close = function () {
        return DialogService.closeEditorModel(this.dialogRedirection.dialogHandle, this.sessionContext);
    };
    Object.defineProperty(FormContext.prototype, "dialogRedirection", {
        get: function () {
            return this._dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "entityRecDef", {
        get: function () {
            return this.formDef.entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "formDef", {
        get: function () {
            return this._formDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "headerContext", {
        get: function () {
            throw new Error('FormContext::headerContext: Needs Impl');
        },
        enumerable: true,
        configurable: true
    });
    FormContext.prototype.performMenuAction = function (menuDef) {
        var _this = this;
        return DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, NullEntityRec.singleton, this.sessionContext).bind(function (value) {
            var destroyedStr = value.fromDialogProperties['destroyed'];
            if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
                _this._destroyed = true;
            }
            var ca = new ContextAction(menuDef.actionId, _this.dialogRedirection.objectId, _this.actionSource);
            return NavRequestUtil.fromRedirection(value, ca, _this.sessionContext);
        });
    };
    Object.defineProperty(FormContext.prototype, "isDestroyed", {
        get: function () {
            return this._destroyed || this.isAnyChildDestroyed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "offlineCapable", {
        get: function () {
            return this._offlineCapable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "menuDefs", {
        get: function () {
            return this.formDef.menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "offlineProps", {
        get: function () {
            return this._offlineProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "paneDef", {
        get: function () {
            return this.formDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "sessionContext", {
        get: function () {
            return this._sessionContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "isAnyChildDestroyed", {
        /** --------------------- MODULE ------------------------------*/
        //*** let's pretend this has module level visibility (no such thing (yet!))
        get: function () {
            return this.childrenContexts.some(function (paneContext) {
                if (paneContext instanceof EditorContext || paneContext instanceof QueryContext) {
                    return paneContext.isDestroyed;
                }
                return false;
            });
        },
        enumerable: true,
        configurable: true
    });
    FormContext.prototype.processNavRequestForDestroyed = function (navRequest) {
        var fromDialogProps = {};
        if (navRequest instanceof FormContext) {
            fromDialogProps = navRequest.offlineProps;
        }
        else if (navRequest instanceof NullNavRequest) {
            fromDialogProps = navRequest.fromDialogProperties;
        }
        var destroyedStr = fromDialogProps['destroyed'];
        if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
            this._destroyed = true;
        }
        var fromDialogDestroyed = fromDialogProps['fromDialogDestroyed'];
        if (fromDialogDestroyed) {
            this._destroyed = true;
        }
    };
    return FormContext;
}(PaneContext));
exports.FormContext = FormContext;
/**
 * *********************************
 */
var QueryState;
(function (QueryState) {
    QueryState[QueryState["ACTIVE"] = 0] = "ACTIVE";
    QueryState[QueryState["DESTROYED"] = 1] = "DESTROYED";
})(QueryState || (QueryState = {}));
(function (QueryDirection) {
    QueryDirection[QueryDirection["FORWARD"] = 0] = "FORWARD";
    QueryDirection[QueryDirection["BACKWARD"] = 1] = "BACKWARD";
})(exports.QueryDirection || (exports.QueryDirection = {}));
var QueryDirection = exports.QueryDirection;
var QueryContext = (function (_super) {
    __extends(QueryContext, _super);
    function QueryContext(paneRef, _offlineRecs, _settings) {
        if (_offlineRecs === void 0) { _offlineRecs = []; }
        if (_settings === void 0) { _settings = {}; }
        _super.call(this, paneRef);
        this._offlineRecs = _offlineRecs;
        this._settings = _settings;
    }
    Object.defineProperty(QueryContext.prototype, "entityRecDef", {
        get: function () {
            return this.paneDef.entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.isBinary = function (columnDef) {
        var propDef = this.propDefAtName(columnDef.name);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && columnDef.isInlineMediaStyle));
    };
    Object.defineProperty(QueryContext.prototype, "isDestroyed", {
        get: function () {
            return this._queryState === QueryState.DESTROYED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "lastQueryFr", {
        get: function () {
            return this._lastQueryFr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "offlineRecs", {
        get: function () {
            return this._offlineRecs;
        },
        set: function (offlineRecs) {
            this._offlineRecs = offlineRecs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "paneMode", {
        get: function () {
            return this._settings['paneMode'];
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.performMenuAction = function (menuDef, targets) {
        var _this = this;
        return DialogService.performQueryAction(this.paneDef.dialogHandle, menuDef.actionId, targets, this.sessionContext).bind(function (redirection) {
            var target = targets.length > 0 ? targets[0] : null;
            var ca = new ContextAction(menuDef.actionId, target, _this.actionSource);
            return NavRequestUtil.fromRedirection(redirection, ca, _this.sessionContext);
        }).map(function (navRequest) {
            _this._settings = PaneContext.resolveSettingsFromNavRequest(_this._settings, navRequest);
            if (_this.isDestroyedSetting) {
                _this._queryState = QueryState.DESTROYED;
            }
            return navRequest;
        });
    };
    QueryContext.prototype.query = function (maxRows, direction, fromObjectId) {
        var _this = this;
        return DialogService.queryQueryModel(this.paneDef.dialogHandle, direction, maxRows, fromObjectId, this.sessionContext).bind(function (value) {
            var result = new QueryResult(value.entityRecs, value.hasMore);
            if (_this.lastRefreshTime === new Date(0)) {
                _this.lastRefreshTime = new Date();
            }
            return fp_3.Future.createSuccessfulFuture('QueryContext::query', result);
        });
    };
    QueryContext.prototype.readBinary = function (propName, entityRec) {
        var _this = this;
        var seq = 0;
        var buffer = '';
        var f = function (result) {
            buffer += result.data;
            if (result.hasMore) {
                return DialogService.readQueryProperty(_this.paneDef.dialogRedirection.dialogHandle, propName, entityRec.objectId, ++seq, PaneContext.BINARY_CHUNK_SIZE, _this.sessionContext).bind(f);
            }
            else {
                return fp_3.Future.createSuccessfulFuture('readProperty', new EncodedBinary(buffer));
            }
        };
        return DialogService.readQueryProperty(this.paneDef.dialogRedirection.dialogHandle, propName, entityRec.objectId, seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
    };
    QueryContext.prototype.refresh = function () {
        return this._scroller.refresh();
    };
    Object.defineProperty(QueryContext.prototype, "scroller", {
        get: function () {
            if (!this._scroller) {
                this._scroller = this.newScroller();
            }
            return this._scroller;
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.setScroller = function (pageSize, firstObjectId, markerOptions) {
        this._scroller = new QueryScroller(this, pageSize, firstObjectId, markerOptions);
        return this._scroller;
    };
    //module level methods
    QueryContext.prototype.newScroller = function () {
        return this.setScroller(50, null, [QueryMarkerOption.None]);
    };
    QueryContext.prototype.settings = function () {
        return this._settings;
    };
    Object.defineProperty(QueryContext.prototype, "isDestroyedSetting", {
        get: function () {
            var str = this._settings['destroyed'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isGlobalRefreshSetting", {
        get: function () {
            var str = this._settings['globalRefresh'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isLocalRefreshSetting", {
        get: function () {
            var str = this._settings['localRefresh'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isRefreshSetting", {
        get: function () {
            return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
        },
        enumerable: true,
        configurable: true
    });
    return QueryContext;
}(PaneContext));
exports.QueryContext = QueryContext;
/**
 * *********************************
 */
var BarcodeScanContext = (function (_super) {
    __extends(BarcodeScanContext, _super);
    function BarcodeScanContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(BarcodeScanContext.prototype, "barcodeScanDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return BarcodeScanContext;
}(EditorContext));
exports.BarcodeScanContext = BarcodeScanContext;
/**
 * *********************************
 */
var DetailsContext = (function (_super) {
    __extends(DetailsContext, _super);
    function DetailsContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(DetailsContext.prototype, "detailsDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsContext.prototype, "printMarkupURL", {
        get: function () {
            return this.paneDef.dialogRedirection.dialogProperties['formsURL'];
        },
        enumerable: true,
        configurable: true
    });
    return DetailsContext;
}(EditorContext));
exports.DetailsContext = DetailsContext;
/**
 * *********************************
 */
var GeoFixContext = (function (_super) {
    __extends(GeoFixContext, _super);
    function GeoFixContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(GeoFixContext.prototype, "geoFixDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return GeoFixContext;
}(EditorContext));
exports.GeoFixContext = GeoFixContext;
/**
 * *********************************
 */
var GeoLocationContext = (function (_super) {
    __extends(GeoLocationContext, _super);
    function GeoLocationContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(GeoLocationContext.prototype, "geoLocationDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return GeoLocationContext;
}(EditorContext));
exports.GeoLocationContext = GeoLocationContext;
/**
 * *********************************
 */
var CalendarContext = (function (_super) {
    __extends(CalendarContext, _super);
    function CalendarContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(CalendarContext.prototype, "calendarDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return CalendarContext;
}(QueryContext));
exports.CalendarContext = CalendarContext;
/**
 * *********************************
 */
var GraphContext = (function (_super) {
    __extends(GraphContext, _super);
    function GraphContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(GraphContext.prototype, "graphDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return GraphContext;
}(QueryContext));
exports.GraphContext = GraphContext;
/**
 * *********************************
 */
var ImagePickerContext = (function (_super) {
    __extends(ImagePickerContext, _super);
    function ImagePickerContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(ImagePickerContext.prototype, "imagePickerDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return ImagePickerContext;
}(QueryContext));
exports.ImagePickerContext = ImagePickerContext;
/**
 * *********************************
 */
var ListContext = (function (_super) {
    __extends(ListContext, _super);
    function ListContext(paneRef, offlineRecs, settings) {
        if (offlineRecs === void 0) { offlineRecs = []; }
        if (settings === void 0) { settings = {}; }
        _super.call(this, paneRef, offlineRecs, settings);
    }
    Object.defineProperty(ListContext.prototype, "columnHeadings", {
        get: function () {
            return this.listDef.activeColumnDefs.map(function (cd) {
                return cd.heading;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListContext.prototype, "listDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    ListContext.prototype.rowValues = function (entityRec) {
        return this.listDef.activeColumnDefs.map(function (cd) {
            return entityRec.valueAtName(cd.name);
        });
    };
    Object.defineProperty(ListContext.prototype, "style", {
        get: function () {
            return this.listDef.style;
        },
        enumerable: true,
        configurable: true
    });
    return ListContext;
}(QueryContext));
exports.ListContext = ListContext;
/**
 * *********************************
 */
var MapContext = (function (_super) {
    __extends(MapContext, _super);
    function MapContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(MapContext.prototype, "mapDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return MapContext;
}(QueryContext));
exports.MapContext = MapContext;
/**
 * *********************************
 */
var PaneDef = (function () {
    function PaneDef(_paneId, _name, _label, _title, _menuDefs, _entityRecDef, _dialogRedirection, _settings) {
        this._paneId = _paneId;
        this._name = _name;
        this._label = _label;
        this._title = _title;
        this._menuDefs = _menuDefs;
        this._entityRecDef = _entityRecDef;
        this._dialogRedirection = _dialogRedirection;
        this._settings = _settings;
    }
    PaneDef.fromOpenPaneResult = function (childXOpenResult, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs) {
        var settings = {};
        util_3.ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);
        var newPaneDef;
        if (childXPaneDef instanceof XListDef) {
            var xListDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns, childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
        }
        else if (childXPaneDef instanceof XDetailsDef) {
            var xDetailsDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText, xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
        }
        else if (childXPaneDef instanceof XMapDef) {
            var xMapDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty, xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty, xMapDef.latitudeProperty, xMapDef.longitudeProperty);
        }
        else if (childXPaneDef instanceof XGraphDef) {
            var xGraphDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xGraphDef.graphType, xGraphDef.identityDataPoint, xGraphDef.groupingDataPoint, xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel);
        }
        else if (childXPaneDef instanceof XBarcodeScanDef) {
            var xBarcodeScanDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XGeoFixDef) {
            var xGeoFixDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XGeoLocationDef) {
            var xGeoLocationDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XCalendarDef) {
            var xCalendarDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty, xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty, xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty, xOpenQueryModelResult.defaultActionId);
        }
        else if (childXPaneDef instanceof XImagePickerDef) {
            var xImagePickerDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty, xImagePickerDef.defaultActionId);
        }
        else {
            return new fp_5.Failure('PaneDef::fromOpenPaneResult needs impl for: ' + util_3.ObjUtil.formatRecAttr(childXPaneDef));
        }
        return new fp_4.Success(newPaneDef);
    };
    Object.defineProperty(PaneDef.prototype, "dialogHandle", {
        get: function () {
            return this._dialogRedirection.dialogHandle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "dialogRedirection", {
        get: function () {
            return this._dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "entityRecDef", {
        get: function () {
            return this._entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    PaneDef.prototype.findTitle = function () {
        var result = this._title ? this._title.trim() : '';
        result = result === 'null' ? '' : result;
        if (result === '') {
            result = this._label ? this._label.trim() : '';
            result = result === 'null' ? '' : result;
        }
        return result;
    };
    Object.defineProperty(PaneDef.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "menuDefs", {
        get: function () {
            return this._menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "paneId", {
        get: function () {
            return this._paneId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    return PaneDef;
}());
exports.PaneDef = PaneDef;
/**
 * *********************************
 */
var BarcodeScanDef = (function (_super) {
    __extends(BarcodeScanDef, _super);
    function BarcodeScanDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
    return BarcodeScanDef;
}(PaneDef));
exports.BarcodeScanDef = BarcodeScanDef;
/**
 * *********************************
 */
var CalendarDef = (function (_super) {
    __extends(CalendarDef, _super);
    function CalendarDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _initialStyle, _startDatePropName, _startTimePropName, _endDatePropName, _endTimePropName, _occurDatePropName, _occurTimePropName, _defaultActionId) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._descriptionPropName = _descriptionPropName;
        this._initialStyle = _initialStyle;
        this._startDatePropName = _startDatePropName;
        this._startTimePropName = _startTimePropName;
        this._endDatePropName = _endDatePropName;
        this._endTimePropName = _endTimePropName;
        this._occurDatePropName = _occurDatePropName;
        this._occurTimePropName = _occurTimePropName;
        this._defaultActionId = _defaultActionId;
    }
    Object.defineProperty(CalendarDef.prototype, "descriptionPropName", {
        get: function () {
            return this._descriptionPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "initialStyle", {
        get: function () {
            return this._initialStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "startDatePropName", {
        get: function () {
            return this._startDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "startTimePropName", {
        get: function () {
            return this._startTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "endDatePropName", {
        get: function () {
            return this._endDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "endTimePropName", {
        get: function () {
            return this._endTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "occurDatePropName", {
        get: function () {
            return this._occurDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "occurTimePropName", {
        get: function () {
            return this._occurTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "defaultActionId", {
        get: function () {
            return this._defaultActionId;
        },
        enumerable: true,
        configurable: true
    });
    return CalendarDef;
}(PaneDef));
exports.CalendarDef = CalendarDef;
/**
 * *********************************
 */
var DetailsDef = (function (_super) {
    __extends(DetailsDef, _super);
    function DetailsDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _cancelButtonText, _commitButtonText, _editable, _focusPropName, _graphicalMarkup, _rows) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._cancelButtonText = _cancelButtonText;
        this._commitButtonText = _commitButtonText;
        this._editable = _editable;
        this._focusPropName = _focusPropName;
        this._graphicalMarkup = _graphicalMarkup;
        this._rows = _rows;
    }
    Object.defineProperty(DetailsDef.prototype, "cancelButtonText", {
        get: function () {
            return this._cancelButtonText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "commitButtonText", {
        get: function () {
            return this._commitButtonText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "editable", {
        get: function () {
            return this._editable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "focusPropName", {
        get: function () {
            return this._focusPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "graphicalMarkup", {
        get: function () {
            return this._graphicalMarkup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "rows", {
        get: function () {
            return this._rows;
        },
        enumerable: true,
        configurable: true
    });
    return DetailsDef;
}(PaneDef));
exports.DetailsDef = DetailsDef;
/**
 * *********************************
 */
var FormDef = (function (_super) {
    __extends(FormDef, _super);
    function FormDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _formLayout, _formStyle, _borderStyle, _headerDef, _childrenDefs) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._formLayout = _formLayout;
        this._formStyle = _formStyle;
        this._borderStyle = _borderStyle;
        this._headerDef = _headerDef;
        this._childrenDefs = _childrenDefs;
    }
    FormDef.fromOpenFormResult = function (formXOpenResult, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs) {
        var settings = { 'open': true };
        util_3.ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties, settings);
        var headerDef = null;
        var childrenDefs = [];
        for (var i = 0; i < childrenXOpens.length; i++) {
            var childXOpen = childrenXOpens[i];
            var childXPaneDef = childrenXPaneDefs[i];
            var childXActiveColDefs = childrenXActiveColDefs[i];
            var childMenuDefs = childrenMenuDefs[i];
            var childXComp = formXOpenResult.formModel.children[i];
            var childXPaneDefRef = formXFormDef.paneDefRefs[i];
            var paneDefTry = PaneDef.fromOpenPaneResult(childXOpen, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs);
            if (paneDefTry.isFailure) {
                return new fp_5.Failure(paneDefTry.failure);
            }
            else {
                childrenDefs.push(paneDefTry.success);
            }
        }
        return new fp_4.Success(new FormDef(formXFormDef.paneId, formXFormDef.name, formXOpenResult.formModel.form.label, formXFormDef.title, formMenuDefs, formXOpenResult.entityRecDef, formXOpenResult.formRedirection, settings, formXFormDef.formLayout, formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childrenDefs));
    };
    Object.defineProperty(FormDef.prototype, "borderStyle", {
        get: function () {
            return this._borderStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "childrenDefs", {
        get: function () {
            return this._childrenDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "formLayout", {
        get: function () {
            return this._formLayout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "formStyle", {
        get: function () {
            return this._formStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "headerDef", {
        get: function () {
            return this._headerDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isFlowingLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'FLOWING';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isFlowingTopDownLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'FLOWING_TOP_DOWN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isFourBoxSquareLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isHorizontalLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'H';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isOptionsFormLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'OPTIONS_FORM';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isTabsLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'TABS';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isThreeBoxOneLeftLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'THREE_ONE_LEFT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isThreeBoxOneOverLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'THREE_ONE_OVER';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isThreeBoxOneRightLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'THREE_ONE_RIGHT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isThreeBoxOneUnderLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'THREE_ONE_UNDER';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isTopDownLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'TOP_DOWN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isTwoVerticalLayout", {
        get: function () {
            return this.formLayout && this.formLayout === 'H(2,V)';
        },
        enumerable: true,
        configurable: true
    });
    return FormDef;
}(PaneDef));
exports.FormDef = FormDef;
/**
 * *********************************
 */
var GeoFixDef = (function (_super) {
    __extends(GeoFixDef, _super);
    function GeoFixDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
    return GeoFixDef;
}(PaneDef));
exports.GeoFixDef = GeoFixDef;
/**
 * *********************************
 */
var GeoLocationDef = (function (_super) {
    __extends(GeoLocationDef, _super);
    function GeoLocationDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
    return GeoLocationDef;
}(PaneDef));
exports.GeoLocationDef = GeoLocationDef;
/**
 * *********************************
 */
var GraphDef = (function (_super) {
    __extends(GraphDef, _super);
    function GraphDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _graphType, _identityDataPointDef, _groupingDataPointDef, _dataPointDefs, _filterDataPointDefs, _sampleModel) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._graphType = _graphType;
        this._identityDataPointDef = _identityDataPointDef;
        this._groupingDataPointDef = _groupingDataPointDef;
        this._dataPointDefs = _dataPointDefs;
        this._filterDataPointDefs = _filterDataPointDefs;
        this._sampleModel = _sampleModel;
    }
    Object.defineProperty(GraphDef.prototype, "dataPointDefs", {
        get: function () {
            return this._dataPointDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphDef.prototype, "filterDataPointDefs", {
        get: function () {
            return this._filterDataPointDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphDef.prototype, "identityDataPointDef", {
        get: function () {
            return this._identityDataPointDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphDef.prototype, "groupingDataPointDef", {
        get: function () {
            return this._groupingDataPointDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphDef.prototype, "sampleModel", {
        get: function () {
            return this._sampleModel;
        },
        enumerable: true,
        configurable: true
    });
    return GraphDef;
}(PaneDef));
exports.GraphDef = GraphDef;
/**
 * *********************************
 */
var ImagePickerDef = (function (_super) {
    __extends(ImagePickerDef, _super);
    function ImagePickerDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _URLPropName, _defaultActionId) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._URLPropName = _URLPropName;
        this._defaultActionId = _defaultActionId;
    }
    Object.defineProperty(ImagePickerDef.prototype, "defaultActionId", {
        get: function () {
            return this._defaultActionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImagePickerDef.prototype, "URLPropName", {
        get: function () {
            return this._URLPropName;
        },
        enumerable: true,
        configurable: true
    });
    return ImagePickerDef;
}(PaneDef));
exports.ImagePickerDef = ImagePickerDef;
/**
 * *********************************
 */
var ListDef = (function (_super) {
    __extends(ListDef, _super);
    function ListDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _style, _initialColumns, _activeColumnDefs, _columnsStyle, _defaultActionId, _graphicalMarkup) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._style = _style;
        this._initialColumns = _initialColumns;
        this._activeColumnDefs = _activeColumnDefs;
        this._columnsStyle = _columnsStyle;
        this._defaultActionId = _defaultActionId;
        this._graphicalMarkup = _graphicalMarkup;
    }
    Object.defineProperty(ListDef.prototype, "activeColumnDefs", {
        get: function () {
            return this._activeColumnDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "columnsStyle", {
        get: function () {
            return this._columnsStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "defaultActionId", {
        get: function () {
            return this._defaultActionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "graphicalMarkup", {
        get: function () {
            return this._graphicalMarkup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "initialColumns", {
        get: function () {
            return this._initialColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "isDefaultStyle", {
        get: function () {
            return this.style && this.style === 'DEFAULT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "isDetailsFormStyle", {
        get: function () {
            return this.style && this.style === 'DETAILS_FORM';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "isFormStyle", {
        get: function () {
            return this.style && this.style === 'FORM';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "isTabularStyle", {
        get: function () {
            return this.style && this.style === 'TABULAR';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "style", {
        get: function () {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    return ListDef;
}(PaneDef));
exports.ListDef = ListDef;
/**
 * *********************************
 */
var MapDef = (function (_super) {
    __extends(MapDef, _super);
    function MapDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _streetPropName, _cityPropName, _statePropName, _postalCodePropName, _latitudePropName, _longitudePropName) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._descriptionPropName = _descriptionPropName;
        this._streetPropName = _streetPropName;
        this._cityPropName = _cityPropName;
        this._statePropName = _statePropName;
        this._postalCodePropName = _postalCodePropName;
        this._latitudePropName = _latitudePropName;
        this._longitudePropName = _longitudePropName;
    }
    Object.defineProperty(MapDef.prototype, "cityPropName", {
        get: function () {
            return this._cityPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "descriptionPropName", {
        get: function () {
            return this._descriptionPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "latitudePropName", {
        get: function () {
            return this._latitudePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "longitudePropName", {
        get: function () {
            return this._longitudePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "postalCodePropName", {
        get: function () {
            return this._postalCodePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "statePropName", {
        get: function () {
            return this._statePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "streetPropName", {
        get: function () {
            return this._streetPropName;
        },
        enumerable: true,
        configurable: true
    });
    return MapDef;
}(PaneDef));
exports.MapDef = MapDef;
/**
 * *********************************
 */
var BinaryRef = (function () {
    function BinaryRef(_settings) {
        this._settings = _settings;
    }
    BinaryRef.fromWSValue = function (encodedValue, settings) {
        if (encodedValue && encodedValue.length > 0) {
            return new fp_4.Success(new InlineBinaryRef(encodedValue, settings));
        }
        else {
            return new fp_4.Success(new ObjectBinaryRef(settings));
        }
    };
    Object.defineProperty(BinaryRef.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    return BinaryRef;
}());
exports.BinaryRef = BinaryRef;
var InlineBinaryRef = (function (_super) {
    __extends(InlineBinaryRef, _super);
    function InlineBinaryRef(_inlineData, settings) {
        _super.call(this, settings);
        this._inlineData = _inlineData;
    }
    Object.defineProperty(InlineBinaryRef.prototype, "inlineData", {
        /* Base64 encoded data */
        get: function () {
            return this._inlineData;
        },
        enumerable: true,
        configurable: true
    });
    InlineBinaryRef.prototype.toString = function () {
        return this._inlineData;
    };
    return InlineBinaryRef;
}(BinaryRef));
exports.InlineBinaryRef = InlineBinaryRef;
var ObjectBinaryRef = (function (_super) {
    __extends(ObjectBinaryRef, _super);
    function ObjectBinaryRef(settings) {
        _super.call(this, settings);
    }
    return ObjectBinaryRef;
}(BinaryRef));
exports.ObjectBinaryRef = ObjectBinaryRef;
/**
 * *********************************
 */
var EncodedBinary = (function () {
    function EncodedBinary(_data, _mimeType) {
        this._data = _data;
        this._mimeType = _mimeType;
    }
    Object.defineProperty(EncodedBinary.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EncodedBinary.prototype, "mimeType", {
        get: function () {
            return this._mimeType || 'application/octet-stream';
        },
        enumerable: true,
        configurable: true
    });
    EncodedBinary.prototype.toUrl = function () {
        return util_6.DataUrl.createDataUrl(this.mimeType, this.data);
    };
    return EncodedBinary;
}());
exports.EncodedBinary = EncodedBinary;
var UrlBinary = (function () {
    function UrlBinary(_url) {
        this._url = _url;
    }
    Object.defineProperty(UrlBinary.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    UrlBinary.prototype.toUrl = function () {
        return this.url;
    };
    return UrlBinary;
}());
exports.UrlBinary = UrlBinary;
/**
 * *********************************
 */
var Redirection = (function () {
    function Redirection() {
    }
    Redirection.fromWS = function (otype, jsonObj) {
        if (jsonObj && jsonObj['webURL']) {
            return OType.deserializeObject(jsonObj, 'WSWebRedirection', OType.factoryFn);
        }
        else if (jsonObj && jsonObj['workbenchId']) {
            return OType.deserializeObject(jsonObj, 'WSWorkbenchRedirection', OType.factoryFn);
        }
        else {
            return OType.deserializeObject(jsonObj, 'WSDialogRedirection', OType.factoryFn);
        }
    };
    return Redirection;
}());
exports.Redirection = Redirection;
/**
 * *********************************
 */
var DialogRedirection = (function (_super) {
    __extends(DialogRedirection, _super);
    function DialogRedirection(_dialogHandle, _dialogType, _dialogMode, _paneMode, _objectId, _open, _domainClassName, _dialogModelClassName, _dialogProperties, _fromDialogProperties) {
        _super.call(this);
        this._dialogHandle = _dialogHandle;
        this._dialogType = _dialogType;
        this._dialogMode = _dialogMode;
        this._paneMode = _paneMode;
        this._objectId = _objectId;
        this._open = _open;
        this._domainClassName = _domainClassName;
        this._dialogModelClassName = _dialogModelClassName;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    Object.defineProperty(DialogRedirection.prototype, "dialogHandle", {
        get: function () {
            return this._dialogHandle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "dialogMode", {
        get: function () {
            return this._dialogMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "dialogModelClassName", {
        get: function () {
            return this._dialogModelClassName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "dialogProperties", {
        get: function () {
            return this._dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "dialogType", {
        get: function () {
            return this._dialogType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "domainClassName", {
        get: function () {
            return this._domainClassName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "fromDialogProperties", {
        get: function () {
            return this._fromDialogProperties;
        },
        set: function (props) {
            this._fromDialogProperties = props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "isEditor", {
        get: function () {
            return this._dialogType === 'EDITOR';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "isQuery", {
        get: function () {
            return this._dialogType === 'QUERY';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "objectId", {
        get: function () {
            return this._objectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "open", {
        get: function () {
            return this._open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "paneMode", {
        get: function () {
            return this._paneMode;
        },
        enumerable: true,
        configurable: true
    });
    return DialogRedirection;
}(Redirection));
exports.DialogRedirection = DialogRedirection;
/**
 * *********************************
 */
var NullRedirection = (function (_super) {
    __extends(NullRedirection, _super);
    function NullRedirection(fromDialogProperties) {
        _super.call(this);
        this.fromDialogProperties = fromDialogProperties;
    }
    return NullRedirection;
}(Redirection));
exports.NullRedirection = NullRedirection;
/**
 * *********************************
 */
var WebRedirection = (function (_super) {
    __extends(WebRedirection, _super);
    function WebRedirection(_webURL, _open, _dialogProperties, _fromDialogProperties) {
        _super.call(this);
        this._webURL = _webURL;
        this._open = _open;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    Object.defineProperty(WebRedirection.prototype, "fromDialogProperties", {
        get: function () {
            return this._fromDialogProperties;
        },
        set: function (props) {
            this._fromDialogProperties = props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRedirection.prototype, "open", {
        get: function () {
            return this._open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRedirection.prototype, "webURL", {
        get: function () {
            return this._webURL;
        },
        enumerable: true,
        configurable: true
    });
    return WebRedirection;
}(Redirection));
exports.WebRedirection = WebRedirection;
/**
 * *********************************
 */
var WorkbenchRedirection = (function (_super) {
    __extends(WorkbenchRedirection, _super);
    function WorkbenchRedirection(_workbenchId, _dialogProperties, _fromDialogProperties) {
        _super.call(this);
        this._workbenchId = _workbenchId;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    Object.defineProperty(WorkbenchRedirection.prototype, "workbenchId", {
        get: function () {
            return this._workbenchId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchRedirection.prototype, "dialogProperties", {
        get: function () {
            return this._dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchRedirection.prototype, "fromDialogProperties", {
        get: function () {
            return this._fromDialogProperties;
        },
        set: function (props) {
            this._fromDialogProperties = props;
        },
        enumerable: true,
        configurable: true
    });
    return WorkbenchRedirection;
}(Redirection));
exports.WorkbenchRedirection = WorkbenchRedirection;
var EntityRecUtil = (function () {
    function EntityRecUtil() {
    }
    EntityRecUtil.newEntityRec = function (objectId, props, annos) {
        return annos ? new EntityRecImpl(objectId, util_5.ArrayUtil.copy(props), util_5.ArrayUtil.copy(annos)) : new EntityRecImpl(objectId, util_5.ArrayUtil.copy(props));
    };
    EntityRecUtil.union = function (l1, l2) {
        var result = util_5.ArrayUtil.copy(l1);
        l2.forEach(function (p2) {
            if (!l1.some(function (p1, i) {
                if (p1.name === p2.name) {
                    result[i] = p2;
                    return true;
                }
                return false;
            })) {
                result.push(p2);
            }
        });
        return result;
    };
    //module level functions
    EntityRecUtil.fromWSEditorRecord = function (otype, jsonObj) {
        var objectId = jsonObj['objectId'];
        var namesJson = jsonObj['names'];
        if (namesJson['WS_LTYPE'] !== 'String') {
            return new fp_5.Failure('fromWSEditorRecord: Expected WS_LTYPE of String but found ' + namesJson['WS_LTYPE']);
        }
        var namesRaw = namesJson['values'];
        var propsJson = jsonObj['properties'];
        if (propsJson['WS_LTYPE'] !== 'Object') {
            return new fp_5.Failure('fromWSEditorRecord: Expected WS_LTYPE of Object but found ' + propsJson['WS_LTYPE']);
        }
        var propsRaw = propsJson['values'];
        var propsTry = Prop.fromWSNamesAndValues(namesRaw, propsRaw);
        if (propsTry.isFailure)
            return new fp_5.Failure(propsTry.failure);
        var props = propsTry.success;
        if (jsonObj['propertyAnnotations']) {
            var propAnnosObj = jsonObj['propertyAnnotations'];
            var annotatedPropsTry = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
            if (annotatedPropsTry.isFailure)
                return new fp_5.Failure(annotatedPropsTry.failure);
            props = annotatedPropsTry.success;
        }
        var recAnnos = null;
        if (jsonObj['recordAnnotation']) {
            var recAnnosTry = DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
            if (recAnnosTry.isFailure)
                return new fp_5.Failure(recAnnosTry.failure);
            recAnnos = recAnnosTry.success;
        }
        return new fp_4.Success(new EntityRecImpl(objectId, props, recAnnos));
    };
    return EntityRecUtil;
}());
exports.EntityRecUtil = EntityRecUtil;
/**
 * *********************************
 */
var EntityBuffer = (function () {
    function EntityBuffer(_before, _after) {
        this._before = _before;
        this._after = _after;
        if (!_before)
            throw new Error('_before is null in EntityBuffer');
        if (!_after)
            this._after = _before;
    }
    EntityBuffer.createEntityBuffer = function (objectId, before, after) {
        return new EntityBuffer(EntityRecUtil.newEntityRec(objectId, before), EntityRecUtil.newEntityRec(objectId, after));
    };
    Object.defineProperty(EntityBuffer.prototype, "after", {
        get: function () {
            return this._after;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "annos", {
        get: function () {
            return this._after.annos;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.annosAtName = function (propName) {
        return this._after.annosAtName(propName);
    };
    EntityBuffer.prototype.afterEffects = function (afterAnother) {
        if (afterAnother) {
            return this._after.afterEffects(afterAnother);
        }
        else {
            return this._before.afterEffects(this._after);
        }
    };
    Object.defineProperty(EntityBuffer.prototype, "backgroundColor", {
        get: function () {
            return this._after.backgroundColor;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.backgroundColorFor = function (propName) {
        return this._after.backgroundColorFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "before", {
        get: function () {
            return this._before;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "foregroundColor", {
        get: function () {
            return this._after.foregroundColor;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.foregroundColorFor = function (propName) {
        return this._after.foregroundColorFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "imageName", {
        get: function () {
            return this._after.imageName;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.imageNameFor = function (propName) {
        return this._after.imageNameFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "imagePlacement", {
        get: function () {
            return this._after.imagePlacement;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.imagePlacementFor = function (propName) {
        return this._after.imagePlacement;
    };
    Object.defineProperty(EntityBuffer.prototype, "isBoldText", {
        get: function () {
            return this._after.isBoldText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isBoldTextFor = function (propName) {
        return this._after.isBoldTextFor(propName);
    };
    EntityBuffer.prototype.isChanged = function (name) {
        var before = this._before.propAtName(name);
        var after = this._after.propAtName(name);
        return (before && after) ? !before.equals(after) : !(!before && !after);
    };
    Object.defineProperty(EntityBuffer.prototype, "isItalicText", {
        get: function () {
            return this._after.isItalicText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isItalicTextFor = function (propName) {
        return this._after.isItalicTextFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementCenter", {
        get: function () {
            return this._after.isPlacementCenter;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementCenterFor = function (propName) {
        return this._after.isPlacementCenterFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementLeft", {
        get: function () {
            return this._after.isPlacementLeft;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementLeftFor = function (propName) {
        return this._after.isPlacementLeftFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementRight", {
        get: function () {
            return this._after.isPlacementRight;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementRightFor = function (propName) {
        return this._after.isPlacementRightFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementStretchUnder", {
        get: function () {
            return this._after.isPlacementStretchUnder;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementStretchUnderFor = function (propName) {
        return this._after.isPlacementStretchUnderFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementUnder", {
        get: function () {
            return this._after.isPlacementUnder;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementUnderFor = function (propName) {
        return this._after.isPlacementUnderFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isUnderline", {
        get: function () {
            return this._after.isUnderline;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isUnderlineFor = function (propName) {
        return this._after.isUnderlineFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "objectId", {
        get: function () {
            return this._after.objectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "overrideText", {
        get: function () {
            return this._after.overrideText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.overrideTextFor = function (propName) {
        return this._after.overrideTextFor(propName);
    };
    EntityBuffer.prototype.propAtIndex = function (index) {
        return this.props[index];
    };
    EntityBuffer.prototype.propAtName = function (propName) {
        return this._after.propAtName(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "propCount", {
        get: function () {
            return this._after.propCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "propNames", {
        get: function () {
            return this._after.propNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "props", {
        get: function () {
            return this._after.props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "propValues", {
        get: function () {
            return this._after.propValues;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.setValue = function (name, value) {
        var newProps = [];
        var found = false;
        this.props.forEach(function (prop) {
            if (prop.name === name) {
                newProps.push(new Prop(name, value));
                found = true;
            }
            else {
                newProps.push(prop);
            }
        });
        if (!found) {
            newProps.push(new Prop(name, value));
        }
        this._after = EntityRecUtil.newEntityRec(this.objectId, newProps, this.annos);
    };
    Object.defineProperty(EntityBuffer.prototype, "tipText", {
        get: function () {
            return this._after.tipText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.tipTextFor = function (propName) {
        return this._after.tipTextFor(propName);
    };
    EntityBuffer.prototype.toEntityRec = function () {
        return EntityRecUtil.newEntityRec(this.objectId, this.props);
    };
    EntityBuffer.prototype.toWSEditorRecord = function () {
        return this.afterEffects().toWSEditorRecord();
    };
    EntityBuffer.prototype.toWS = function () {
        return this.afterEffects().toWS();
    };
    EntityBuffer.prototype.valueAtName = function (propName) {
        return this._after.valueAtName(propName);
    };
    return EntityBuffer;
}());
exports.EntityBuffer = EntityBuffer;
/**
 * *********************************
 */
var EntityRecImpl = (function () {
    function EntityRecImpl(objectId, props, annos) {
        if (props === void 0) { props = []; }
        if (annos === void 0) { annos = []; }
        this.objectId = objectId;
        this.props = props;
        this.annos = annos;
    }
    EntityRecImpl.prototype.annosAtName = function (propName) {
        var p = this.propAtName(propName);
        return p ? p.annos : [];
    };
    EntityRecImpl.prototype.afterEffects = function (after) {
        var _this = this;
        var effects = [];
        after.props.forEach(function (afterProp) {
            var beforeProp = _this.propAtName(afterProp.name);
            if (!afterProp.equals(beforeProp)) {
                effects.push(afterProp);
            }
        });
        return new EntityRecImpl(after.objectId, effects);
    };
    Object.defineProperty(EntityRecImpl.prototype, "backgroundColor", {
        get: function () {
            return DataAnno.backgroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.backgroundColorFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.backgroundColor ? p.backgroundColor : this.backgroundColor;
    };
    Object.defineProperty(EntityRecImpl.prototype, "foregroundColor", {
        get: function () {
            return DataAnno.foregroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.foregroundColorFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.foregroundColor ? p.foregroundColor : this.foregroundColor;
    };
    Object.defineProperty(EntityRecImpl.prototype, "imageName", {
        get: function () {
            return DataAnno.imageName(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.imageNameFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.imageName ? p.imageName : this.imageName;
    };
    Object.defineProperty(EntityRecImpl.prototype, "imagePlacement", {
        get: function () {
            return DataAnno.imagePlacement(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.imagePlacementFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.imagePlacement ? p.imagePlacement : this.imagePlacement;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isBoldText", {
        get: function () {
            return DataAnno.isBoldText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isBoldTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isBoldText ? p.isBoldText : this.isBoldText;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isItalicText", {
        get: function () {
            return DataAnno.isItalicText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isItalicTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isItalicText ? p.isItalicText : this.isItalicText;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementCenter", {
        get: function () {
            return DataAnno.isPlacementCenter(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementCenterFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementCenter ? p.isPlacementCenter : this.isPlacementCenter;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementLeft", {
        get: function () {
            return DataAnno.isPlacementLeft(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementLeftFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementLeft ? p.isPlacementLeft : this.isPlacementLeft;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementRight", {
        get: function () {
            return DataAnno.isPlacementRight(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementRightFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementRight ? p.isPlacementRight : this.isPlacementRight;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementStretchUnder", {
        get: function () {
            return DataAnno.isPlacementStretchUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementStretchUnderFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementStretchUnder ? p.isPlacementStretchUnder : this.isPlacementStretchUnder;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementUnder", {
        get: function () {
            return DataAnno.isPlacementUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementUnderFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementUnder ? p.isPlacementUnder : this.isPlacementUnder;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isUnderline", {
        get: function () {
            return DataAnno.isUnderlineText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isUnderlineFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isUnderline ? p.isUnderline : this.isUnderline;
    };
    Object.defineProperty(EntityRecImpl.prototype, "overrideText", {
        get: function () {
            return DataAnno.overrideText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.overrideTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.overrideText ? p.overrideText : this.overrideText;
    };
    EntityRecImpl.prototype.propAtIndex = function (index) {
        return this.props[index];
    };
    EntityRecImpl.prototype.propAtName = function (propName) {
        var prop = null;
        this.props.some(function (p) {
            if (p.name === propName) {
                prop = p;
                return true;
            }
            return false;
        });
        return prop;
    };
    Object.defineProperty(EntityRecImpl.prototype, "propCount", {
        get: function () {
            return this.props.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "propNames", {
        get: function () {
            return this.props.map(function (p) {
                return p.name;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "propValues", {
        get: function () {
            return this.props.map(function (p) {
                return p.value;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "tipText", {
        get: function () {
            return DataAnno.tipText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.tipTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.tipText ? p.tipText : this.tipText;
    };
    EntityRecImpl.prototype.toEntityRec = function () {
        return this;
    };
    EntityRecImpl.prototype.toWSEditorRecord = function () {
        var result = { 'WS_OTYPE': 'WSEditorRecord' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['names'] = Prop.toWSListOfString(this.propNames);
        result['properties'] = Prop.toWSListOfProperties(this.propValues);
        return result;
    };
    EntityRecImpl.prototype.toWS = function () {
        var result = { 'WS_OTYPE': 'WSEntityRec' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['props'] = Prop.toListOfWSProp(this.props);
        if (this.annos)
            result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    };
    EntityRecImpl.prototype.valueAtName = function (propName) {
        var value = null;
        this.props.some(function (p) {
            if (p.name === propName) {
                value = p.value;
                return true;
            }
            return false;
        });
        return value;
    };
    return EntityRecImpl;
}());
exports.EntityRecImpl = EntityRecImpl;
/**
 * *********************************
 */
var NullEntityRec = (function () {
    function NullEntityRec() {
    }
    Object.defineProperty(NullEntityRec.prototype, "annos", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.annosAtName = function (propName) {
        return [];
    };
    NullEntityRec.prototype.afterEffects = function (after) {
        return after;
    };
    Object.defineProperty(NullEntityRec.prototype, "backgroundColor", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.backgroundColorFor = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "foregroundColor", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.foregroundColorFor = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "imageName", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.imageNameFor = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "imagePlacement", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.imagePlacementFor = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "isBoldText", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isBoldTextFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isItalicText", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isItalicTextFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementCenter", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementCenterFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementLeft", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementLeftFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementRight", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementRightFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementStretchUnder", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementStretchUnderFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementUnder", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementUnderFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isUnderline", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isUnderlineFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "objectId", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "overrideText", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.overrideTextFor = function (propName) {
        return null;
    };
    NullEntityRec.prototype.propAtIndex = function (index) {
        return null;
    };
    NullEntityRec.prototype.propAtName = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "propCount", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "propNames", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "props", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "propValues", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "tipText", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.tipTextFor = function (propName) {
        return null;
    };
    NullEntityRec.prototype.toEntityRec = function () {
        return this;
    };
    NullEntityRec.prototype.toWSEditorRecord = function () {
        var result = { 'WS_OTYPE': 'WSEditorRecord' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['names'] = Prop.toWSListOfString(this.propNames);
        result['properties'] = Prop.toWSListOfProperties(this.propValues);
        return result;
    };
    NullEntityRec.prototype.toWS = function () {
        var result = { 'WS_OTYPE': 'WSEntityRec' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['props'] = Prop.toListOfWSProp(this.props);
        if (this.annos)
            result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    };
    NullEntityRec.prototype.valueAtName = function (propName) {
        return null;
    };
    NullEntityRec.singleton = new NullEntityRec();
    return NullEntityRec;
}());
exports.NullEntityRec = NullEntityRec;
/**
 * *********************************
 */
var AppContextState;
(function (AppContextState) {
    AppContextState[AppContextState["LOGGED_OUT"] = 0] = "LOGGED_OUT";
    AppContextState[AppContextState["LOGGED_IN"] = 1] = "LOGGED_IN";
})(AppContextState || (AppContextState = {}));
var AppContextValues = (function () {
    function AppContextValues(sessionContext, appWinDef, tenantSettings) {
        this.sessionContext = sessionContext;
        this.appWinDef = appWinDef;
        this.tenantSettings = tenantSettings;
    }
    return AppContextValues;
}());
var AppContext = (function () {
    function AppContext() {
        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._deviceProps = [];
        this.setAppContextStateToLoggedOut();
        AppContext._singleton = this;
    }
    Object.defineProperty(AppContext, "defaultTTLInMillis", {
        get: function () {
            return AppContext.ONE_DAY_IN_MILLIS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext, "singleton", {
        get: function () {
            if (!AppContext._singleton) {
                AppContext._singleton = new AppContext();
            }
            return AppContext._singleton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "appWinDefTry", {
        get: function () {
            return this._appWinDefTry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "deviceProps", {
        get: function () {
            return this._deviceProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "isLoggedIn", {
        get: function () {
            return this._appContextState === AppContextState.LOGGED_IN;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.getWorkbench = function (sessionContext, workbenchId) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return fp_3.Future.createFailedFuture("AppContext::getWorkbench", "User is logged out");
        }
        return WorkbenchService.getWorkbench(sessionContext, workbenchId);
    };
    AppContext.prototype.login = function (gatewayHost, tenantId, clientType, userId, password) {
        var _this = this;
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return fp_3.Future.createFailedFuture("AppContext::login", "User is already logged in");
        }
        var answer;
        var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
        return appContextValuesFr.bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return fp_3.Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    };
    AppContext.prototype.loginDirectly = function (url, tenantId, clientType, userId, password) {
        var _this = this;
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return fp_3.Future.createFailedFuture("AppContext::loginDirectly", "User is already logged in");
        }
        return this.loginFromSystemContext(new SystemContextImpl(url), tenantId, userId, password, this.deviceProps, clientType).bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return fp_3.Future.createSuccessfulFuture('AppContext::loginDirectly', appContextValues.appWinDef);
        });
    };
    AppContext.prototype.logout = function () {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return fp_3.Future.createFailedFuture("AppContext::loginDirectly", "User is already logged out");
        }
        var result = SessionService.deleteSession(this.sessionContextTry.success);
        result.onComplete(function (deleteSessionTry) {
            if (deleteSessionTry.isFailure) {
                util_2.Log.error('Error while logging out: ' + util_3.ObjUtil.formatRecAttr(deleteSessionTry.failure));
            }
        });
        this.setAppContextStateToLoggedOut();
        return result;
    };
    AppContext.prototype.performLaunchAction = function (launchAction) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return fp_3.Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
        }
        return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
    };
    AppContext.prototype.refreshContext = function (sessionContext, deviceProps) {
        var _this = this;
        if (deviceProps === void 0) { deviceProps = []; }
        var appContextValuesFr = this.finalizeContext(sessionContext, deviceProps);
        return appContextValuesFr.bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return fp_3.Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    };
    Object.defineProperty(AppContext.prototype, "sessionContextTry", {
        get: function () {
            return this._sessionContextTry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "tenantSettingsTry", {
        get: function () {
            return this._tenantSettingsTry;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.finalizeContext = function (sessionContext, deviceProps) {
        var devicePropName = "com.catavolt.session.property.DeviceProperties";
        return SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind(function (setPropertyListResult) {
            var listPropName = "com.catavolt.session.property.TenantProperties";
            return SessionService.getSessionListProperty(listPropName, sessionContext).bind(function (listPropertyResult) {
                return WorkbenchService.getAppWinDef(sessionContext).bind(function (appWinDef) {
                    return fp_3.Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext", new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
                });
            });
        });
    };
    AppContext.prototype.loginOnline = function (gatewayHost, tenantId, clientType, userId, password, deviceProps) {
        var _this = this;
        var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
        return systemContextFr.bind(function (sc) {
            return _this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
        });
    };
    AppContext.prototype.loginFromSystemContext = function (systemContext, tenantId, userId, password, deviceProps, clientType) {
        var _this = this;
        var sessionContextFuture = SessionService.createSession(tenantId, userId, password, clientType, systemContext);
        return sessionContextFuture.bind(function (sessionContext) {
            return _this.finalizeContext(sessionContext, deviceProps);
        });
    };
    AppContext.prototype.newSystemContextFr = function (gatewayHost, tenantId) {
        var serviceEndpoint = GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
        return serviceEndpoint.map(function (serviceEndpoint) {
            return new SystemContextImpl(serviceEndpoint.serverAssignment);
        });
    };
    AppContext.prototype.performLaunchActionOnline = function (launchAction, sessionContext) {
        var redirFr = WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
        return redirFr.bind(function (r) {
            return NavRequestUtil.fromRedirection(r, launchAction, sessionContext);
        });
    };
    AppContext.prototype.setAppContextStateToLoggedIn = function (appContextValues) {
        this._appWinDefTry = new fp_4.Success(appContextValues.appWinDef);
        this._tenantSettingsTry = new fp_4.Success(appContextValues.tenantSettings);
        this._sessionContextTry = new fp_4.Success(appContextValues.sessionContext);
        this._appContextState = AppContextState.LOGGED_IN;
    };
    AppContext.prototype.setAppContextStateToLoggedOut = function () {
        this._appWinDefTry = new fp_5.Failure("Not logged in");
        this._tenantSettingsTry = new fp_5.Failure('Not logged in"');
        this._sessionContextTry = new fp_5.Failure('Not loggged in');
        this._appContextState = AppContextState.LOGGED_OUT;
    };
    AppContext.ONE_DAY_IN_MILLIS = 60 * 60 * 24 * 1000;
    return AppContext;
}());
exports.AppContext = AppContext;
/**
 * *********************************
 */
var AppWinDef = (function () {
    function AppWinDef(workbenches, appVendors, windowTitle, windowWidth, windowHeight) {
        this._workbenches = workbenches || [];
        this._applicationVendors = appVendors || [];
        this._windowTitle = windowTitle;
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;
    }
    Object.defineProperty(AppWinDef.prototype, "appVendors", {
        get: function () {
            return this._applicationVendors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowHeight", {
        get: function () {
            return this._windowHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowTitle", {
        get: function () {
            return this._windowTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowWidth", {
        get: function () {
            return this._windowWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "workbenches", {
        get: function () {
            return this._workbenches;
        },
        enumerable: true,
        configurable: true
    });
    return AppWinDef;
}());
exports.AppWinDef = AppWinDef;
/**
 * *********************************
 */
/*
 @TODO

 Test all of the deserialization methods
 They should all be handled, but the cover many of the edge cases (i.e. List<List<CellDef>>)
 */
var CellDef = (function () {
    function CellDef(_values) {
        this._values = _values;
    }
    Object.defineProperty(CellDef.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    return CellDef;
}());
exports.CellDef = CellDef;
/**
 * *********************************
 */
var CodeRef = (function () {
    function CodeRef(_code, _description) {
        this._code = _code;
        this._description = _description;
    }
    CodeRef.fromFormattedValue = function (value) {
        var pair = util_4.StringUtil.splitSimpleKeyValuePair(value);
        return new CodeRef(pair[0], pair[1]);
    };
    Object.defineProperty(CodeRef.prototype, "code", {
        get: function () {
            return this._code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeRef.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    CodeRef.prototype.toString = function () {
        return this.code + ":" + this.description;
    };
    return CodeRef;
}());
exports.CodeRef = CodeRef;
/**
 * *********************************
 */
var ColumnDef = (function () {
    function ColumnDef(_name, _heading, _propertyDef) {
        this._name = _name;
        this._heading = _heading;
        this._propertyDef = _propertyDef;
    }
    Object.defineProperty(ColumnDef.prototype, "heading", {
        get: function () {
            return this._heading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "isInlineMediaStyle", {
        get: function () {
            return this._propertyDef.isInlineMediaStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "propertyDef", {
        get: function () {
            return this._propertyDef;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnDef;
}());
exports.ColumnDef = ColumnDef;
/**
 * *********************************
 */
var ContextAction = (function () {
    function ContextAction(actionId, objectId, fromActionSource) {
        this.actionId = actionId;
        this.objectId = objectId;
        this.fromActionSource = fromActionSource;
    }
    Object.defineProperty(ContextAction.prototype, "virtualPathSuffix", {
        get: function () {
            return [this.objectId, this.actionId];
        },
        enumerable: true,
        configurable: true
    });
    return ContextAction;
}());
exports.ContextAction = ContextAction;
/**
 * *********************************
 */
var DataAnno = (function () {
    function DataAnno(_name, _value) {
        this._name = _name;
        this._value = _value;
    }
    DataAnno.annotatePropsUsingWSDataAnnotation = function (props, jsonObj) {
        return DialogTriple.fromListOfWSDialogObject(jsonObj, 'WSDataAnnotation', OType.factoryFn).bind(function (propAnnos) {
            var annotatedProps = [];
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                var annos = propAnnos[i];
                if (annos) {
                    annotatedProps.push(new Prop(p.name, p.value, annos));
                }
                else {
                    annotatedProps.push(p);
                }
            }
            return new fp_4.Success(annotatedProps);
        });
    };
    DataAnno.backgroundColor = function (annos) {
        var result = util_5.ArrayUtil.find(annos, function (anno) {
            return anno.isBackgroundColor;
        });
        return result ? result.backgroundColor : null;
    };
    DataAnno.foregroundColor = function (annos) {
        var result = util_5.ArrayUtil.find(annos, function (anno) {
            return anno.isForegroundColor;
        });
        return result ? result.foregroundColor : null;
    };
    DataAnno.fromWS = function (otype, jsonObj) {
        var stringObj = jsonObj['annotations'];
        if (stringObj['WS_LTYPE'] !== 'String') {
            return new fp_5.Failure('DataAnno:fromWS: expected WS_LTYPE of String but found ' + stringObj['WS_LTYPE']);
        }
        var annoStrings = stringObj['values'];
        var annos = [];
        for (var i = 0; i < annoStrings.length; i++) {
            annos.push(DataAnno.parseString(annoStrings[i]));
        }
        return new fp_4.Success(annos);
    };
    DataAnno.imageName = function (annos) {
        var result = util_5.ArrayUtil.find(annos, function (anno) {
            return anno.isImageName;
        });
        return result ? result.value : null;
    };
    DataAnno.imagePlacement = function (annos) {
        var result = util_5.ArrayUtil.find(annos, function (anno) {
            return anno.isImagePlacement;
        });
        return result ? result.value : null;
    };
    DataAnno.isBoldText = function (annos) {
        return annos.some(function (anno) {
            return anno.isBoldText;
        });
    };
    DataAnno.isItalicText = function (annos) {
        return annos.some(function (anno) {
            return anno.isItalicText;
        });
    };
    DataAnno.isPlacementCenter = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementCenter;
        });
    };
    DataAnno.isPlacementLeft = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementLeft;
        });
    };
    DataAnno.isPlacementRight = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementRight;
        });
    };
    DataAnno.isPlacementStretchUnder = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementStretchUnder;
        });
    };
    DataAnno.isPlacementUnder = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementUnder;
        });
    };
    DataAnno.isUnderlineText = function (annos) {
        return annos.some(function (anno) {
            return anno.isUnderlineText;
        });
    };
    DataAnno.overrideText = function (annos) {
        var result = util_5.ArrayUtil.find(annos, function (anno) {
            return anno.isOverrideText;
        });
        return result ? result.value : null;
    };
    DataAnno.tipText = function (annos) {
        var result = util_5.ArrayUtil.find(annos, function (anno) {
            return anno.isTipText;
        });
        return result ? result.value : null;
    };
    DataAnno.toListOfWSDataAnno = function (annos) {
        var result = { 'WS_LTYPE': 'WSDataAnno' };
        var values = [];
        annos.forEach(function (anno) {
            values.push(anno.toWS());
        });
        result['values'] = values;
        return result;
    };
    DataAnno.parseString = function (formatted) {
        var pair = util_4.StringUtil.splitSimpleKeyValuePair(formatted);
        return new DataAnno(pair[0], pair[1]);
    };
    Object.defineProperty(DataAnno.prototype, "backgroundColor", {
        get: function () {
            return this.isBackgroundColor ? this.value : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "foregroundColor", {
        get: function () {
            return this.isForegroundColor ? this.value : null;
        },
        enumerable: true,
        configurable: true
    });
    DataAnno.prototype.equals = function (dataAnno) {
        return this.name === dataAnno.name;
    };
    Object.defineProperty(DataAnno.prototype, "isBackgroundColor", {
        get: function () {
            return this.name === DataAnno.BACKGROUND_COLOR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isBoldText", {
        get: function () {
            return this.name === DataAnno.BOLD_TEXT && this.value === DataAnno.TRUE_VALUE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isForegroundColor", {
        get: function () {
            return this.name === DataAnno.FOREGROUND_COLOR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isImageName", {
        get: function () {
            return this.name === DataAnno.IMAGE_NAME;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isImagePlacement", {
        get: function () {
            return this.name === DataAnno.IMAGE_PLACEMENT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isItalicText", {
        get: function () {
            return this.name === DataAnno.ITALIC_TEXT && this.value === DataAnno.TRUE_VALUE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isOverrideText", {
        get: function () {
            return this.name === DataAnno.OVERRIDE_TEXT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementCenter", {
        get: function () {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_CENTER;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementLeft", {
        get: function () {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_LEFT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementRight", {
        get: function () {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_RIGHT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementStretchUnder", {
        get: function () {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_STRETCH_UNDER;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementUnder", {
        get: function () {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_UNDER;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isTipText", {
        get: function () {
            return this.name === DataAnno.TIP_TEXT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isUnderlineText", {
        get: function () {
            return this.name === DataAnno.UNDERLINE && this.value === DataAnno.TRUE_VALUE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    DataAnno.prototype.toWS = function () {
        return { 'WS_OTYPE': 'WSDataAnno', 'name': this.name, 'value': this.value };
    };
    DataAnno.BOLD_TEXT = "BOLD_TEXT";
    DataAnno.BACKGROUND_COLOR = "BGND_COLOR";
    DataAnno.FOREGROUND_COLOR = "FGND_COLOR";
    DataAnno.IMAGE_NAME = "IMAGE_NAME";
    DataAnno.IMAGE_PLACEMENT = "IMAGE_PLACEMENT";
    DataAnno.ITALIC_TEXT = "ITALIC_TEXT";
    DataAnno.OVERRIDE_TEXT = "OVRD_TEXT";
    DataAnno.TIP_TEXT = "TIP_TEXT";
    DataAnno.UNDERLINE = "UNDERLINE";
    DataAnno.TRUE_VALUE = "1";
    DataAnno.PLACEMENT_CENTER = "CENTER";
    DataAnno.PLACEMENT_LEFT = "LEFT";
    DataAnno.PLACEMENT_RIGHT = "RIGHT";
    DataAnno.PLACEMENT_UNDER = "UNDER";
    DataAnno.PLACEMENT_STRETCH_UNDER = "STRETCH_UNDER";
    return DataAnno;
}());
exports.DataAnno = DataAnno;
/**
 * *********************************
 */
var DialogHandle = (function () {
    function DialogHandle(handleValue, sessionHandle) {
        this.handleValue = handleValue;
        this.sessionHandle = sessionHandle;
    }
    return DialogHandle;
}());
exports.DialogHandle = DialogHandle;
/**
 * *********************************
 */
var DialogService = (function () {
    function DialogService() {
    }
    DialogService.changePaneMode = function (dialogHandle, paneMode, sessionContext) {
        var method = 'changePaneMode';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'paneMode': PaneMode[paneMode]
        };
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('changePaneMode', DialogTriple.fromWSDialogObject(result, 'WSChangePaneModeResult', OType.factoryFn));
        });
    };
    DialogService.closeEditorModel = function (dialogHandle, sessionContext) {
        var method = 'close';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createSuccessfulFuture('closeEditorModel', result);
        });
    };
    DialogService.getAvailableValues = function (dialogHandle, propertyName, pendingWrites, sessionContext) {
        var method = 'getAvailableValues';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName
        };
        if (pendingWrites)
            params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('getAvailableValues', DialogTriple.fromWSDialogObject(result, 'WSGetAvailableValuesResult', OType.factoryFn));
        });
    };
    DialogService.getActiveColumnDefs = function (dialogHandle, sessionContext) {
        var method = 'getActiveColumnDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('getActiveColumnDefs', DialogTriple.fromWSDialogObject(result, 'WSGetActiveColumnDefsResult', OType.factoryFn));
        });
    };
    DialogService.getEditorModelMenuDefs = function (dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('getEditorModelMenuDefs', DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', OType.factoryFn));
        });
    };
    DialogService.getEditorModelPaneDef = function (dialogHandle, paneId, sessionContext) {
        var method = 'getPaneDef';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        params['paneId'] = paneId;
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('getEditorModelPaneDef', DialogTriple.fromWSDialogObjectResult(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', OType.factoryFn));
        });
    };
    DialogService.getQueryModelMenuDefs = function (dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('getQueryModelMenuDefs', DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', OType.factoryFn));
        });
    };
    DialogService.openEditorModelFromRedir = function (redirection, sessionContext) {
        var method = 'open2';
        var params = {
            'editorMode': redirection.dialogMode,
            'dialogHandle': OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')
        };
        if (redirection.objectId)
            params['objectId'] = redirection.objectId;
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('openEditorModelFromRedir', DialogTriple.fromWSDialogObject(result, 'WSOpenEditorModelResult', OType.factoryFn));
        });
    };
    DialogService.openQueryModelFromRedir = function (redirection, sessionContext) {
        if (!redirection.isQuery)
            return fp_3.Future.createFailedFuture('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
        var method = 'open';
        var params = { 'dialogHandle': OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
        var call = ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('openQueryModelFromRedir', DialogTriple.fromWSDialogObject(result, 'WSOpenQueryModelResult', OType.factoryFn));
        });
    };
    DialogService.performEditorAction = function (dialogHandle, actionId, pendingWrites, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (pendingWrites)
            params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new fp_4.Success(r);
            }
            return fp_3.Future.createCompletedFuture('performEditorAction', redirectionTry);
        });
    };
    DialogService.performQueryAction = function (dialogHandle, actionId, targets, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (targets) {
            params['targets'] = targets;
        }
        var call = ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new fp_4.Success(r);
            }
            return fp_3.Future.createCompletedFuture('performQueryAction', redirectionTry);
        });
    };
    DialogService.processSideEffects = function (dialogHandle, sessionContext, propertyName, propertyValue, pendingWrites) {
        var method = 'handlePropertyChange';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'propertyValue': Prop.toWSProperty(propertyValue),
            'pendingWrites': pendingWrites.toWSEditorRecord()
        };
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('processSideEffects', DialogTriple.fromWSDialogObject(result, 'WSHandlePropertyChangeResult', OType.factoryFn));
        });
    };
    DialogService.queryQueryModel = function (dialogHandle, direction, maxRows, fromObjectId, sessionContext) {
        var method = 'query';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'maxRows': maxRows,
            'direction': direction === QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
        };
        if (fromObjectId && fromObjectId.trim() !== '') {
            params['fromObjectId'] = fromObjectId.trim();
        }
        util_2.Log.info('Running query');
        var call = ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var call = ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return fp_3.Future.createCompletedFuture('DialogService::queryQueryModel', DialogTriple.fromWSDialogObject(result, 'WSQueryResult', OType.factoryFn));
        });
    };
    DialogService.readEditorModel = function (dialogHandle, sessionContext) {
        var method = 'read';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('readEditorModel', DialogTriple.fromWSDialogObject(result, 'WSReadResult', OType.factoryFn));
        });
    };
    DialogService.readEditorProperty = function (dialogHandle, propertyName, readSeq, readLength, sessionContext) {
        var method = 'readProperty';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'readSeq': readSeq,
            'readLength': readLength
        };
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('readProperty', DialogTriple.fromWSDialogObject(result, 'WSReadPropertyResult', OType.factoryFn));
        });
    };
    DialogService.readQueryProperty = function (dialogHandle, propertyName, objectId, readSeq, readLength, sessionContext) {
        var method = 'readProperty';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'objectId': objectId,
            'readSeq': readSeq,
            'readLength': readLength
        };
        var call = ws_1.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('readProperty', DialogTriple.fromWSDialogObject(result, 'WSReadPropertyResult', OType.factoryFn));
        });
    };
    DialogService.writeEditorModel = function (dialogHandle, entityRec, sessionContext) {
        var method = 'write';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'editorRecord': entityRec.toWSEditorRecord()
        };
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var writeResultTry = DialogTriple.extractTriple(result, 'WSWriteResult', function () {
                return OType.deserializeObject(result, 'XWriteResult', OType.factoryFn);
            });
            if (writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                var redirection = writeResultTry.success.left;
                redirection.fromDialogProperties = result['dialogProperties'] || {};
                writeResultTry = new fp_4.Success(fp_2.Either.left(redirection));
            }
            return fp_3.Future.createCompletedFuture('writeEditorModel', writeResultTry);
        });
    };
    DialogService.writeProperty = function (dialogHandle, propertyName, data, append, sessionContext) {
        var method = 'writeProperty';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'data': data,
            'append': append
        };
        var call = ws_1.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture('writeProperty', DialogTriple.fromWSDialogObject(result, 'WSWritePropertyResult', OType.factoryFn));
        });
    };
    DialogService.EDITOR_SERVICE_NAME = 'EditorService';
    DialogService.EDITOR_SERVICE_PATH = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
    DialogService.QUERY_SERVICE_NAME = 'QueryService';
    DialogService.QUERY_SERVICE_PATH = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;
    return DialogService;
}());
exports.DialogService = DialogService;
/**
 * *********************************
 */
var DialogTriple = (function () {
    function DialogTriple() {
    }
    DialogTriple.extractList = function (jsonObject, Ltype, extractor) {
        var result;
        if (jsonObject) {
            var lt = jsonObject['WS_LTYPE'];
            if (Ltype === lt) {
                if (jsonObject['values']) {
                    var realValues = [];
                    var values = jsonObject['values'];
                    values.every(function (item) {
                        var extdValue = extractor(item);
                        if (extdValue.isFailure) {
                            result = new fp_5.Failure(extdValue.failure);
                            return false;
                        }
                        realValues.push(extdValue.success);
                        return true;
                    });
                    if (!result) {
                        result = new fp_4.Success(realValues);
                    }
                }
                else {
                    result = new fp_5.Failure("DialogTriple::extractList: Values array not found");
                }
            }
            else {
                result = new fp_5.Failure("DialogTriple::extractList: Expected WS_LTYPE " + Ltype + " but found " + lt);
            }
        }
        return result;
    };
    DialogTriple.extractRedirection = function (jsonObject, Otype) {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false, function () {
            return new fp_4.Success(new NullRedirection({}));
        });
        var answer;
        if (tripleTry.isSuccess) {
            var triple = tripleTry.success;
            answer = triple.isLeft ? new fp_4.Success(triple.left) : new fp_4.Success(triple.right);
        }
        else {
            answer = new fp_5.Failure(tripleTry.failure);
        }
        return answer;
    };
    DialogTriple.extractTriple = function (jsonObject, Otype, extractor) {
        return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
    };
    DialogTriple.extractValue = function (jsonObject, Otype, extractor) {
        return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
    };
    DialogTriple.extractValueIgnoringRedirection = function (jsonObject, Otype, extractor) {
        return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
    };
    DialogTriple.fromWSDialogObject = function (obj, Otype, factoryFn, ignoreRedirection) {
        if (ignoreRedirection === void 0) { ignoreRedirection = false; }
        if (!obj) {
            return new fp_5.Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');
        }
        else if (typeof obj !== 'object') {
            return new fp_4.Success(obj);
        }
        try {
            if (!factoryFn) {
                /* Assume we're just going to coerce the exiting object */
                return DialogTriple.extractValue(obj, Otype, function () {
                    return new fp_4.Success(obj);
                });
            }
            else {
                if (ignoreRedirection) {
                    return DialogTriple.extractValueIgnoringRedirection(obj, Otype, function () {
                        return OType.deserializeObject(obj, Otype, factoryFn);
                    });
                }
                else {
                    return DialogTriple.extractValue(obj, Otype, function () {
                        return OType.deserializeObject(obj, Otype, factoryFn);
                    });
                }
            }
        }
        catch (e) {
            return new fp_5.Failure('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
        }
    };
    DialogTriple.fromListOfWSDialogObject = function (jsonObject, Ltype, factoryFn, ignoreRedirection) {
        if (ignoreRedirection === void 0) { ignoreRedirection = false; }
        return DialogTriple.extractList(jsonObject, Ltype, function (value) {
            /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
             i.e. list items should be lype assignment compatible*/
            if (!value)
                return new fp_4.Success(null);
            var Otype = value['WS_OTYPE'] || Ltype;
            return DialogTriple.fromWSDialogObject(value, Otype, factoryFn, ignoreRedirection);
        });
    };
    DialogTriple.fromWSDialogObjectResult = function (jsonObject, resultOtype, targetOtype, objPropName, factoryFn) {
        return DialogTriple.extractValue(jsonObject, resultOtype, function () {
            return DialogTriple.fromWSDialogObject(jsonObject[objPropName], targetOtype, factoryFn);
        });
    };
    DialogTriple.fromWSDialogObjectsResult = function (jsonObject, resultOtype, targetLtype, objPropName, factoryFn) {
        return DialogTriple.extractValue(jsonObject, resultOtype, function () {
            return DialogTriple.fromListOfWSDialogObject(jsonObject[objPropName], targetLtype, factoryFn);
        });
    };
    DialogTriple._extractTriple = function (jsonObject, Otype, ignoreRedirection, extractor) {
        if (!jsonObject) {
            return new fp_5.Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
        }
        else {
            if (Array.isArray(jsonObject)) {
                //verify we'll dealing with a nested List
                if (Otype.indexOf('List') !== 0) {
                    return new fp_5.Failure("DialogTriple::extractTriple: expected OType of List<> for Array obj");
                }
            }
            else {
                var ot = jsonObject['WS_OTYPE'];
                if (!ot || Otype !== ot) {
                    return new fp_5.Failure('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                }
                else {
                    if (jsonObject['exception']) {
                        var dialogException = jsonObject['exception'];
                        return new fp_5.Failure(dialogException);
                    }
                    else if (jsonObject['redirection'] && !ignoreRedirection) {
                        var drt = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', OType.factoryFn);
                        if (drt.isFailure) {
                            return new fp_5.Failure(drt.failure);
                        }
                        else {
                            var either = fp_2.Either.left(drt.success);
                            return new fp_4.Success(either);
                        }
                    }
                }
            }
            var result;
            if (extractor) {
                var valueTry = extractor();
                if (valueTry.isFailure) {
                    result = new fp_5.Failure(valueTry.failure);
                }
                else {
                    result = new fp_4.Success(fp_2.Either.right(valueTry.success));
                }
            }
            else {
                result = new fp_5.Failure('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');
            }
            return result;
        }
    };
    DialogTriple._extractValue = function (jsonObject, Otype, ignoreRedirection, extractor) {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, ignoreRedirection, extractor);
        var result;
        if (tripleTry.isFailure) {
            result = new fp_5.Failure(tripleTry.failure);
        }
        else {
            var triple = tripleTry.success;
            if (triple.isLeft) {
                result = new fp_5.Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + Otype);
            }
            else {
                result = new fp_4.Success(triple.right);
            }
        }
        return result;
    };
    return DialogTriple;
}());
exports.DialogTriple = DialogTriple;
/**
 * *********************************
 */
var EditorState;
(function (EditorState) {
    EditorState[EditorState["READ"] = 0] = "READ";
    EditorState[EditorState["WRITE"] = 1] = "WRITE";
    EditorState[EditorState["DESTROYED"] = 2] = "DESTROYED";
})(EditorState || (EditorState = {}));
;
/**
 * *********************************
 */
var EntityRecDef = (function () {
    function EntityRecDef(_propDefs) {
        this._propDefs = _propDefs;
    }
    Object.defineProperty(EntityRecDef.prototype, "propCount", {
        get: function () {
            return this.propDefs.length;
        },
        enumerable: true,
        configurable: true
    });
    EntityRecDef.prototype.propDefAtName = function (name) {
        var propDef = null;
        this.propDefs.some(function (p) {
            if (p.name === name) {
                propDef = p;
                return true;
            }
            return false;
        });
        return propDef;
    };
    Object.defineProperty(EntityRecDef.prototype, "propDefs", {
        // Note we need to support both 'propDefs' and 'propertyDefs' as both
        // field names seem to be used in the dialog model
        get: function () {
            return this._propDefs;
        },
        set: function (propDefs) {
            this._propDefs = propDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecDef.prototype, "propertyDefs", {
        get: function () {
            return this._propDefs;
        },
        set: function (propDefs) {
            this._propDefs = propDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecDef.prototype, "propNames", {
        get: function () {
            return this.propDefs.map(function (p) {
                return p.name;
            });
        },
        enumerable: true,
        configurable: true
    });
    return EntityRecDef;
}());
exports.EntityRecDef = EntityRecDef;
/**
 * *********************************
 */
var FormContextBuilder = (function () {
    function FormContextBuilder(_dialogRedirection, _actionSource, _sessionContext) {
        this._dialogRedirection = _dialogRedirection;
        this._actionSource = _actionSource;
        this._sessionContext = _sessionContext;
    }
    Object.defineProperty(FormContextBuilder.prototype, "actionSource", {
        get: function () {
            return this._actionSource;
        },
        enumerable: true,
        configurable: true
    });
    FormContextBuilder.prototype.build = function () {
        var _this = this;
        if (!this.dialogRedirection.isEditor) {
            return fp_3.Future.createFailedFuture('FormContextBuilder::build', 'Forms with a root query model are not supported');
        }
        var xOpenFr = DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);
        var openAllFr = xOpenFr.bind(function (formXOpen) {
            var formXOpenFr = fp_3.Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
            var formXFormDefFr = _this.fetchXFormDef(formXOpen);
            var formMenuDefsFr = DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, _this.sessionContext);
            var formChildrenFr = formXFormDefFr.bind(function (xFormDef) {
                var childrenXOpenFr = _this.openChildren(formXOpen);
                var childrenXPaneDefsFr = _this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                var childrenActiveColDefsFr = _this.fetchChildrenActiveColDefs(formXOpen);
                var childrenMenuDefsFr = _this.fetchChildrenMenuDefs(formXOpen);
                return fp_3.Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
            });
            return fp_3.Future.sequence([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
        });
        return openAllFr.bind(function (value) {
            var formDefTry = _this.completeOpenPromise(value);
            var formContextTry = null;
            if (formDefTry.isFailure) {
                formContextTry = new fp_5.Failure(formDefTry.failure);
            }
            else {
                var formDef = formDefTry.success;
                var childContexts = _this.createChildrenContexts(formDef);
                var formContext = new FormContext(_this.dialogRedirection, _this._actionSource, formDef, childContexts, false, false, _this.sessionContext);
                formContextTry = new fp_4.Success(formContext);
            }
            return fp_3.Future.createCompletedFuture('FormContextBuilder::build', formContextTry);
        });
    };
    Object.defineProperty(FormContextBuilder.prototype, "dialogRedirection", {
        get: function () {
            return this._dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContextBuilder.prototype, "sessionContext", {
        get: function () {
            return this._sessionContext;
        },
        enumerable: true,
        configurable: true
    });
    FormContextBuilder.prototype.completeOpenPromise = function (openAllResults) {
        var flattenedTry = fp_1.Try.flatten(openAllResults);
        if (flattenedTry.isFailure) {
            return new fp_5.Failure('FormContextBuilder::build: ' + util_3.ObjUtil.formatRecAttr(flattenedTry.failure));
        }
        var flattened = flattenedTry.success;
        if (flattened.length != 4)
            return new fp_5.Failure('FormContextBuilder::build: Open form should have resulted in 4 elements');
        var formXOpen = flattened[0];
        var formXFormDef = flattened[1];
        var formMenuDefs = flattened[2];
        var formChildren = flattened[3];
        if (formChildren.length != 4)
            return new fp_5.Failure('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');
        var childrenXOpens = formChildren[0];
        var childrenXPaneDefs = formChildren[1];
        var childrenXActiveColDefs = formChildren[2];
        var childrenMenuDefs = formChildren[3];
        return FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);
    };
    FormContextBuilder.prototype.createChildrenContexts = function (formDef) {
        var result = [];
        formDef.childrenDefs.forEach(function (paneDef, i) {
            if (paneDef instanceof ListDef) {
                result.push(new ListContext(i));
            }
            else if (paneDef instanceof DetailsDef) {
                result.push(new DetailsContext(i));
            }
            else if (paneDef instanceof MapDef) {
                result.push(new MapContext(i));
            }
            else if (paneDef instanceof GraphDef) {
                result.push(new GraphContext(i));
            }
            else if (paneDef instanceof CalendarDef) {
                result.push(new CalendarContext(i));
            }
            else if (paneDef instanceof ImagePickerDef) {
                result.push(new ImagePickerContext(i));
            }
            else if (paneDef instanceof BarcodeScanDef) {
                result.push(new BarcodeScanContext(i));
            }
            else if (paneDef instanceof GeoFixDef) {
                result.push(new GeoFixContext(i));
            }
            else if (paneDef instanceof GeoLocationDef) {
                result.push(new GeoLocationContext(i));
            }
        });
        return result;
    };
    FormContextBuilder.prototype.fetchChildrenActiveColDefs = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map(function (xComp) {
            if (xComp.redirection.isQuery) {
                return DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            }
            else {
                return fp_3.Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
            }
        });
        return fp_3.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchChildrenMenuDefs = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map(function (xComp) {
            if (xComp.redirection.isEditor) {
                return DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            }
            else {
                return DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            }
        });
        return fp_3.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchChildrenXPaneDefs = function (formXOpen, xFormDef) {
        var _this = this;
        var formHandle = formXOpen.formModel.form.redirection.dialogHandle;
        var xRefs = xFormDef.paneDefRefs;
        var seqOfFutures = xRefs.map(function (xRef) {
            return DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, _this.sessionContext);
        });
        return fp_3.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchXFormDef = function (xformOpenResult) {
        var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
        var formPaneId = xformOpenResult.formPaneId;
        return DialogService.getEditorModelPaneDef(dialogHandle, formPaneId, this.sessionContext).bind(function (value) {
            if (value instanceof XFormDef) {
                return fp_3.Future.createSuccessfulFuture('fetchXFormDef/success', value);
            }
            else {
                return fp_3.Future.createFailedFuture('fetchXFormDef/failure', 'Expected reponse to contain an XFormDef but got ' + util_3.ObjUtil.formatRecAttr(value));
            }
        });
    };
    FormContextBuilder.prototype.openChildren = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = [];
        xComps.forEach(function (nextXComp) {
            var nextFr = null;
            if (nextXComp.redirection.isEditor) {
                nextFr = DialogService.openEditorModelFromRedir(nextXComp.redirection, _this.sessionContext);
            }
            else {
                nextFr = DialogService.openQueryModelFromRedir(nextXComp.redirection, _this.sessionContext);
            }
            seqOfFutures.push(nextFr);
        });
        return fp_3.Future.sequence(seqOfFutures);
    };
    return FormContextBuilder;
}());
exports.FormContextBuilder = FormContextBuilder;
/**
 * *********************************
 */
/*
 @TODO - current the gateway response is mocked, due to cross-domain issues
 This should be removed (and the commented section uncommented for production!!!
 */
var GatewayService = (function () {
    function GatewayService() {
    }
    GatewayService.getServiceEndpoint = function (tenantId, serviceName, gatewayHost) {
        //We have to fake this for now, due to cross domain issues
        /*var fakeResponse = {
        responseType:"soi-json",
        tenantId:"***REMOVED***z",
        serverAssignment:"https://dfw.catavolt.net/vs301",
        appVersion:"1.3.262",soiVersion:"v02"
        }*/
        //var fakeResponse = {responseType:"soi-json",tenantId:"catavolt-qa",serverAssignment:"https://dfw.catavolt.net/vs106",appVersion:"1.3.412",soiVersion:"v02"}
        //var endPointFuture = Future.createSuccessfulFuture<ServiceEndpoint>('serviceEndpoint', <any>fakeResponse);
        var f = ws_2.Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
        var endPointFuture = f.bind(function (jsonObject) {
            //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
            return fp_3.Future.createSuccessfulFuture("serviceEndpoint", jsonObject);
        });
        return endPointFuture;
    };
    return GatewayService;
}());
exports.GatewayService = GatewayService;
/**
 * *********************************
 */
var GeoFix = (function () {
    function GeoFix(_latitude, _longitude, _source, _accuracy) {
        this._latitude = _latitude;
        this._longitude = _longitude;
        this._source = _source;
        this._accuracy = _accuracy;
    }
    GeoFix.fromFormattedValue = function (value) {
        var pair = util_4.StringUtil.splitSimpleKeyValuePair(value);
        return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
    };
    Object.defineProperty(GeoFix.prototype, "latitude", {
        get: function () {
            return this._latitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "longitude", {
        get: function () {
            return this._longitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "accuracy", {
        get: function () {
            return this._accuracy;
        },
        enumerable: true,
        configurable: true
    });
    GeoFix.prototype.toString = function () {
        return this.latitude + ":" + this.longitude;
    };
    return GeoFix;
}());
exports.GeoFix = GeoFix;
/**
 * *********************************
 */
var GeoLocation = (function () {
    function GeoLocation(_latitude, _longitude) {
        this._latitude = _latitude;
        this._longitude = _longitude;
    }
    GeoLocation.fromFormattedValue = function (value) {
        var pair = util_4.StringUtil.splitSimpleKeyValuePair(value);
        return new GeoLocation(Number(pair[0]), Number(pair[1]));
    };
    Object.defineProperty(GeoLocation.prototype, "latitude", {
        get: function () {
            return this._latitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoLocation.prototype, "longitude", {
        get: function () {
            return this._longitude;
        },
        enumerable: true,
        configurable: true
    });
    GeoLocation.prototype.toString = function () {
        return this.latitude + ":" + this.longitude;
    };
    return GeoLocation;
}());
exports.GeoLocation = GeoLocation;
/**
 * *********************************
 */
var GraphDataPointDef = (function () {
    function GraphDataPointDef(_name, _type, _plotType, _legendkey) {
        this._name = _name;
        this._type = _type;
        this._plotType = _plotType;
        this._legendkey = _legendkey;
    }
    return GraphDataPointDef;
}());
exports.GraphDataPointDef = GraphDataPointDef;
/**
 * *********************************
 */
var MenuDef = (function () {
    function MenuDef(_name, _type, _actionId, _mode, _label, _iconName, _directive, _menuDefs) {
        this._name = _name;
        this._type = _type;
        this._actionId = _actionId;
        this._mode = _mode;
        this._label = _label;
        this._iconName = _iconName;
        this._directive = _directive;
        this._menuDefs = _menuDefs;
    }
    MenuDef.findSubMenuDef = function (md, matcher) {
        if (matcher(md))
            return md;
        if (md.menuDefs) {
            for (var i = 0; i < md.menuDefs.length; i++) {
                var result = MenuDef.findSubMenuDef(md.menuDefs[i], matcher);
                if (result)
                    return result;
            }
        }
        return null;
    };
    Object.defineProperty(MenuDef.prototype, "actionId", {
        get: function () {
            return this._actionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "directive", {
        get: function () {
            return this._directive;
        },
        enumerable: true,
        configurable: true
    });
    MenuDef.prototype.findAtId = function (actionId) {
        if (this.actionId === actionId)
            return this;
        var result = null;
        if (this.menuDefs) {
            this.menuDefs.some(function (md) {
                result = md.findAtId(actionId);
                return result != null;
            });
        }
        return result;
    };
    MenuDef.prototype.findContextMenuDef = function () {
        return MenuDef.findSubMenuDef(this, function (md) { return md.name === 'CONTEXT_MENU'; });
    };
    Object.defineProperty(MenuDef.prototype, "iconName", {
        get: function () {
            return this._iconName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "isPresaveDirective", {
        get: function () {
            return this._directive && this._directive === 'PRESAVE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "isRead", {
        get: function () {
            return this._mode && this._mode.indexOf('R') > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "isSeparator", {
        get: function () {
            return this._type && this._type === 'separator';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "isWrite", {
        get: function () {
            return this._mode && this._mode.indexOf('W') > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "menuDefs", {
        get: function () {
            return this._menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return MenuDef;
}());
exports.MenuDef = MenuDef;
var NavRequestUtil = (function () {
    function NavRequestUtil() {
    }
    NavRequestUtil.fromRedirection = function (redirection, actionSource, sessionContext) {
        var result;
        if (redirection instanceof WebRedirection) {
            result = fp_3.Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
        }
        else if (redirection instanceof WorkbenchRedirection) {
            var wbr = redirection;
            result = AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map(function (wb) {
                return wb;
            });
        }
        else if (redirection instanceof DialogRedirection) {
            var dr = redirection;
            var fcb = new FormContextBuilder(dr, actionSource, sessionContext);
            result = fcb.build();
        }
        else if (redirection instanceof NullRedirection) {
            var nullRedir = redirection;
            var nullNavRequest = new NullNavRequest();
            util_3.ObjUtil.addAllProps(nullRedir.fromDialogProperties, nullNavRequest.fromDialogProperties);
            result = fp_3.Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
        }
        else {
            result = fp_3.Future.createFailedFuture('NavRequest::fromRedirection', 'Unrecognized type of Redirection ' + util_3.ObjUtil.formatRecAttr(redirection));
        }
        return result;
    };
    return NavRequestUtil;
}());
exports.NavRequestUtil = NavRequestUtil;
/**
 * *********************************
 */
var NullNavRequest = (function () {
    function NullNavRequest() {
        this.fromDialogProperties = {};
    }
    return NullNavRequest;
}());
exports.NullNavRequest = NullNavRequest;
/**
 * *********************************
 */
var ObjectRef = (function () {
    function ObjectRef(_objectId, _description) {
        this._objectId = _objectId;
        this._description = _description;
    }
    ObjectRef.fromFormattedValue = function (value) {
        var pair = util_4.StringUtil.splitSimpleKeyValuePair(value);
        return new ObjectRef(pair[0], pair[1]);
    };
    Object.defineProperty(ObjectRef.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectRef.prototype, "objectId", {
        get: function () {
            return this._objectId;
        },
        enumerable: true,
        configurable: true
    });
    ObjectRef.prototype.toString = function () {
        return this.objectId + ":" + this.description;
    };
    return ObjectRef;
}());
exports.ObjectRef = ObjectRef;
/**
 * *********************************
 */
(function (PaneMode) {
    PaneMode[PaneMode["READ"] = 0] = "READ";
    PaneMode[PaneMode["WRITE"] = 1] = "WRITE";
})(exports.PaneMode || (exports.PaneMode = {}));
var PaneMode = exports.PaneMode;
/**
 * *********************************
 */
var PropDef = (function () {
    function PropDef(_name, _type, _elementType, _style, _propertyLength, _propertyScale, _presLength, _presScale, _dataDictionaryKey, _maintainable, _writeEnabled, _canCauseSideEffects) {
        this._name = _name;
        this._type = _type;
        this._elementType = _elementType;
        this._style = _style;
        this._propertyLength = _propertyLength;
        this._propertyScale = _propertyScale;
        this._presLength = _presLength;
        this._presScale = _presScale;
        this._dataDictionaryKey = _dataDictionaryKey;
        this._maintainable = _maintainable;
        this._writeEnabled = _writeEnabled;
        this._canCauseSideEffects = _canCauseSideEffects;
    }
    Object.defineProperty(PropDef.prototype, "canCauseSideEffects", {
        get: function () {
            return this._canCauseSideEffects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "dataDictionaryKey", {
        get: function () {
            return this._dataDictionaryKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "elementType", {
        get: function () {
            return this._elementType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isBarcodeType", {
        get: function () {
            return this.type &&
                this.type === 'STRING' &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_BARCODE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isBinaryType", {
        get: function () {
            return this.isLargeBinaryType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isBooleanType", {
        get: function () {
            return this.type && this.type === 'BOOLEAN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isCodeRefType", {
        get: function () {
            return this.type && this.type === 'CODE_REF';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isDateType", {
        get: function () {
            return this.type && this.type === 'DATE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isDateTimeType", {
        get: function () {
            return this.type && this.type === 'DATE_TIME';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isDecimalType", {
        get: function () {
            return this.type && this.type === 'DECIMAL';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isDoubleType", {
        get: function () {
            return this.type && this.type === 'DOUBLE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isEmailType", {
        get: function () {
            return this.type && this.type === 'DATA_EMAIL';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isGeoFixType", {
        get: function () {
            return this.type && this.type === 'GEO_FIX';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isGeoLocationType", {
        get: function () {
            return this.type && this.type === 'GEO_LOCATION';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isHTMLType", {
        get: function () {
            return this.type && this.type === 'DATA_HTML';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isListType", {
        get: function () {
            return this.type && this.type === 'LIST';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isInlineMediaStyle", {
        get: function () {
            return this.style &&
                (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isIntType", {
        get: function () {
            return this.type && this.type === 'INT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isLargeBinaryType", {
        get: function () {
            return this.type &&
                this.type === 'com.dgoi.core.domain.BinaryRef' &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_LARGEBINARY';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isLongType", {
        get: function () {
            return this.type && this.type === 'LONG';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isMoneyType", {
        get: function () {
            return this.isNumericType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_MONEY';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isNumericType", {
        get: function () {
            return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isObjRefType", {
        get: function () {
            return this.type && this.type === 'OBJ_REF';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isPasswordType", {
        get: function () {
            return this.isStringType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_PASSWORD';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isPercentType", {
        get: function () {
            return this.isNumericType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_PERCENT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isStringType", {
        get: function () {
            return this.type && this.type === 'STRING';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isTelephoneType", {
        get: function () {
            return this.isStringType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_TELEPHONE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isTextBlock", {
        get: function () {
            return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isTimeType", {
        get: function () {
            return this.type && this.type === 'TIME';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isUnformattedNumericType", {
        get: function () {
            return this.isNumericType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isURLType", {
        get: function () {
            return this.isStringType &&
                this.dataDictionaryKey &&
                this.dataDictionaryKey === 'DATA_URL';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "maintainable", {
        get: function () {
            return this._maintainable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "presLength", {
        get: function () {
            return this._presLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "presScale", {
        get: function () {
            return this._presScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "propertyLength", {
        get: function () {
            return this._propertyLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "propertyScale", {
        get: function () {
            return this._propertyScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "style", {
        get: function () {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "writeEnabled", {
        get: function () {
            return this._writeEnabled;
        },
        enumerable: true,
        configurable: true
    });
    PropDef.STYLE_INLINE_MEDIA = "inlineMedia";
    PropDef.STYLE_INLINE_MEDIA2 = "Image/Video";
    return PropDef;
}());
exports.PropDef = PropDef;
/**
 * *********************************
 */
var PropFormatter = (function () {
    function PropFormatter() {
    }
    PropFormatter.formatForRead = function (prop, propDef) {
        return (prop !== null && prop !== undefined) ? PropFormatter.toString(prop, propDef) : '';
    };
    PropFormatter.formatForWrite = function (prop, propDef) {
        return (prop !== null && prop !== undefined) ? PropFormatter.toString(prop, propDef) : '';
    };
    PropFormatter.parse = function (value, propDef) {
        var propValue = value;
        if (propDef.isDecimalType) {
            propValue = Number(value);
        }
        else if (propDef.isLongType) {
            propValue = Number(value);
        }
        else if (propDef.isBooleanType) {
            if (typeof value === 'string') {
                propValue = value !== 'false';
            }
            else {
                propValue = !!value;
            }
        }
        else if (propDef.isDateType) {
            //parse as UTC
            propValue = typeof value === 'object' ? value : new Date(value);
        }
        else if (propDef.isDateTimeType) {
            //parse as UTC
            propValue = typeof value === 'object' ? value : new Date(value);
        }
        else if (propDef.isTimeType) {
            propValue = value instanceof util_1.TimeValue ? value : util_1.TimeValue.fromString(value);
        }
        else if (propDef.isObjRefType) {
            propValue = value instanceof ObjectRef ? value : ObjectRef.fromFormattedValue(value);
        }
        else if (propDef.isCodeRefType) {
            propValue = value instanceof CodeRef ? value : CodeRef.fromFormattedValue(value);
        }
        else if (propDef.isGeoFixType) {
            propValue = value instanceof GeoFix ? value : GeoFix.fromFormattedValue(value);
        }
        else if (propDef.isGeoLocationType) {
            propValue = value instanceof GeoLocation ? value : GeoLocation.fromFormattedValue(value);
        }
        return propValue;
    };
    PropFormatter.toString = function (o, propDef) {
        if (typeof o === 'number') {
            if (propDef.isMoneyType) {
                return o.toFixed(2);
            }
            else if (propDef.isIntType || propDef.isLongType) {
                return o.toFixed(0);
            }
            else if (propDef.isDecimalType || propDef.isDoubleType) {
                return o.toFixed(Math.max(2, (o.toString().split('.')[1] || []).length));
            }
        }
        else if (typeof o === 'object') {
            if (o instanceof Date) {
                return o.toISOString();
            }
            else if (o instanceof util_1.TimeValue) {
                return o.toString();
            }
            else if (o instanceof CodeRef) {
                return o.toString();
            }
            else if (o instanceof ObjectRef) {
                return o.toString();
            }
            else if (o instanceof GeoFix) {
                return o.toString();
            }
            else if (o instanceof GeoLocation) {
                return o.toString();
            }
            else {
                return String(o);
            }
        }
        else {
            return String(o);
        }
    };
    return PropFormatter;
}());
exports.PropFormatter = PropFormatter;
var Prop = (function () {
    function Prop(_name, _value, _annos) {
        if (_annos === void 0) { _annos = []; }
        this._name = _name;
        this._value = _value;
        this._annos = _annos;
    }
    Prop.fromListOfWSValue = function (values) {
        var props = [];
        values.forEach(function (v) {
            var propTry = Prop.fromWSValue(v);
            if (propTry.isFailure)
                return new fp_5.Failure(propTry.failure);
            props.push(propTry.success);
        });
        return new fp_4.Success(props);
    };
    Prop.fromWSNameAndWSValue = function (name, value) {
        var propTry = Prop.fromWSValue(value);
        if (propTry.isFailure) {
            return new fp_5.Failure(propTry.failure);
        }
        return new fp_4.Success(new Prop(name, propTry.success));
    };
    Prop.fromWSNamesAndValues = function (names, values) {
        if (names.length != values.length) {
            return new fp_5.Failure("Prop::fromWSNamesAndValues: names and values must be of same length");
        }
        var list = [];
        for (var i = 0; i < names.length; i++) {
            var propTry = Prop.fromWSNameAndWSValue(names[i], values[i]);
            if (propTry.isFailure) {
                return new fp_5.Failure(propTry.failure);
            }
            list.push(propTry.success);
        }
        return new fp_4.Success(list);
    };
    Prop.fromWSValue = function (value) {
        var propValue = value;
        if (value && 'object' === typeof value) {
            var PType = value['WS_PTYPE'];
            var strVal = value['value'];
            if (PType) {
                if (PType === 'Decimal') {
                    propValue = Number(strVal);
                }
                else if (PType === 'Date') {
                    //parse as UTC
                    propValue = new Date(strVal);
                }
                else if (PType === 'DateTime') {
                    //parse as UTC
                    propValue = new Date(strVal);
                }
                else if (PType === 'Time') {
                    propValue = util_1.TimeValue.fromString(strVal);
                }
                else if (PType === 'BinaryRef') {
                    var binaryRefTry = BinaryRef.fromWSValue(strVal, value['properties']);
                    if (binaryRefTry.isFailure)
                        return new fp_5.Failure(binaryRefTry.failure);
                    propValue = binaryRefTry.success;
                }
                else if (PType === 'ObjectRef') {
                    propValue = ObjectRef.fromFormattedValue(strVal);
                }
                else if (PType === 'CodeRef') {
                    propValue = CodeRef.fromFormattedValue(strVal);
                }
                else if (PType === 'GeoFix') {
                    propValue = GeoFix.fromFormattedValue(strVal);
                }
                else if (PType === 'GeoLocation') {
                    propValue = GeoLocation.fromFormattedValue(strVal);
                }
                else {
                    return new fp_5.Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                }
            }
        }
        return new fp_4.Success(propValue);
    };
    Prop.fromWS = function (otype, jsonObj) {
        var name = jsonObj['name'];
        var valueTry = Prop.fromWSValue(jsonObj['value']);
        if (valueTry.isFailure)
            return new fp_5.Failure(valueTry.failure);
        var annos = null;
        if (jsonObj['annos']) {
            var annosListTry = DialogTriple.fromListOfWSDialogObject(jsonObj['annos'], 'WSDataAnno', OType.factoryFn);
            if (annosListTry.isFailure)
                return new fp_5.Failure(annosListTry.failure);
            annos = annosListTry.success;
        }
        return new fp_4.Success(new Prop(name, valueTry.success, annos));
    };
    Prop.toWSProperty = function (o) {
        if (typeof o === 'number') {
            return { 'WS_PTYPE': 'Decimal', 'value': String(o) };
        }
        else if (typeof o === 'object') {
            if (o instanceof Date) {
                //remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
                return { 'WS_PTYPE': 'DateTime', 'value': o.toISOString().slice(0, -1) };
            }
            else if (o instanceof util_1.TimeValue) {
                return { 'WS_PTYPE': 'Time', 'value': o.toString() };
            }
            else if (o instanceof CodeRef) {
                return { 'WS_PTYPE': 'CodeRef', 'value': o.toString() };
            }
            else if (o instanceof ObjectRef) {
                return { 'WS_PTYPE': 'ObjectRef', 'value': o.toString() };
            }
            else if (o instanceof GeoFix) {
                return { 'WS_PTYPE': 'GeoFix', 'value': o.toString() };
            }
            else if (o instanceof GeoLocation) {
                return { 'WS_PTYPE': 'GeoLocation', 'value': o.toString() };
            }
            else if (o instanceof InlineBinaryRef) {
                return { 'WS_PTYPE': 'BinaryRef', 'value': o.toString(), properties: o.settings };
            }
        }
        else {
            return o;
        }
    };
    Prop.toWSListOfProperties = function (list) {
        var result = { 'WS_LTYPE': 'Object' };
        var values = [];
        list.forEach(function (o) {
            values.push(Prop.toWSProperty(o));
        });
        result['values'] = values;
        return result;
    };
    Prop.toWSListOfString = function (list) {
        return { 'WS_LTYPE': 'String', 'values': list };
    };
    Prop.toListOfWSProp = function (props) {
        var result = { 'WS_LTYPE': 'WSProp' };
        var values = [];
        props.forEach(function (prop) {
            values.push(prop.toWS());
        });
        result['values'] = values;
        return result;
    };
    Object.defineProperty(Prop.prototype, "annos", {
        get: function () {
            return this._annos;
        },
        enumerable: true,
        configurable: true
    });
    Prop.prototype.equals = function (prop) {
        return this.name === prop.name && this.value === prop.value;
    };
    Object.defineProperty(Prop.prototype, "backgroundColor", {
        get: function () {
            return DataAnno.backgroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "foregroundColor", {
        get: function () {
            return DataAnno.foregroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "imageName", {
        get: function () {
            return DataAnno.imageName(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "imagePlacement", {
        get: function () {
            return DataAnno.imagePlacement(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isBoldText", {
        get: function () {
            return DataAnno.isBoldText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isItalicText", {
        get: function () {
            return DataAnno.isItalicText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementCenter", {
        get: function () {
            return DataAnno.isPlacementCenter(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementLeft", {
        get: function () {
            return DataAnno.isPlacementLeft(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementRight", {
        get: function () {
            return DataAnno.isPlacementRight(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementStretchUnder", {
        get: function () {
            return DataAnno.isPlacementStretchUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementUnder", {
        get: function () {
            return DataAnno.isPlacementUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isUnderline", {
        get: function () {
            return DataAnno.isUnderlineText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "overrideText", {
        get: function () {
            return DataAnno.overrideText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "tipText", {
        get: function () {
            return DataAnno.tipText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Prop.prototype.toWS = function () {
        var result = { 'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Prop.toWSProperty(this.value) };
        if (this.annos) {
            result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        }
        return result;
    };
    return Prop;
}());
exports.Prop = Prop;
/**
 * *********************************
 */
var QueryResult = (function () {
    function QueryResult(entityRecs, hasMore) {
        this.entityRecs = entityRecs;
        this.hasMore = hasMore;
    }
    return QueryResult;
}());
exports.QueryResult = QueryResult;
/**
 * *********************************
 */
var HasMoreQueryMarker = (function (_super) {
    __extends(HasMoreQueryMarker, _super);
    function HasMoreQueryMarker() {
        _super.apply(this, arguments);
    }
    HasMoreQueryMarker.singleton = new HasMoreQueryMarker();
    return HasMoreQueryMarker;
}(NullEntityRec));
exports.HasMoreQueryMarker = HasMoreQueryMarker;
var IsEmptyQueryMarker = (function (_super) {
    __extends(IsEmptyQueryMarker, _super);
    function IsEmptyQueryMarker() {
        _super.apply(this, arguments);
    }
    IsEmptyQueryMarker.singleton = new IsEmptyQueryMarker();
    return IsEmptyQueryMarker;
}(NullEntityRec));
exports.IsEmptyQueryMarker = IsEmptyQueryMarker;
(function (QueryMarkerOption) {
    QueryMarkerOption[QueryMarkerOption["None"] = 0] = "None";
    QueryMarkerOption[QueryMarkerOption["IsEmpty"] = 1] = "IsEmpty";
    QueryMarkerOption[QueryMarkerOption["HasMore"] = 2] = "HasMore";
})(exports.QueryMarkerOption || (exports.QueryMarkerOption = {}));
var QueryMarkerOption = exports.QueryMarkerOption;
var QueryScroller = (function () {
    function QueryScroller(_context, _pageSize, _firstObjectId, _markerOptions) {
        if (_markerOptions === void 0) { _markerOptions = []; }
        this._context = _context;
        this._pageSize = _pageSize;
        this._firstObjectId = _firstObjectId;
        this._markerOptions = _markerOptions;
        this.clear();
    }
    Object.defineProperty(QueryScroller.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "bufferWithMarkers", {
        get: function () {
            var result = util_5.ArrayUtil.copy(this._buffer);
            if (this.isComplete) {
                if (this._markerOptions.indexOf(QueryMarkerOption.IsEmpty) > -1) {
                    if (this.isEmpty) {
                        result.push(IsEmptyQueryMarker.singleton);
                    }
                }
            }
            else if (this._markerOptions.indexOf(QueryMarkerOption.HasMore) > -1) {
                if (result.length === 0) {
                    result.push(HasMoreQueryMarker.singleton);
                }
                else {
                    if (this._hasMoreBackward) {
                        result.unshift(HasMoreQueryMarker.singleton);
                    }
                    if (this._hasMoreForward) {
                        result.push(HasMoreQueryMarker.singleton);
                    }
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "firstObjectId", {
        get: function () {
            return this._firstObjectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "hasMoreBackward", {
        get: function () {
            return this._hasMoreBackward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "hasMoreForward", {
        get: function () {
            return this._hasMoreForward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isComplete", {
        get: function () {
            return !this._hasMoreBackward && !this._hasMoreForward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isCompleteAndEmpty", {
        get: function () {
            return this.isComplete && this._buffer.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isEmpty", {
        get: function () {
            return this._buffer.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    QueryScroller.prototype.pageBackward = function () {
        var _this = this;
        if (!this._hasMoreBackward) {
            return fp_3.Future.createSuccessfulFuture('QueryScroller::pageBackward', []);
        }
        if (!this._prevPageFr || this._prevPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
            this._prevPageFr = this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
        }
        else {
            this._prevPageFr = this._prevPageFr.bind(function (queryResult) {
                var fromObjectId = _this._buffer.length === 0 ? null : _this._buffer[0].objectId;
                return _this._context.query(_this._pageSize, QueryDirection.BACKWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._prevPageFr.map(function (queryResult) {
            var afterSize = beforeSize;
            _this._hasMoreBackward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                for (var i = queryResult.entityRecs.length - 1; i > -1; i--) {
                    newBuffer.push(queryResult.entityRecs[i]);
                }
                _this._buffer.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                _this._buffer = newBuffer;
                afterSize = _this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    };
    QueryScroller.prototype.pageForward = function () {
        var _this = this;
        if (!this._hasMoreForward) {
            return fp_3.Future.createSuccessfulFuture('QueryScroller::pageForward', []);
        }
        if (!this._nextPageFr || this._nextPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
            this._nextPageFr = this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
        }
        else {
            this._nextPageFr = this._nextPageFr.bind(function (queryResult) {
                var fromObjectId = _this._buffer.length === 0 ? null : _this._buffer[_this._buffer.length - 1].objectId;
                return _this._context.query(_this._pageSize, QueryDirection.FORWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._nextPageFr.map(function (queryResult) {
            var afterSize = beforeSize;
            _this._hasMoreForward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                _this._buffer.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                queryResult.entityRecs.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                _this._buffer = newBuffer;
                afterSize = _this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    };
    Object.defineProperty(QueryScroller.prototype, "pageSize", {
        get: function () {
            return this._pageSize;
        },
        enumerable: true,
        configurable: true
    });
    QueryScroller.prototype.refresh = function () {
        var _this = this;
        this.clear();
        return this.pageForward().map(function (entityRecList) {
            _this.context.lastRefreshTime = new Date();
            return entityRecList;
        });
    };
    QueryScroller.prototype.trimFirst = function (n) {
        var newBuffer = [];
        for (var i = n; i < this._buffer.length; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreBackward = true;
        if (this._buffer.length === 0)
            this._hasMoreForward = true;
    };
    QueryScroller.prototype.trimLast = function (n) {
        var newBuffer = [];
        for (var i = 0; i < this._buffer.length - n; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreForward = true;
        if (this._buffer.length === 0)
            this._hasMoreBackward = true;
    };
    QueryScroller.prototype.clear = function () {
        this._hasMoreBackward = !!this._firstObjectId;
        this._hasMoreForward = true;
        this._buffer = [];
    };
    return QueryScroller;
}());
exports.QueryScroller = QueryScroller;
/**
 * *********************************
 */
var SessionContextImpl = (function () {
    function SessionContextImpl(sessionHandle, userName, currentDivision, serverVersion, systemContext) {
        this.sessionHandle = sessionHandle;
        this.userName = userName;
        this.currentDivision = currentDivision;
        this.serverVersion = serverVersion;
        this.systemContext = systemContext;
        this._remoteSession = true;
    }
    SessionContextImpl.fromWSCreateSessionResult = function (jsonObject, systemContext) {
        var sessionContextTry = DialogTriple.fromWSDialogObject(jsonObject, 'WSCreateSessionResult', OType.factoryFn);
        return sessionContextTry.map(function (sessionContext) {
            sessionContext.systemContext = systemContext;
            return sessionContext;
        });
    };
    SessionContextImpl.createSessionContext = function (gatewayHost, tenantId, clientType, userId, password) {
        var sessionContext = new SessionContextImpl(null, userId, "", null, null);
        sessionContext._gatewayHost = gatewayHost;
        sessionContext._tenantId = tenantId;
        sessionContext._clientType = clientType;
        sessionContext._userId = userId;
        sessionContext._password = password;
        sessionContext._remoteSession = false;
        return sessionContext;
    };
    Object.defineProperty(SessionContextImpl.prototype, "clientType", {
        get: function () {
            return this._clientType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "gatewayHost", {
        get: function () {
            return this._gatewayHost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "isLocalSession", {
        get: function () {
            return !this._remoteSession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "isRemoteSession", {
        get: function () {
            return this._remoteSession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "tenantId", {
        get: function () {
            return this._tenantId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "online", {
        set: function (online) {
            this._remoteSession = online;
        },
        enumerable: true,
        configurable: true
    });
    return SessionContextImpl;
}());
exports.SessionContextImpl = SessionContextImpl;
/**
 * *********************************
 */
var SessionService = (function () {
    function SessionService() {
    }
    SessionService.createSession = function (tenantId, userId, password, clientType, systemContext) {
        var method = "createSessionDirectly";
        var params = {
            'tenantId': tenantId,
            'userId': userId,
            'password': password,
            'clientType': clientType
        };
        var call = ws_1.Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture("createSession/extractSessionContextFromResponse", SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
        });
    };
    SessionService.deleteSession = function (sessionContext) {
        var method = "deleteSession";
        var params = {
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = ws_1.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse", result);
        });
    };
    SessionService.getSessionListProperty = function (propertyName, sessionContext) {
        var method = "getSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = ws_1.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse", DialogTriple.fromWSDialogObject(result, 'WSGetSessionListPropertyResult', OType.factoryFn));
        });
    };
    SessionService.setSessionListProperty = function (propertyName, listProperty, sessionContext) {
        var method = "setSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'listProperty': listProperty,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = ws_1.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse", result);
        });
    };
    SessionService.SERVICE_NAME = "SessionService";
    SessionService.SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;
    return SessionService;
}());
exports.SessionService = SessionService;
/**
 * *********************************
 */
var SortPropDef = (function () {
    function SortPropDef(_name, _direction) {
        this._name = _name;
        this._direction = _direction;
    }
    Object.defineProperty(SortPropDef.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortPropDef.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return SortPropDef;
}());
exports.SortPropDef = SortPropDef;
/**
 * *********************************
 */
var SystemContextImpl = (function () {
    function SystemContextImpl(_urlString) {
        this._urlString = _urlString;
    }
    Object.defineProperty(SystemContextImpl.prototype, "urlString", {
        get: function () {
            return this._urlString;
        },
        enumerable: true,
        configurable: true
    });
    return SystemContextImpl;
}());
exports.SystemContextImpl = SystemContextImpl;
/**
 * *********************************
 */
var WorkbenchLaunchAction = (function () {
    function WorkbenchLaunchAction(id, workbenchId, name, alias, iconBase) {
        this.id = id;
        this.workbenchId = workbenchId;
        this.name = name;
        this.alias = alias;
        this.iconBase = iconBase;
    }
    Object.defineProperty(WorkbenchLaunchAction.prototype, "actionId", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchLaunchAction.prototype, "fromActionSource", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchLaunchAction.prototype, "virtualPathSuffix", {
        get: function () {
            return [this.workbenchId, this.id];
        },
        enumerable: true,
        configurable: true
    });
    return WorkbenchLaunchAction;
}());
exports.WorkbenchLaunchAction = WorkbenchLaunchAction;
/**
 * *********************************
 */
var WorkbenchService = (function () {
    function WorkbenchService() {
    }
    WorkbenchService.getAppWinDef = function (sessionContext) {
        var method = "getApplicationWindowDef";
        var params = { 'sessionHandle': sessionContext.sessionHandle };
        var call = ws_1.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture("createSession/extractAppWinDefFromResult", DialogTriple.fromWSDialogObjectResult(result, 'WSApplicationWindowDefResult', 'WSApplicationWindowDef', 'applicationWindowDef', OType.factoryFn));
        });
    };
    WorkbenchService.getWorkbench = function (sessionContext, workbenchId) {
        var method = "getWorkbench";
        var params = {
            'sessionHandle': sessionContext.sessionHandle,
            'workbenchId': workbenchId
        };
        var call = ws_1.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture("getWorkbench/extractObject", DialogTriple.fromWSDialogObjectResult(result, 'WSWorkbenchResult', 'WSWorkbench', 'workbench', OType.factoryFn));
        });
    };
    WorkbenchService.performLaunchAction = function (actionId, workbenchId, sessionContext) {
        var method = "performLaunchAction";
        var params = {
            'actionId': actionId,
            'workbenchId': workbenchId,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = ws_1.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return fp_3.Future.createCompletedFuture("performLaunchAction/extractRedirection", DialogTriple.fromWSDialogObject(result['redirection'], 'WSRedirection', OType.factoryFn));
        });
    };
    WorkbenchService.SERVICE_NAME = "WorkbenchService";
    WorkbenchService.SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;
    return WorkbenchService;
}());
exports.WorkbenchService = WorkbenchService;
/**
 * *********************************
 */
var Workbench = (function () {
    function Workbench(_id, _name, _alias, _actions) {
        this._id = _id;
        this._name = _name;
        this._alias = _alias;
        this._actions = _actions;
    }
    Object.defineProperty(Workbench.prototype, "alias", {
        get: function () {
            return this._alias;
        },
        enumerable: true,
        configurable: true
    });
    Workbench.prototype.getLaunchActionById = function (launchActionId) {
        var result = null;
        this.workbenchLaunchActions.some(function (launchAction) {
            if (launchAction.id = launchActionId) {
                result = launchAction;
                return true;
            }
        });
        return result;
    };
    Object.defineProperty(Workbench.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workbench.prototype, "workbenchId", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workbench.prototype, "workbenchLaunchActions", {
        get: function () {
            return util_5.ArrayUtil.copy(this._actions);
        },
        enumerable: true,
        configurable: true
    });
    return Workbench;
}());
exports.Workbench = Workbench;
/* XPane Classes */
/**
 * *********************************
 */
var XPaneDef = (function () {
    function XPaneDef() {
    }
    XPaneDef.fromWS = function (otype, jsonObj) {
        if (jsonObj['listDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['listDef'], 'WSListDef', OType.factoryFn);
        }
        else if (jsonObj['detailsDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['detailsDef'], 'WSDetailsDef', OType.factoryFn);
        }
        else if (jsonObj['formDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['formDef'], 'WSFormDef', OType.factoryFn);
        }
        else if (jsonObj['mapDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['mapDef'], 'WSMapDef', OType.factoryFn);
        }
        else if (jsonObj['graphDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['graphDef'], 'WSGraphDef', OType.factoryFn);
        }
        else if (jsonObj['barcodeScanDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'], 'WSBarcodeScanDef', OType.factoryFn);
        }
        else if (jsonObj['imagePickerDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'], 'WSImagePickerDef', OType.factoryFn);
        }
        else if (jsonObj['geoFixDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'], 'WSGeoFixDef', OType.factoryFn);
        }
        else if (jsonObj['geoLocationDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'], 'WSGeoLocationDef', OType.factoryFn);
        }
        else if (jsonObj['calendarDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['calendarDef'], 'WSCalendarDef', OType.factoryFn);
        }
        else {
            return new fp_5.Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef ' + util_3.ObjUtil.formatRecAttr(jsonObj));
        }
    };
    return XPaneDef;
}());
exports.XPaneDef = XPaneDef;
/**
 * *********************************
 */
var XBarcodeScanDef = (function (_super) {
    __extends(XBarcodeScanDef, _super);
    function XBarcodeScanDef(paneId, name, title) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
    return XBarcodeScanDef;
}(XPaneDef));
exports.XBarcodeScanDef = XBarcodeScanDef;
/**
 * *********************************
 */
var XCalendarDef = (function (_super) {
    __extends(XCalendarDef, _super);
    function XCalendarDef(paneId, name, title, descriptionProperty, initialStyle, startDateProperty, startTimeProperty, endDateProperty, endTimeProperty, occurDateProperty, occurTimeProperty) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.descriptionProperty = descriptionProperty;
        this.initialStyle = initialStyle;
        this.startDateProperty = startDateProperty;
        this.startTimeProperty = startTimeProperty;
        this.endDateProperty = endDateProperty;
        this.endTimeProperty = endTimeProperty;
        this.occurDateProperty = occurDateProperty;
        this.occurTimeProperty = occurTimeProperty;
    }
    return XCalendarDef;
}(XPaneDef));
exports.XCalendarDef = XCalendarDef;
/**
 * *********************************
 */
var XChangePaneModeResult = (function () {
    function XChangePaneModeResult(editorRecordDef, dialogProperties) {
        this.editorRecordDef = editorRecordDef;
        this.dialogProperties = dialogProperties;
    }
    Object.defineProperty(XChangePaneModeResult.prototype, "entityRecDef", {
        get: function () {
            return this.editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XChangePaneModeResult.prototype, "dialogProps", {
        get: function () {
            return this.dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    return XChangePaneModeResult;
}());
exports.XChangePaneModeResult = XChangePaneModeResult;
/**
 * *********************************
 */
/*
 @TODO

 Note! Use this as a test example!
 It has an Array of Array with subitems that also have Array of Array!!
 */
var XDetailsDef = (function (_super) {
    __extends(XDetailsDef, _super);
    function XDetailsDef(paneId, name, title, cancelButtonText, commitButtonText, editable, focusPropertyName, overrideGML, rows) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.cancelButtonText = cancelButtonText;
        this.commitButtonText = commitButtonText;
        this.editable = editable;
        this.focusPropertyName = focusPropertyName;
        this.overrideGML = overrideGML;
        this.rows = rows;
    }
    Object.defineProperty(XDetailsDef.prototype, "graphicalMarkup", {
        get: function () {
            return this.overrideGML;
        },
        enumerable: true,
        configurable: true
    });
    return XDetailsDef;
}(XPaneDef));
exports.XDetailsDef = XDetailsDef;
/**
 * *********************************
 */
var XFormDef = (function (_super) {
    __extends(XFormDef, _super);
    function XFormDef(borderStyle, formLayout, formStyle, name, paneId, title, headerDefRef, paneDefRefs) {
        _super.call(this);
        this.borderStyle = borderStyle;
        this.formLayout = formLayout;
        this.formStyle = formStyle;
        this.name = name;
        this.paneId = paneId;
        this.title = title;
        this.headerDefRef = headerDefRef;
        this.paneDefRefs = paneDefRefs;
    }
    return XFormDef;
}(XPaneDef));
exports.XFormDef = XFormDef;
/**
 * *********************************
 */
var XFormModelComp = (function () {
    function XFormModelComp(paneId, redirection, label, title) {
        this.paneId = paneId;
        this.redirection = redirection;
        this.label = label;
        this.title = title;
    }
    return XFormModelComp;
}());
exports.XFormModelComp = XFormModelComp;
/**
 * *********************************
 */
var XFormModel = (function () {
    function XFormModel(form, header, children, placement, refreshTimer, sizeToWindow) {
        this.form = form;
        this.header = header;
        this.children = children;
        this.placement = placement;
        this.refreshTimer = refreshTimer;
        this.sizeToWindow = sizeToWindow;
    }
    /*
     This custom fromWS method is necessary because the XFormModelComps, must be
     built with the 'ignoreRedirection' flag set to true
     */
    XFormModel.fromWS = function (otype, jsonObj) {
        return DialogTriple.fromWSDialogObject(jsonObj['form'], 'WSFormModelComp', OType.factoryFn, true).bind(function (form) {
            var header = null;
            if (jsonObj['header']) {
                var headerTry = DialogTriple.fromWSDialogObject(jsonObj['header'], 'WSFormModelComp', OType.factoryFn, true);
                if (headerTry.isFailure)
                    return new fp_5.Failure(headerTry.isFailure);
                header = headerTry.success;
            }
            return DialogTriple.fromListOfWSDialogObject(jsonObj['children'], 'WSFormModelComp', OType.factoryFn, true).bind(function (children) {
                return new fp_4.Success(new XFormModel(form, header, children, jsonObj['placement'], jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
            });
        });
    };
    return XFormModel;
}());
exports.XFormModel = XFormModel;
/**
 * *********************************
 */
var XGeoFixDef = (function (_super) {
    __extends(XGeoFixDef, _super);
    function XGeoFixDef(paneId, name, title) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
    return XGeoFixDef;
}(XPaneDef));
exports.XGeoFixDef = XGeoFixDef;
/**
 * *********************************
 */
var XGeoLocationDef = (function (_super) {
    __extends(XGeoLocationDef, _super);
    function XGeoLocationDef(paneId, name, title) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
    return XGeoLocationDef;
}(XPaneDef));
exports.XGeoLocationDef = XGeoLocationDef;
/**
 * *********************************
 */
var XGetActiveColumnDefsResult = (function () {
    function XGetActiveColumnDefsResult(columnsStyle, columns) {
        this.columnsStyle = columnsStyle;
        this.columns = columns;
    }
    Object.defineProperty(XGetActiveColumnDefsResult.prototype, "columnDefs", {
        get: function () {
            return this.columns;
        },
        enumerable: true,
        configurable: true
    });
    return XGetActiveColumnDefsResult;
}());
exports.XGetActiveColumnDefsResult = XGetActiveColumnDefsResult;
/**
 * *********************************
 */
var XGetAvailableValuesResult = (function () {
    function XGetAvailableValuesResult(list) {
        this.list = list;
    }
    XGetAvailableValuesResult.fromWS = function (otype, jsonObj) {
        var listJson = jsonObj['list'];
        var valuesJson = listJson['values'];
        return Prop.fromListOfWSValue(valuesJson).bind(function (values) {
            return new fp_4.Success(new XGetAvailableValuesResult(values));
        });
    };
    return XGetAvailableValuesResult;
}());
exports.XGetAvailableValuesResult = XGetAvailableValuesResult;
/**
 * *********************************
 */
var XGetSessionListPropertyResult = (function () {
    function XGetSessionListPropertyResult(_list, _dialogProps) {
        this._list = _list;
        this._dialogProps = _dialogProps;
    }
    Object.defineProperty(XGetSessionListPropertyResult.prototype, "dialogProps", {
        get: function () {
            return this._dialogProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XGetSessionListPropertyResult.prototype, "values", {
        get: function () {
            return this._list;
        },
        enumerable: true,
        configurable: true
    });
    XGetSessionListPropertyResult.prototype.valuesAsDictionary = function () {
        var result = {};
        this.values.forEach(function (v) {
            var pair = util_4.StringUtil.splitSimpleKeyValuePair(v);
            result[pair[0]] = pair[1];
        });
        return result;
    };
    return XGetSessionListPropertyResult;
}());
exports.XGetSessionListPropertyResult = XGetSessionListPropertyResult;
/**
 * *********************************
 */
var XGraphDef = (function (_super) {
    __extends(XGraphDef, _super);
    function XGraphDef(paneId, name, title, graphType, identityDataPoint, groupingDataPoint, dataPoints, filterDataPoints, sampleModel) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.graphType = graphType;
        this.identityDataPoint = identityDataPoint;
        this.groupingDataPoint = groupingDataPoint;
        this.dataPoints = dataPoints;
        this.filterDataPoints = filterDataPoints;
        this.sampleModel = sampleModel;
    }
    return XGraphDef;
}(XPaneDef));
exports.XGraphDef = XGraphDef;
/**
 * *********************************
 */
var XImagePickerDef = (function (_super) {
    __extends(XImagePickerDef, _super);
    function XImagePickerDef(paneId, name, title, URLProperty, defaultActionId) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.URLProperty = URLProperty;
        this.defaultActionId = defaultActionId;
    }
    return XImagePickerDef;
}(XPaneDef));
exports.XImagePickerDef = XImagePickerDef;
/**
 * *********************************
 */
var XListDef = (function (_super) {
    __extends(XListDef, _super);
    function XListDef(paneId, name, title, style, initialColumns, columnsStyle, overrideGML) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.style = style;
        this.initialColumns = initialColumns;
        this.columnsStyle = columnsStyle;
        this.overrideGML = overrideGML;
    }
    Object.defineProperty(XListDef.prototype, "graphicalMarkup", {
        get: function () {
            return this.overrideGML;
        },
        set: function (graphicalMarkup) {
            this.overrideGML = graphicalMarkup;
        },
        enumerable: true,
        configurable: true
    });
    return XListDef;
}(XPaneDef));
exports.XListDef = XListDef;
/**
 * *********************************
 */
var XMapDef = (function (_super) {
    __extends(XMapDef, _super);
    function XMapDef(paneId, name, title, descriptionProperty, streetProperty, cityProperty, stateProperty, postalCodeProperty, latitudeProperty, longitudeProperty) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.descriptionProperty = descriptionProperty;
        this.streetProperty = streetProperty;
        this.cityProperty = cityProperty;
        this.stateProperty = stateProperty;
        this.postalCodeProperty = postalCodeProperty;
        this.latitudeProperty = latitudeProperty;
        this.longitudeProperty = longitudeProperty;
    }
    Object.defineProperty(XMapDef.prototype, "descrptionProperty", {
        //descriptionProperty is misspelled in json returned by server currently...
        set: function (prop) {
            this.descriptionProperty = prop;
        },
        enumerable: true,
        configurable: true
    });
    return XMapDef;
}(XPaneDef));
exports.XMapDef = XMapDef;
/**
 * *********************************
 */
var XOpenEditorModelResult = (function () {
    function XOpenEditorModelResult(editorRecordDef, formModel) {
        this.editorRecordDef = editorRecordDef;
        this.formModel = formModel;
    }
    Object.defineProperty(XOpenEditorModelResult.prototype, "entityRecDef", {
        get: function () {
            return this.editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XOpenEditorModelResult.prototype, "formPaneId", {
        get: function () {
            return this.formModel.form.paneId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XOpenEditorModelResult.prototype, "formRedirection", {
        get: function () {
            return this.formModel.form.redirection;
        },
        enumerable: true,
        configurable: true
    });
    return XOpenEditorModelResult;
}());
exports.XOpenEditorModelResult = XOpenEditorModelResult;
/**
 * *********************************
 */
var XOpenQueryModelResult = (function () {
    function XOpenQueryModelResult(entityRecDef, sortPropertyDef, defaultActionId) {
        this.entityRecDef = entityRecDef;
        this.sortPropertyDef = sortPropertyDef;
        this.defaultActionId = defaultActionId;
    }
    XOpenQueryModelResult.fromWS = function (otype, jsonObj) {
        var queryRecDefJson = jsonObj['queryRecordDef'];
        var defaultActionId = queryRecDefJson['defaultActionId'];
        return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'], 'WSPropertyDef', OType.factoryFn).bind(function (propDefs) {
            var entityRecDef = new EntityRecDef(propDefs);
            return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', OType.factoryFn).bind(function (sortPropDefs) {
                return new fp_4.Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
            });
        });
    };
    return XOpenQueryModelResult;
}());
exports.XOpenQueryModelResult = XOpenQueryModelResult;
/**
 * *********************************
 */
var XPaneDefRef = (function () {
    function XPaneDefRef(name, paneId, title, type) {
        this.name = name;
        this.paneId = paneId;
        this.title = title;
        this.type = type;
    }
    return XPaneDefRef;
}());
exports.XPaneDefRef = XPaneDefRef;
/**
 * *********************************
 */
var XPropertyChangeResult = (function () {
    function XPropertyChangeResult(availableValueChanges, propertyName, sideEffects, editorRecordDef) {
        this.availableValueChanges = availableValueChanges;
        this.propertyName = propertyName;
        this.sideEffects = sideEffects;
        this.editorRecordDef = editorRecordDef;
    }
    Object.defineProperty(XPropertyChangeResult.prototype, "sideEffectsDef", {
        get: function () {
            return this.editorRecordDef;
        },
        set: function (sideEffectsDef) {
            this.editorRecordDef = sideEffectsDef;
        },
        enumerable: true,
        configurable: true
    });
    return XPropertyChangeResult;
}());
exports.XPropertyChangeResult = XPropertyChangeResult;
/**
 * *********************************
 */
var XQueryResult = (function () {
    function XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, defaultActionId, dialogProps) {
        this.entityRecs = entityRecs;
        this.entityRecDef = entityRecDef;
        this.hasMore = hasMore;
        this.sortPropDefs = sortPropDefs;
        this.defaultActionId = defaultActionId;
        this.dialogProps = dialogProps;
    }
    XQueryResult.fromWS = function (otype, jsonObj) {
        return DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'], 'WSQueryRecordDef', OType.factoryFn).bind(function (entityRecDef) {
            var entityRecDefJson = jsonObj['queryRecordDef'];
            var actionId = jsonObj['defaultActionId'];
            return DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', OType.factoryFn).bind(function (sortPropDefs) {
                var queryRecsJson = jsonObj['queryRecords'];
                if (queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord') {
                    return new fp_5.Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                }
                var queryRecsValues = queryRecsJson['values'];
                var entityRecs = [];
                for (var i = 0; i < queryRecsValues.length; i++) {
                    var queryRecValue = queryRecsValues[i];
                    if (queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                        return new fp_5.Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                    }
                    var objectId = queryRecValue['objectId'];
                    var recPropsObj = queryRecValue['properties'];
                    if (recPropsObj['WS_LTYPE'] !== 'Object') {
                        return new fp_5.Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                    }
                    var recPropsObjValues = recPropsObj['values'];
                    var propsTry = Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                    if (propsTry.isFailure)
                        return new fp_5.Failure(propsTry.failure);
                    var props = propsTry.success;
                    if (queryRecValue['propertyAnnotations']) {
                        var propAnnosJson = queryRecValue['propertyAnnotations'];
                        var annotatedPropsTry = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                        if (annotatedPropsTry.isFailure)
                            return new fp_5.Failure(annotatedPropsTry.failure);
                        props = annotatedPropsTry.success;
                    }
                    var recAnnos = null;
                    if (queryRecValue['recordAnnotation']) {
                        var recAnnosTry = DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'], 'WSDataAnnotation', OType.factoryFn);
                        if (recAnnosTry.isFailure)
                            return new fp_5.Failure(recAnnosTry.failure);
                        recAnnos = recAnnosTry.success;
                    }
                    var entityRec = EntityRecUtil.newEntityRec(objectId, props, recAnnos);
                    entityRecs.push(entityRec);
                }
                var dialogProps = jsonObj['dialogProperties'];
                var hasMore = jsonObj['hasMore'];
                return new fp_4.Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, actionId, dialogProps));
            });
        });
    };
    return XQueryResult;
}());
exports.XQueryResult = XQueryResult;
/**
 * *********************************
 */
var XReadResult = (function () {
    function XReadResult(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    Object.defineProperty(XReadResult.prototype, "entityRec", {
        get: function () {
            return this._editorRecord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XReadResult.prototype, "entityRecDef", {
        get: function () {
            return this._editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XReadResult.prototype, "dialogProps", {
        get: function () {
            return this._dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    return XReadResult;
}());
exports.XReadResult = XReadResult;
/**
 * *********************************
 */
var XWriteResult = (function () {
    function XWriteResult(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    Object.defineProperty(XWriteResult.prototype, "dialogProps", {
        get: function () {
            return this._dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XWriteResult.prototype, "entityRec", {
        get: function () {
            return this._editorRecord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XWriteResult.prototype, "entityRecDef", {
        get: function () {
            return this._editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XWriteResult.prototype, "isDestroyed", {
        get: function () {
            var destoyedStr = this.dialogProps['destroyed'];
            return destoyedStr && destoyedStr.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    return XWriteResult;
}());
exports.XWriteResult = XWriteResult;
/**
 * *********************************
 */
var XWritePropertyResult = (function () {
    function XWritePropertyResult(dialogProperties) {
        this.dialogProperties = dialogProperties;
    }
    return XWritePropertyResult;
}());
exports.XWritePropertyResult = XWritePropertyResult;
var XReadPropertyResult = (function () {
    function XReadPropertyResult(dialogProperties, hasMore, data, dataLength) {
        this.dialogProperties = dialogProperties;
        this.hasMore = hasMore;
        this.data = data;
        this.dataLength = dataLength;
    }
    return XReadPropertyResult;
}());
exports.XReadPropertyResult = XReadPropertyResult;
/*
 OType must be last as it references almost all other classes in the module
 */
var OType = (function () {
    function OType() {
    }
    OType.typeInstance = function (name) {
        var type = OType.types[name];
        return type && new type;
    };
    OType.factoryFn = function (otype, jsonObj) {
        var typeFn = OType.typeFns[otype];
        if (typeFn) {
            return typeFn(otype, jsonObj);
        }
        return null;
    };
    OType.deserializeObject = function (obj, Otype, factoryFn) {
        util_2.Log.debug('Deserializing ' + Otype);
        if (Array.isArray(obj)) {
            //it's a nested array (no LTYPE!)
            return OType.handleNestedArray(Otype, obj);
        }
        else {
            var newObj = null;
            var objTry = factoryFn(Otype, obj); //this returns null if there is no custom function
            if (objTry) {
                if (objTry.isFailure) {
                    var error = 'OType::deserializeObject: factory failed to produce object for ' + Otype + " : "
                        + util_3.ObjUtil.formatRecAttr(objTry.failure);
                    util_2.Log.error(error);
                    return new fp_5.Failure(error);
                }
                newObj = objTry.success;
            }
            else {
                newObj = OType.typeInstance(Otype);
                if (!newObj) {
                    util_2.Log.error('OType::deserializeObject: no type constructor found for ' + Otype);
                    return new fp_5.Failure('OType::deserializeObject: no type constructor found for ' + Otype);
                }
                for (var prop in obj) {
                    var value = obj[prop];
                    util_2.Log.debug("prop: " + prop + " is type " + typeof value);
                    if (value && typeof value === 'object') {
                        if ('WS_OTYPE' in value) {
                            var otypeTry = DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                            if (otypeTry.isFailure)
                                return new fp_5.Failure(otypeTry.failure);
                            OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                        }
                        else if ('WS_LTYPE' in value) {
                            var ltypeTry = DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                            if (ltypeTry.isFailure)
                                return new fp_5.Failure(ltypeTry.failure);
                            OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                        }
                        else {
                            OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                        }
                    }
                    else {
                        OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                    }
                }
            }
            return new fp_4.Success(newObj);
        }
    };
    OType.serializeObject = function (obj, Otype, filterFn) {
        var newObj = { 'WS_OTYPE': Otype };
        return util_3.ObjUtil.copyNonNullFieldsOnly(obj, newObj, function (prop) {
            return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
        });
    };
    OType.handleNestedArray = function (Otype, obj) {
        return OType.extractLType(Otype).bind(function (ltype) {
            var newArrayTry = OType.deserializeNestedArray(obj, ltype);
            if (newArrayTry.isFailure)
                return new fp_5.Failure(newArrayTry.failure);
            return new fp_4.Success(newArrayTry.success);
        });
    };
    OType.deserializeNestedArray = function (array, ltype) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            if (value && typeof value === 'object') {
                var otypeTry = DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                if (otypeTry.isFailure) {
                    return new fp_5.Failure(otypeTry.failure);
                }
                newArray.push(otypeTry.success);
            }
            else {
                newArray.push(value);
            }
        }
        return new fp_4.Success(newArray);
    };
    OType.extractLType = function (Otype) {
        if (Otype.length > 5 && Otype.slice(0, 5) !== 'List<') {
            return new fp_5.Failure('Expected OType of List<some_type> but found ' + Otype);
        }
        var ltype = Otype.slice(5, -1);
        return new fp_4.Success(ltype);
    };
    OType.assignPropIfDefined = function (prop, value, target, otype) {
        if (otype === void 0) { otype = 'object'; }
        try {
            if ('_' + prop in target) {
                target['_' + prop] = value;
            }
            else {
                //it may be public
                if (prop in target) {
                    target[prop] = value;
                }
                else {
                    util_2.Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                }
            }
        }
        catch (error) {
            util_2.Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
        }
    };
    OType.types = {
        'WSApplicationWindowDef': AppWinDef,
        'WSAttributeCellValueDef': AttributeCellValueDef,
        'WSBarcodeScanDef': XBarcodeScanDef,
        'WSCalendarDef': XCalendarDef,
        'WSCellDef': CellDef,
        'WSChangePaneModeResult': XChangePaneModeResult,
        'WSColumnDef': ColumnDef,
        'WSContextAction': ContextAction,
        'WSCreateSessionResult': SessionContextImpl,
        'WSDialogHandle': DialogHandle,
        'WSDataAnno': DataAnno,
        'WSDetailsDef': XDetailsDef,
        'WSDialogRedirection': DialogRedirection,
        'WSEditorRecordDef': EntityRecDef,
        'WSEntityRecDef': EntityRecDef,
        'WSForcedLineCellValueDef': ForcedLineCellValueDef,
        'WSFormDef': XFormDef,
        'WSFormModelComp': XFormModelComp,
        'WSGeoFixDef': XGeoFixDef,
        'WSGeoLocationDef': XGeoLocationDef,
        'WSGetActiveColumnDefsResult': XGetActiveColumnDefsResult,
        'WSGetSessionListPropertyResult': XGetSessionListPropertyResult,
        'WSGraphDataPointDef': GraphDataPointDef,
        'WSGraphDef': XGraphDef,
        'WSHandlePropertyChangeResult': XPropertyChangeResult,
        'WSImagePickerDef': XImagePickerDef,
        'WSLabelCellValueDef': LabelCellValueDef,
        'WSListDef': XListDef,
        'WSMapDef': XMapDef,
        'WSMenuDef': MenuDef,
        'WSOpenEditorModelResult': XOpenEditorModelResult,
        'WSOpenQueryModelResult': XOpenQueryModelResult,
        'WSPaneDefRef': XPaneDefRef,
        'WSPropertyDef': PropDef,
        'WSQueryRecordDef': EntityRecDef,
        'WSReadResult': XReadResult,
        'WSSortPropertyDef': SortPropDef,
        'WSSubstitutionCellValueDef': SubstitutionCellValueDef,
        'WSTabCellValueDef': TabCellValueDef,
        'WSWebRedirection': WebRedirection,
        'WSWorkbench': Workbench,
        'WSWorkbenchRedirection': WorkbenchRedirection,
        'WSWorkbenchLaunchAction': WorkbenchLaunchAction,
        'XWriteResult': XWriteResult,
        'WSWritePropertyResult': XWritePropertyResult,
        'WSReadPropertyResult': XReadPropertyResult
    };
    OType.typeFns = {
        'WSCellValueDef': CellValueDef.fromWS,
        'WSDataAnnotation': DataAnno.fromWS,
        'WSEditorRecord': EntityRecUtil.fromWSEditorRecord,
        'WSFormModel': XFormModel.fromWS,
        'WSGetAvailableValuesResult': XGetAvailableValuesResult.fromWS,
        'WSPaneDef': XPaneDef.fromWS,
        'WSOpenQueryModelResult': XOpenQueryModelResult.fromWS,
        'WSProp': Prop.fromWS,
        'WSQueryResult': XQueryResult.fromWS,
        'WSRedirection': Redirection.fromWS,
    };
    return OType;
}());
exports.OType = OType;
/**
 * *********************************
 */
//# sourceMappingURL=dialog.js.map