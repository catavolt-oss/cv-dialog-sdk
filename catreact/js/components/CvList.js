/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a ListContext
 ***************************************************
 */
var QueryMarkerOption = catavolt.dialog.QueryMarkerOption;
var CvList = React.createClass({
    getInitialState: function () {
        return { entityRecs: [] };
    },
    componentWillMount: function () {
        var _this = this;
        var listContext = this.props.listContext;
        listContext.setScroller(50, null, [QueryMarkerOption.None]);
        listContext.scroller.refresh().onComplete(function (entityRecTry) {
            if (entityRecTry.isFailure) {
                Log.error("ListContext failed to render with " + ObjUtil.formatRecAttr(entityRecTry.failure));
            }
            else {
                Log.info(JSON.stringify(listContext.scroller.buffer));
                _this.setState({ entityRecs: ArrayUtil.copy(listContext.scroller.buffer) });
            }
        });
    },
    itemDoubleClicked: function (objectId) {
        var _this = this;
        var listContext = this.props.listContext;
        if (listContext.listDef.defaultActionId) {
            var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
            listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(function (navRequestTry) {
                _this.props.onNavRequest(navRequestTry);
            });
        }
    },
    render: function () {
        var _this = this;
        var listContext = this.props.listContext;
        return (React.createElement("div", {"className": "panel panel-primary"}, React.createElement("div", {"className": "panel-heading"}, React.createElement("span", null, listContext.paneTitle || '>'), React.createElement("div", {"className": "pull-right"}, listContext.menuDefs.map(function (menuDef, index) { return React.createElement(CvMenu, {"key": index, "menuDef": menuDef}); }))), React.createElement("div", {"style": { maxHeight: '400px', overflow: 'auto' }}, React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"key": "nbsp"}, " "), listContext.columnHeadings.map(function (heading, index) { return React.createElement("th", {"key": index}, heading); }))), React.createElement("tbody", null, this.state.entityRecs.map(function (entityRec, index) {
            return (React.createElement("tr", {"key": index, "onDoubleClick": _this.itemDoubleClicked.bind(_this, entityRec.objectId)}, React.createElement("td", {"className": "text-center", "key": "checkbox"}, React.createElement("input", {"type": "checkbox"}), " "), listContext.rowValues(entityRec).map(function (val, index) { return React.createElement("td", {"key": index}, val ? val.toString() : ' '); })));
        }))))));
    }
});
