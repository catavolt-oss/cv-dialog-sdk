/**
 * Created by rburson on 3/13/15.
 */
export class AppWinDef {
    constructor(workbenches, appVendors, windowTitle, windowWidth, windowHeight) {
        this._workbenches = workbenches || [];
        this._applicationVendors = appVendors || [];
        this._windowTitle = windowTitle;
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;
    }
    get appVendors() {
        return this._applicationVendors;
    }
    get windowHeight() {
        return this._windowHeight;
    }
    get windowTitle() {
        return this._windowTitle;
    }
    get windowWidth() {
        return this._windowWidth;
    }
    get workbenches() {
        return this._workbenches;
    }
}
