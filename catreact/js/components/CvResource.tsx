/**
 * Created by rburson on 1/15/16.
 */

///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin} from './catreat'
import {AppContext} from './catavolt'

export interface CvResourceState extends CvState {
}

export interface CvResourceProps extends CvProps {
    type?: string;
    resourceName:string
}

/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
export var CvResource = React.createClass<CvResourceProps, CvResourceState>({

    mixins: [CvBaseMixin],

    getDefaultProps: function() {
        return {type:'image', resourceName: ''}
    },

    render: function() {
        if(this.props.resourceName) {
            let baseUrl = null;
            const tenantSettingsTry = (this.context.catavolt as AppContext).tenantSettingsTry;
            if(tenantSettingsTry.isSuccess) {
               baseUrl = tenantSettingsTry.success['GMLAssetsURL']
            }
            if(this.props.type === 'image') {
                return <img style={this.props.style} className={this.props.className} src={baseUrl + this.props.resourceName}/>
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

});