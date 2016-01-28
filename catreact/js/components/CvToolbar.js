/**
 * Created by rburson on 12/23/15.
 */
import * as React from 'react';
import { CvBaseMixin } from './catreact';
/*
 ***************************************************
 * Render a top-level application toolbar
 ***************************************************
 */
export var CvToolbar = React.createClass({
    mixins: [CvBaseMixin],
    render: function () {
        return (React.createElement("nav", {"className": "navbar navbar-default navbar-static-top component-chrome"}, React.createElement("div", {"className": "container-fluid"}, React.createElement("div", {"className": "navbar-header"}, React.createElement("button", {"type": "button", "className": "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#navbar", "aria-expanded": "false", "aria-controls": "navbar"}, React.createElement("span", {"className": "sr-only"}, "Toggle Navigation"), React.createElement("span", {"className": "icon-bar"}, " "), React.createElement("span", {"className": "icon-bar"}, " "), React.createElement("span", {"className": "icon-bar"}, " ")), React.createElement("a", {"className": "navbar-brand", "href": "#"}, "Catavolt")), React.createElement("div", {"id": "navbar", "className": "navbar-collapse collapse"}, React.createElement("ul", {"className": "nav navbar-nav navbar-right"}, React.createElement("li", {"className": "dropdown"}, React.createElement("a", {"href": "", "className": "dropdown-toggle", "data-toggle": "dropdown", "role": "button", "aria-expanded": "true"}, "Workbenches", React.createElement("span", {"className": "caret"}, " ")), React.createElement("ul", {"className": "dropdown-menu", "role": "menu"}, React.createElement("li", null, React.createElement("a", {"href": "#"}, "Default")))), React.createElement("li", null, React.createElement("a", {"href": "#"}, "Settings"))), React.createElement("form", {"className": "navbar-form navbar-right"}, React.createElement("input", {"type": "text", "className": "form-control", "placeholder": "Search For Help On..."}))))));
    }
});
