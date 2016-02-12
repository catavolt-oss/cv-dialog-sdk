/**
 * Created by rburson on 4/22/15.
 */
import { PaneDef } from "./PaneDef";
export class ListDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _style, _initialColumns, _activeColumnDefs, _columnsStyle, _defaultActionId, _graphicalMarkup) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._style = _style;
        this._initialColumns = _initialColumns;
        this._activeColumnDefs = _activeColumnDefs;
        this._columnsStyle = _columnsStyle;
        this._defaultActionId = _defaultActionId;
        this._graphicalMarkup = _graphicalMarkup;
    }
    get activeColumnDefs() {
        return this._activeColumnDefs;
    }
    get columnsStyle() {
        return this._columnsStyle;
    }
    get defaultActionId() {
        return this._defaultActionId;
    }
    get graphicalMarkup() {
        return this._graphicalMarkup;
    }
    get initialColumns() {
        return this._initialColumns;
    }
    get isDefaultStyle() {
        return this.style && this.style === 'DEFAULT';
    }
    get isDetailsFormStyle() {
        return this.style && this.style === 'DETAILS_FORM';
    }
    get isFormStyle() {
        return this.style && this.style === 'FORM';
    }
    get isTabularStyle() {
        return this.style && this.style === 'TABULAR';
    }
    get style() {
        return this._style;
    }
}
//# sourceMappingURL=ListDef.js.map