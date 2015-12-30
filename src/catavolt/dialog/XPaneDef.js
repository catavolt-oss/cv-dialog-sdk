/**
 * Created by rburson on 3/30/15.
 */
var ObjUtil_1 = require("../util/ObjUtil");
var Failure_1 = require("../fp/Failure");
var OType_1 = require("./OType");
var DialogTriple_1 = require("./DialogTriple");
var XPaneDef = (function () {
    function XPaneDef() {
    }
    XPaneDef.fromWS = function (otype, jsonObj) {
        if (jsonObj['listDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['listDef'], 'WSListDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['detailsDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['detailsDef'], 'WSDetailsDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['formDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['formDef'], 'WSFormDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['mapDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['mapDef'], 'WSMapDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['graphDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['graphDef'], 'WSGraphDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['barcodeScanDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'], 'WSBarcodeScanDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['imagePickerDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'], 'WSImagePickerDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['geoFixDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'], 'WSGeoFixDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['geoLocationDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'], 'WSGeoLocationDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['calendarDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['calendarDef'], 'WSCalendarDef', OType_1.OType.factoryFn);
        }
        else {
            return new Failure_1.Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef ' + ObjUtil_1.ObjUtil.formatRecAttr(jsonObj));
        }
    };
    return XPaneDef;
})();
exports.XPaneDef = XPaneDef;
