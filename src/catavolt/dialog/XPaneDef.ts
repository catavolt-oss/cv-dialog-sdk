/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    /*
        @TODO
    */
    export class XPaneDef {

        static fromWS(otype:string, jsonObj):Try<XPaneDef> {
            if (jsonObj['listDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['listDef'], 'WSListDef', OType.factoryFn);
            } else if (jsonObj['detailsDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['detailsDef'], 'WSDetailsDef', OType.factoryFn);
            } else if (jsonObj['formDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['formDef'], 'WSFormDef', OType.factoryFn);
            } else if (jsonObj['mapDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['mapDef'], 'WSMapDef', OType.factoryFn);
            } else if (jsonObj['graphDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['graphDef'], 'WSGraphDef', OType.factoryFn);
            } else if (jsonObj['barcodeScanDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'], 'WSBarcodeScanDef', OType.factoryFn);
            } else if (jsonObj['imagePickerDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'], 'WSImagePickerDef', OType.factoryFn);
            } else if (jsonObj['geoFixDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'], 'WSGeoFixDef', OType.factoryFn);
            } else if (jsonObj['geoLocationDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'], 'WSGeoLocationDef', OType.factoryFn);
            } else if (jsonObj['calendarDef']){
                return DialogTriple.fromWSDialogObject(jsonObj['calendarDef'], 'WSCalendarDef', OType.factoryFn);
            } else {
                return new Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef ' + ObjUtil.formatRecAttr(jsonObj));
            }
        }

        constructor(){}

    }
}