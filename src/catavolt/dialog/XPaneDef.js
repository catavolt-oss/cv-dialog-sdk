/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        /*
            @TODO
        */
        var XPaneDef = (function () {
            function XPaneDef() {
            }
            XPaneDef.fromWS = function (otype, jsonObj) {
                if (jsonObj['listDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['listDef'], 'WSListDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['detailsDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['detailsDef'], 'WSDetailsDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['formDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['formDef'], 'WSFormDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['mapDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['mapDef'], 'WSMapDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['graphDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['graphDef'], 'WSGraphDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['barcodeScanDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'], 'WSBarcodeScanDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['imagePickerDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'], 'WSImagePickerDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['geoFixDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'], 'WSGeoFixDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['geoLocationDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'], 'WSGeoLocationDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['calendarDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['calendarDef'], 'WSCalendarDef', dialog.OType.factoryFn);
                }
                else {
                    return new Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef ' + ObjUtil.formatRecAttr(jsonObj));
                }
            };
            return XPaneDef;
        })();
        dialog.XPaneDef = XPaneDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
