/**
 * Created by rburson on 12/23/15.
 */
import * as React from 'react';
import { CvBaseMixin, CvEventType } from './catreact';
export var CvLauncher = React.createClass({
    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function () {
        let workbench = this.context.scopeObj;
        workbench.workbenchLaunchActions.some((launchAction) => {
            if (launchAction.actionId == this.props.actionId) {
                this.setState({ launchAction: launchAction });
                return true;
            }
            else {
                return false;
            }
        });
    },
    getChildContext: function () {
        return {
            scopeObj: this.state.launchAction
        };
    },
    getDefaultProps: function () {
        return { launchListeners: [] };
    },
    getInitialState: function () {
        return { launchAction: null };
    },
    render: function () {
        if (this.state.launchAction) {
            if (React.Children.count(this.props.children) > 0) {
                return React.createElement("span", {"onClick": this.handleClick}, this.props.children);
            }
            else {
                return (React.createElement("div", {"className": "col-md-4 launch-div"}, React.createElement("img", {"className": "launch-icon img-responsive center-block", "src": this.state.launchAction.iconBase, "onClick": this.handleClick}), React.createElement("h5", {"className": "launch-text small text-center", "onClick": this.handleClick}, this.state.launchAction.name)));
            }
        }
        else {
            return null;
        }
    },
    handleClick: function () {
        this.context.catavolt.performLaunchAction(this.state.launchAction).onComplete((launchTry) => {
            this.props.launchListeners.forEach((listener) => { listener(launchTry); });
            this.context.eventRegistry
                .publish({ type: CvEventType.NAVIGATION, eventObj: { navRequestTry: launchTry,
                    workbenchId: this.state.launchAction.workbenchId, navTarget: this.props.navTarget } });
        });
    }
});
