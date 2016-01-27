/**
 * Created by rburson on 12/23/15.
 */
import * as React from 'react';
import { CvBaseMixin, CvEventType, CvToolbar, CvWorkbench, CvNavigation } from './catreat';
/*
 ***************************************************
 * A component analogous to Catavolt AppWinDef
 ***************************************************
 */
export var CvAppWindow = React.createClass({
    mixins: [CvBaseMixin],
    componentDidMount: function () {
        this.context.eventRegistry.subscribe((loginEvent) => {
            this.setState({ loggedIn: true });
        }, CvEventType.LOGIN);
    },
    getInitialState: function () {
        return {
            loggedIn: false
        };
    },
    render: function () {
        if (this.state.loggedIn) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            }
            else {
                var workbenches = this.context.catavolt.appWinDefTry.success.workbenches;
                return (React.createElement("span", null, React.createElement(CvToolbar, null), React.createElement("div", {"className": "container"}, (() => {
                    if (this.showWorkbench()) {
                        return workbenches.map((workbench, index) => {
                            return React.createElement(CvWorkbench, {"workbenchId": workbench.workbenchId, "key": index});
                        });
                    }
                })(), React.createElement(CvNavigation, null))));
            }
        }
        else {
            return null;
        }
    },
    showWorkbench: function () {
        return this.props.persistentWorkbench || !this.state.navRequestTry;
    },
});
