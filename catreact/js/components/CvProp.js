/**
 * Created by rburson on 1/14/16.
 */
///<reference path="../../typings/react/react.d.ts"/>
import * as React from 'react';
import { CvBaseMixin } from './catreact';
import { InlineBinaryRef, ObjectBinaryRef, PropFormatter } from './catavolt';
/*
 ***************************************************
 * Render a Property
 ***************************************************
 */
export var CvProp = React.createClass({
    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function () {
        const entityRec = this.context.scopeObj;
        const prop = entityRec.propAtName(this.props.propName);
        this.setState({ prop: prop });
    },
    getChildContext: function () {
        return { scopeObj: this.state.prop };
    },
    getDefaultProps: function () {
        return { propName: null, defaultValue: null, handler: null, isVisible: null };
    },
    getInitialState: function () {
        return { prop: null };
    },
    render: function () {
        const prop = this.state.prop;
        if ((this.props.isVisible && this.props.isVisible(prop)) || !this.props.isVisible) {
            if (prop) {
                if (this.props.handler) {
                    return this.props.handler(prop);
                }
                else {
                    if (React.Children.count(this.props.children) > 0) {
                        return this.props.children;
                    }
                    else {
                        if (prop.value === null || prop.value === undefined) {
                            if (this.props.defaultValue !== null) {
                                return React.createElement("span", {"style": this.props.style, "className": this.props.className}, this.props.defaultValue);
                            }
                            else {
                                return null;
                            }
                        }
                        else {
                            if (prop.value instanceof InlineBinaryRef) {
                                const binary = prop.value;
                                const mimeType = binary.settings['mime-type'] || 'image/jpg';
                                return React.createElement("img", {"style": this.props.style, "src": 'data:' + mimeType + ';base64,' + binary.inlineData, "className": this.props.className});
                            }
                            else if (prop.value instanceof ObjectBinaryRef) {
                                const binary = prop.value;
                                return React.createElement("img", {"style": this.props.style, "className": this.props.className, "src": binary.settings['webURL']});
                            }
                            else {
                                return React.createElement("span", {"style": this.props.style, "className": this.props.className}, PropFormatter.formatForRead(prop.value, null));
                            }
                        }
                    }
                }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
});
