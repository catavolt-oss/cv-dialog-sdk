/**
 * Created by rburson on 1/11/16.
 */
import * as React from 'react';
import { CvBaseMixin } from './catreat';
/*
 ***************************************************
 * Exposes the scope of the enclosing tag via the handler function
 ***************************************************
 */
export var CvScope = React.createClass({
    mixins: [CvBaseMixin],
    getDefaultProps: function () {
        return { handler: null, get: null };
    },
    render: function () {
        if (this.context.scopeObj) {
            if (this.props.get) {
                const value = this.context.scopeObj[this.props.get];
                return value ? React.createElement("span", null, value) : null;
            }
            else if (this.props.handler) {
                return this.props.handler(this.context.scopeObj);
            }
        }
        return null;
    },
});
