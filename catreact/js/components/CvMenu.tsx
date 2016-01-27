/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin} from './catreat'
import {MenuDef, PaneContext} from './catavolt'

export interface CvMenuState extends CvState {
    menuDef:MenuDef;
}

export interface CvMenuProps extends CvProps {
    actionId:string;
}

/*
 ***************************************************
 * Render a 'context menu' for a MenuDef
 ***************************************************
 */

export var CvMenu = React.createClass<CvMenuProps, CvMenuState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {
        const paneContext:PaneContext = this.context.scopeObj;
        paneContext.menuDefs.some((menuDef)=>{
            if(menuDef.actionId == this.props.actionId) {
                this.setState({menuDef:menuDef});
                return true;
            } else {
                return false;
            }
        });
    },

    getChildContext: function () {
        return {scopeObj: this.state.menuDef}
    },

    getInitialState: function () {
        return {menuDef: null}
    },

    render: function() {

        const menuDef = this.props.menuDef;

        if(menuDef) {
            if(React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {
                var findContextMenuDef = md => {
                    if (md.name === 'CONTEXT_MENU') return md;
                    if (md.menuDefs) {
                        for (let i = 0; i < md.menuDefs.length; i++) {
                            let result = findContextMenuDef(md.menuDefs[i]);
                            if (result) return result;
                        }
                    }
                    return null;
                }

                const ctxMenuDef = findContextMenuDef(menuDef);

                return (
                    <div className="btn-group">
                        <button type="button" className="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            {ctxMenuDef.menuDefs.map((md, index)=>{
                                return <li key={index}>
                                    <a onClick={this.performMenuAction(md.actionId)}>{md.label}</a>
                                </li>
                                })}
                            <li className="divider" key="divider"></li>
                            <li key="select_all">
                                <a onClick={this.selectAll()}>Select All</a>
                            </li>
                            <li key="deselect_all">
                                <a onClick={this.deselectAll()}>Deselect All</a>
                            </li>
                        </ul>
                    </div>
                );
            }
        }else{
            return null;
        }
    },

    performMenuAction() {
    },

    selectAll: function() {
    },

    deselectAll: function() {
    },

});
