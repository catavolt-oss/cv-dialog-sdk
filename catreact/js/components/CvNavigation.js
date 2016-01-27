/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react.d.ts"/>
import * as React from 'react';
import { CvBaseMixin, CvEventType, CvForm, CvMessage } from './catreat';
import { FormContext } from './catavolt';
/*
 ***************************************************
 * Render a NavRequest
 ***************************************************
 */
export var CvNavigation = React.createClass({
    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function () {
        this.context.eventRegistry.subscribe((navEvent) => {
            if (navEvent.eventObj.navTarget) {
                if (this.props.targetId === navEvent.eventObj.navTarget) {
                    this.setState({ navRequestTry: navEvent.eventObj.navRequestTry, visible: true });
                }
                else {
                    if (!this.props.persistent)
                        this.setState({ visible: false });
                }
            }
            else {
                if (!this.props.targetId) {
                    this.setState({ navRequestTry: navEvent.eventObj.navRequestTry, visible: true });
                }
                else {
                    if (!this.props.persistent)
                        this.setState({ visible: false });
                }
            }
        }, CvEventType.NAVIGATION);
    },
    getChildContext: function () {
        let navRequest = null;
        if (this.state.navRequestTry && !this.state.navRequestTry.isFailure) {
            navRequest = this.state.navRequestTry.success;
        }
        return {
            scopeObj: navRequest
        };
    },
    getInitialState: function () {
        return { visible: false, navRequestTry: null };
    },
    render: function () {
        if (this.state.visible && this.state.navRequestTry && this.state.navRequestTry.isSuccess) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            }
            else {
                if (this.state.navRequestTry.success instanceof FormContext) {
                    return React.createElement(CvForm, null);
                }
                else {
                    return React.createElement(CvMessage, {"message": "Unsupported type of NavRequest " + this.state.navRequestTry});
                }
            }
        }
        else {
            return null;
        }
    }
});
