/**
 * Created by rburson on 12/23/15.
 */
var util = require('../catavolt/util');
var Log = util.Log;
/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */

var React = require('react');

var CvMessage = React.createClass({

    render: function() {
        Log.info(this.props.message);
        return <span></span>
    }

});

module.exports = CvMessage;