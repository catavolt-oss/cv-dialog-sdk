/**
 * Created by rburson on 4/1/15.
 */
import { XPaneDef } from "./XPaneDef";
export class XMapDef extends XPaneDef {
    constructor(paneId, name, title, descriptionProperty, streetProperty, cityProperty, stateProperty, postalCodeProperty, latitudeProperty, longitudeProperty) {
        super();
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
    //descriptionProperty is misspelled in json returned by server currently...
    set descrptionProperty(prop) {
        this.descriptionProperty = prop;
    }
}
