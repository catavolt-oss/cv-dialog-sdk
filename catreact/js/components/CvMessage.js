/**
 * Created by rburson on 12/23/15.
 *
 */
import * as React from 'react';
import { CvBaseMixin } from './catreat';
import { Log } from './catavolt';
/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
export var CvMessage = React.createClass({
    mixins: [CvBaseMixin],
    render: function () {
        Log.info(this.props.message);
        return React.createElement("span", null);
    }
});
