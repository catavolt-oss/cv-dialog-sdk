/**
 * Created by rburson on 3/26/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Redirection_1 = require("./Redirection");
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
})(Redirection_1.Redirection);
exports.DialogRedirection = DialogRedirection;
