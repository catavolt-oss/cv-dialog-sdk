/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react.d.ts"/>
import * as React from 'react';
import { CvBaseMixin, CvEventType, CvLauncher } from './catreat';
/*
 ***************************************************
 * Render a Workbench
 ***************************************************
 */
export var CvWorkbench = React.createClass({
    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function () {
        this.context.catavolt.appWinDefTry.success.workbenches.some((workbench) => {
            if (workbench.workbenchId == this.props.workbenchId) {
                this.setState({ workbench: workbench });
                return true;
            }
            else {
                return false;
            }
        });
        this.context.eventRegistry.subscribe((navEvent) => {
            if (!this.props.persistent) {
                if (navEvent.eventObj.workbenchId == this.props.workbenchId) {
                    this.setState({ visible: false });
                }
            }
        }, CvEventType.NAVIGATION);
    },
    getDefaultProps: function () {
        return { persistent: true, workbenchId: null };
    },
    getChildContext: function () {
        return {
            scopeObj: this.state.workbench
        };
    },
    getInitialState: function () {
        return { workbench: null, visible: true };
    },
    render: function () {
        if (this.state.workbench && this.state.visible) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            }
            else {
                var launchActions = this.state.workbench.workbenchLaunchActions;
                var launchComps = [];
                for (let i = 0; i < launchActions.length; i++) {
                    launchComps.push(React.createElement(CvLauncher, {"actionId": launchActions[i].actionId, "key": launchActions[i].actionId}));
                }
                return (React.createElement("div", {"className": "panel panel-primary"}, React.createElement("div", {"className": "panel-heading"}, React.createElement("h3", {"className": "panel-title"}, this.state.workbench.name)), React.createElement("div", {"className": "panel-body"}, launchComps)));
            }
        }
        else {
            return null;
        }
    },
});
