/**
 * Created by rburson on 1/14/16.
 */
///<reference path="../../typings/react/react.d.ts"/>
import * as React from 'react';
import { CvBaseMixin, CvEventType } from './catreat';
import { ListContext, MenuDef } from './catavolt';
/*
 ***************************************************
 * Render an EntityRec
 ***************************************************
 */
export var CvRecord = React.createClass({
    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function () {
    },
    getChildContext: function () {
        return { scopeObj: this.props.entityRec };
    },
    getInitialState: function () {
        return {};
    },
    render: function () {
        const entityRec = this.props.entityRec;
        if (entityRec) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.clickAction ? React.createElement("span", {"onClick": this.itemClicked.bind(this, entityRec.objectId)}, this.props.children) : this.props.children;
            }
            else {
                return React.createElement("span", null, 'Default row goes here');
            }
        }
        else {
            return null;
        }
    },
    itemClicked: function (objectId, actionId) {
        //@TODO - currently this is only the default action
        const paneContext = this.context.scopeObj;
        if (paneContext instanceof ListContext) {
            const listContext = paneContext;
            if (listContext.listDef.defaultActionId) {
                var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
                listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(navRequestTry => {
                    this.context.eventRegistry
                        .publish({
                        type: CvEventType.NAVIGATION, eventObj: {
                            navRequestTry: navRequestTry,
                            actionId: listContext.listDef.defaultActionId,
                            navTarget: this.props.navTarget
                        }
                    });
                });
            }
        }
    }
});
