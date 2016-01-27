/**
 * Created by rburson on 1/14/16.
 */
///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin} from './catreat'
import {Prop, EntityRec, InlineBinaryRef, ObjectBinaryRef, PropFormatter} from './catavolt'

export interface CvPropState extends CvState {
    prop:Prop
}

export interface CvPropProps extends CvProps {
    handler?: (o:Prop) => {};
    isVisible?: (o:Prop) => boolean;
    propName:string;
    defaultValue?:string;
}

/*
 ***************************************************
 * Render a Property
 ***************************************************
 */
export var CvProp = React.createClass<CvPropProps, CvPropState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {
        const entityRec:EntityRec = this.context.scopeObj;
        const prop:Prop = entityRec.propAtName(this.props.propName)
        this.setState({prop:prop});
    },

    getChildContext: function () {
        return {scopeObj: this.state.prop}
    },

    getDefaultProps: function () {
        return {propName:null, defaultValue:null, handler:null, isVisible:null}
    },

    getInitialState: function () {
        return {prop: null}
    },

    render: function () {

        const prop = this.state.prop;


        if((this.props.isVisible && this.props.isVisible(prop)) || !this.props.isVisible) {
            if (prop) {
                if (this.props.handler) {
                    return this.props.handler(prop);
                } else {
                    if (React.Children.count(this.props.children) > 0) {
                        return this.props.children
                    } else {
                        if (prop.value === null || prop.value === undefined) {
                            if (this.props.defaultValue !== null) {
                                return <span style={this.props.style}
                                             className={this.props.className}>{this.props.defaultValue}</span>
                            } else {
                                return null;
                            }
                        } else {
                            if (prop.value instanceof InlineBinaryRef) {
                                const binary:InlineBinaryRef = prop.value as InlineBinaryRef;
                                const mimeType:string = binary.settings['mime-type'] || 'image/jpg'
                                return <img style={this.props.style}
                                            src={'data:' + mimeType + ';base64,' + binary.inlineData}
                                            className={this.props.className}/>
                            } else if (prop.value instanceof ObjectBinaryRef) {
                                const binary:ObjectBinaryRef = prop.value as ObjectBinaryRef;
                                return <img style={this.props.style} className={this.props.className}
                                            src={binary.settings['webURL']}/>
                            } else {
                                return <span style={this.props.style}
                                             className={this.props.className}>{PropFormatter.formatForRead(prop.value, null)}</span>
                            }
                        }
                    }
                }
            } else {
                return null;
            }
        }else{
            return null;
        }

    }

});