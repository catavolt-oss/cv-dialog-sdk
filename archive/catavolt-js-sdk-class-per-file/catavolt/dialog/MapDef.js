/**
 * Created by rburson on 4/22/15.
 */
import { PaneDef } from "./PaneDef";
export class MapDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _streetPropName, _cityPropName, _statePropName, _postalCodePropName, _latitudePropName, _longitudePropName) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._descriptionPropName = _descriptionPropName;
        this._streetPropName = _streetPropName;
        this._cityPropName = _cityPropName;
        this._statePropName = _statePropName;
        this._postalCodePropName = _postalCodePropName;
        this._latitudePropName = _latitudePropName;
        this._longitudePropName = _longitudePropName;
    }
    get cityPropName() {
        return this._cityPropName;
    }
    get descriptionPropName() {
        return this._descriptionPropName;
    }
    get latitudePropName() {
        return this._latitudePropName;
    }
    get longitudePropName() {
        return this._longitudePropName;
    }
    get postalCodePropName() {
        return this._postalCodePropName;
    }
    get statePropName() {
        return this._statePropName;
    }
    get streetPropName() {
        return this._streetPropName;
    }
}
