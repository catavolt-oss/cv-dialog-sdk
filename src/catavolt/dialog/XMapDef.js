/**
 * Created by rburson on 4/1/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XPaneDef_1 = require("./XPaneDef");
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
})(XPaneDef_1.XPaneDef);
exports.XMapDef = XMapDef;
