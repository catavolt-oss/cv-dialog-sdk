/**
 * Created by rburson on 1/11/16.
 */

///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin} from './catreact'

export interface CvScopeState extends CvState {
}

export interface CvScopeProps extends CvProps{
    handler?: (o:any) => {};
    get?: string;
}

/*
 ***************************************************
 * Exposes the scope of the enclosing tag via the handler function
 ***************************************************
 */
export var CvScope = React.createClass<CvScopeProps, CvScopeState>({

    mixins: [CvBaseMixin],

    getDefaultProps: function () {
        return { handler: null, get: null }
    },

    render: function () {
        if(this.context.scopeObj) {
            if(this.props.get) {
                const value = this.context.scopeObj[this.props.get];
                return value ? <span>{value}</span> : null;
            }else if(this.props.handler) {
                return this.props.handler(this.context.scopeObj)
            }
        }
        return null;
    },

});
