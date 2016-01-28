/**
 * Created by rburson on 12/23/15.
 *
 */

///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin} from './catreact'
import {Log} from './catavolt'

export interface CvMessageState extends CvState {
}

export interface CvMessageProps extends CvProps {
    message:string;
}

/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
export var CvMessage = React.createClass<CvMessageProps, CvMessageState>({

    mixins: [CvBaseMixin],

    render: function() {
        Log.info(this.props.message);
        return <span></span>
    }

});
