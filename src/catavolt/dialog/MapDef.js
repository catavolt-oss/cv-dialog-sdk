/**
 * Created by rburson on 4/22/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PaneDef_1 = require("./PaneDef");
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
})(PaneDef_1.PaneDef);
exports.MapDef = MapDef;
