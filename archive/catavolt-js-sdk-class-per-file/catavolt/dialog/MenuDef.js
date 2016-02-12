/**
 * Created by rburson on 3/30/15.
 */
export class MenuDef {
    constructor(_name, _type, _actionId, _mode, _label, _iconName, _directive, _menuDefs) {
        this._name = _name;
        this._type = _type;
        this._actionId = _actionId;
        this._mode = _mode;
        this._label = _label;
        this._iconName = _iconName;
        this._directive = _directive;
        this._menuDefs = _menuDefs;
    }
    get actionId() {
        return this._actionId;
    }
    get directive() {
        return this._directive;
    }
    findAtId(actionId) {
        if (this.actionId === actionId)
            return this;
        var result = null;
        this.menuDefs.some((md) => {
            result = md.findAtId(actionId);
            return result != null;
        });
        return result;
    }
    get iconName() {
        return this._iconName;
    }
    get isPresaveDirective() {
        return this._directive && this._directive === 'PRESAVE';
    }
    get isRead() {
        return this._mode && this._mode.indexOf('R') > -1;
    }
    get isSeparator() {
        return this._type && this._type === 'separator';
    }
    get isWrite() {
        return this._mode && this._mode.indexOf('W') > -1;
    }
    get label() {
        return this._label;
    }
    get menuDefs() {
        return this._menuDefs;
    }
    get mode() {
        return this._mode;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
}
//# sourceMappingURL=MenuDef.js.map