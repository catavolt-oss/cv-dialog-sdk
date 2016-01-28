/**
 * Created by rburson on 12/23/15.
 */
import * as React from 'react';
import { CvBaseMixin } from './catreact';
/*
 ***************************************************
 * Render a 'context menu' for a MenuDef
 ***************************************************
 */
export var CvMenu = React.createClass({
    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function () {
        const paneContext = this.context.scopeObj;
        paneContext.menuDefs.some((menuDef) => {
            if (menuDef.actionId == this.props.actionId) {
                this.setState({ menuDef: menuDef });
                return true;
            }
            else {
                return false;
            }
        });
    },
    getChildContext: function () {
        return { scopeObj: this.state.menuDef };
    },
    getInitialState: function () {
        return { menuDef: null };
    },
    render: function () {
        const menuDef = this.props.menuDef;
        if (menuDef) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            }
            else {
                var findContextMenuDef = md => {
                    if (md.name === 'CONTEXT_MENU')
                        return md;
                    if (md.menuDefs) {
                        for (let i = 0; i < md.menuDefs.length; i++) {
                            let result = findContextMenuDef(md.menuDefs[i]);
                            if (result)
                                return result;
                        }
                    }
                    return null;
                };
                const ctxMenuDef = findContextMenuDef(menuDef);
                return (React.createElement("div", {"className": "btn-group"}, React.createElement("button", {"type": "button", "className": "btn btn-xs btn-primary dropdown-toggle", "data-toggle": "dropdown"}, React.createElement("span", {"className": "caret"})), React.createElement("ul", {"className": "dropdown-menu", "role": "menu"}, ctxMenuDef.menuDefs.map((md, index) => {
                    return React.createElement("li", {"key": index}, React.createElement("a", {"onClick": this.performMenuAction(md.actionId)}, md.label));
                }), React.createElement("li", {"className": "divider", "key": "divider"}), React.createElement("li", {"key": "select_all"}, React.createElement("a", {"onClick": this.selectAll()}, "Select All")), React.createElement("li", {"key": "deselect_all"}, React.createElement("a", {"onClick": this.deselectAll()}, "Deselect All")))));
            }
        }
        else {
            return null;
        }
    },
    performMenuAction() {
    },
    selectAll: function () {
    },
    deselectAll: function () {
    },
});
