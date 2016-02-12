/**
 * Created by rburson on 4/22/15.
 */
import { PaneDef } from "./PaneDef";
export class ImagePickerDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _URLPropName, _defaultActionId) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._URLPropName = _URLPropName;
        this._defaultActionId = _defaultActionId;
    }
    get defaultActionId() {
        return this._defaultActionId;
    }
    get URLPropName() {
        return this._URLPropName;
    }
}
//# sourceMappingURL=ImagePickerDef.js.map