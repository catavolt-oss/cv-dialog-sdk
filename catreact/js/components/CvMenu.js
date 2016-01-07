/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a 'context menu' for a MenuDef
 ***************************************************
 */
var CvMenu = React.createClass({
    render: function () {
        var _this = this;
        var menuDef = this.props.menuDef;
        var findContextMenuDef = function (md) {
            if (md.name === 'CONTEXT_MENU')
                return md;
            if (md.menuDefs) {
                for (var i = 0; i < md.menuDefs.length; i++) {
                    var result = findContextMenuDef(md.menuDefs[i]);
                    if (result)
                        return result;
                }
            }
            return null;
        };
        var ctxMenuDef = findContextMenuDef(menuDef);
        return (React.createElement("div", {"className": "btn-group"}, React.createElement("button", {"type": "button", "className": "btn btn-xs btn-primary dropdown-toggle", "data-toggle": "dropdown"}, React.createElement("span", {"className": "caret"}, " ")), React.createElement("ul", {"className": "dropdown-menu", "role": "menu"}, ctxMenuDef.menuDefs.map(function (md, index) {
            return React.createElement("li", {"key": index}, React.createElement("a", {"onClick": _this.performMenuAction(md.actionId)}, md.label));
        }), React.createElement("li", {"className": "divider", "key": "divider"}, " "), React.createElement("li", {"key": "select_all"}, React.createElement("a", {"onClick": this.selectAll()}, "Select All")), React.createElement("li", {"key": "deselect_all"}, React.createElement("a", {"onClick": this.deselectAll()}, "Deselect All")))));
    },
    performMenuAction: function () {
    },
    selectAll: function () {
    },
    deselectAll: function () {
    },
});
