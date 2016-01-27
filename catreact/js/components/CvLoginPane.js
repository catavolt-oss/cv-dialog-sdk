/**
 * Created by rburson on 12/23/15.
 */
import * as React from 'react';
import { CvBaseMixin, CvEventType } from './catreat';
/*
 ***************************************************
 * Render a LoginPane
 ***************************************************
 */
export var CvLoginPane = React.createClass({
    mixins: [CvBaseMixin],
    componentDidMount: function () {
        this.context.eventRegistry.subscribe((logoutEvent) => {
            this.setState({ loggedIn: false });
        }, CvEventType.LOGOUT);
    },
    getDefaultProps: function () {
        return {
            loginListeners: []
        };
    },
    getInitialState: function () {
        return {
            tenantId: 'catavolt-dev',
            gatewayUrl: 'www.catavolt.net',
            userId: 'rob',
            password: 'rob123',
            clientType: 'RICH_CLIENT',
            loggedIn: false
        };
    },
    render: function () {
        if (!this.state.loggedIn) {
            return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "well"}, React.createElement("form", {"className": "form-horizontal login-form", "onSubmit": this.handleSubmit}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "tenantId", "className": "col-sm-2 control-label"}, "Tenant Id:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("input", {"id": "tenantId", "type": "text", "className": "form-control", "value": this.state.tenantId, "onChange": this.handleChange.bind(this, 'tenantId'), "required": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "gatewayUrl", "className": "col-sm-2 control-label"}, "Gateway URL:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("div", {"className": "input-group"}, React.createElement("input", {"id": "gatewayUrl", "type": "text", "className": "form-control", "value": this.state.gatewayUrl, "onChange": this.handleChange.bind(this, 'gatewayUrl'), "aria-describedby": "http-addon", "required": true})))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "userId", "className": "col-sm-2 control-label"}, "User Id:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("input", {"id": "userId", "type": "text", "className": "form-control", "value": this.state.userId, "onChange": this.handleChange.bind(this, 'userId'), "required": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "password", "className": "col-sm-2 control-label"}, "Password:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("input", {"id": "password", "type": "password", "className": "form-control", "value": this.state.password, "onChange": this.handleChange.bind(this, 'password'), "required": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "clientType", "className": "col-sm-2 control-label"}, "Client Type:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("label", {"className": "radio-inline"}, React.createElement("input", {"id": "clientType", "type": "radio", "onChange": this.handleRadioChange.bind(this, 'clientType', 'LIMITED_ACCESS'), "checked": this.state.clientType === 'LIMITED_ACCESS'}), "Limited"), React.createElement("label", {"className": "radio-inline"}, React.createElement("input", {"id": "clientType", "type": "radio", "onChange": this.handleRadioChange.bind(this, 'clientType', 'RICH_CLIENT'), "checked": this.state.clientType === 'RICH_CLIENT'}), "Rich"))), React.createElement("div", {"className": "form-group"}, React.createElement("div", {"className": "col-sm-10 col-sm-offset-2"}, React.createElement("button", {"type": "submit", "className": "btn btn-default btn-primary btn-block", "value": "Login"}, "Login", React.createElement("span", {"className": "glyphicon glyphicon-log-in", "aria-hidden": "true"})))))), React.createElement("div", {"className": "text-center"}, React.createElement("h3", null, "You can see the markup for this app ", React.createElement("a", {"href": "https://git.catavolt.com/javascript/sdk/blob/master/catreact/js/components/app.tsx"}, "here")))));
        }
        else {
            return null;
        }
    },
    handleChange: function (field, e) {
        var nextState = {};
        nextState[field] = e.target.value;
        this.setState(nextState);
    },
    handleRadioChange: function (field, value, e) {
        var nextState = {};
        nextState[field] = value;
        this.setState(nextState);
    },
    handleSubmit: function (e) {
        e.preventDefault();
        this.context.catavolt.login(this.state.gatewayUrl, this.state.tenantId, this.state.clientType, this.state.userId, this.state.password)
            .onComplete((appWinDefTry) => {
            this.setState({ loggedIn: true });
            this.props.loginListeners.forEach((listener) => { listener(); });
            this.context.eventRegistry.publish({ type: CvEventType.LOGIN, eventObj: {} });
        });
    }
});
