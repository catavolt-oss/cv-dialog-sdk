/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react.d.ts"/>
import * as React from 'react';
import { CvBaseMixin, CvEventType, CvRecord, CvMenu } from './catreact';
import { ListContext, QueryMarkerOption, ObjUtil, Log, ArrayUtil, MenuDef } from './catavolt';
/**
   @TODO This class needs to allow for CvRecord at any depth with children.  Also better handling of 'wrapper' requirement

 */
/*
 ***************************************************
 * Render a ListContext
 ***************************************************
 */
export var CvList = React.createClass({
    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function () {
        const formContext = this.context.scopeObj;
        let listContext = null;
        formContext.childrenContexts.some((childContext) => {
            if (childContext instanceof ListContext &&
                childContext.paneRef == this.props.paneRef) {
                listContext = childContext;
                return true;
            }
            else {
                return false;
            }
        });
        this.setState({ listContext: listContext });
        listContext.setScroller(50, null, [QueryMarkerOption.None]);
        listContext.scroller.refresh().onComplete(entityRecTry => {
            if (entityRecTry.isFailure) {
                Log.error("ListContext failed to render with " + ObjUtil.formatRecAttr(entityRecTry.failure));
            }
            else {
                Log.info(JSON.stringify(listContext.scroller.buffer));
                this.setState({ listContext: listContext });
            }
        });
    },
    getChildContext: function () {
        return { scopeObj: this.state.listContext };
    },
    getInitialState() {
        return { listContext: null };
    },
    itemClicked: function (objectId) {
        const listContext = this.state.listContext;
        if (listContext.listDef.defaultActionId) {
            var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
            listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(navRequestTry => {
                this.context.eventRegistry
                    .publish({ type: CvEventType.NAVIGATION, eventObj: { navRequestTry: navRequestTry,
                        actionId: listContext.listDef.defaultActionId } });
            });
        }
    },
    render: function () {
        const listContext = this.state.listContext;
        if (listContext) {
            const entityRecs = ArrayUtil.copy(listContext.scroller.buffer);
            if (React.Children.count(this.props.children) > 0) {
                let newChildren = [];
                React.Children.toArray(this.props.children).forEach((childElem) => {
                    if (childElem.type == CvRecord) {
                        entityRecs.map((entityRec, index) => {
                            newChildren.push(React.cloneElement(childElem, { entityRec: entityRec, key: index }));
                        });
                    }
                    else {
                        newChildren.push(childElem);
                    }
                });
                if (this.props.wrapperElem) {
                    return React.createElement(this.props.wrapperElem, {}, newChildren);
                }
                else {
                    return React.createElement("span", null, newChildren);
                }
            }
            else {
                return (React.createElement("div", {"className": "panel panel-primary"}, React.createElement("div", {"className": "panel-heading"}, React.createElement("span", null, listContext.paneTitle || '>'), React.createElement("div", {"className": "pull-right"}, listContext.menuDefs.map((menuDef, index) => {
                    return React.createElement(CvMenu, {"key": index, "actionId": menuDef.actionId});
                }))), React.createElement("div", {"style": { maxHeight: '400px', overflow: 'auto' }}, React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"key": "nbsp"}, " "), listContext.columnHeadings.map((heading, index) => {
                    return React.createElement("th", {"key": index}, heading);
                }))), React.createElement("tbody", null, entityRecs.map((entityRec, index) => {
                    return (React.createElement("tr", {"key": index, "onClick": this.itemClicked.bind(this, entityRec.objectId)}, React.createElement("td", {"className": "text-center", "key": "checkbox"}, React.createElement("input", {"type": "checkbox"})), listContext.rowValues(entityRec).map((val, index) => {
                        return React.createElement("td", {"key": index}, val ? val.toString() : ' ');
                    })));
                }))))));
            }
        }
        else {
            return null;
        }
    }
});
