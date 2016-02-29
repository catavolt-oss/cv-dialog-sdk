/**
 * Created by rburson on 3/17/15.
 */
export class WorkbenchLaunchAction {
    constructor(id, workbenchId, name, alias, iconBase) {
        this.id = id;
        this.workbenchId = workbenchId;
        this.name = name;
        this.alias = alias;
        this.iconBase = iconBase;
    }
    get actionId() {
        return this.id;
    }
    get fromActionSource() {
        return null;
    }
    get virtualPathSuffix() {
        return [this.workbenchId, this.id];
    }
}
