/**
 * Created by rburson on 12/23/15.
 */


var React = require('react');

var CvForm = require('./CvForm');
var CvMessage = require('./CvMessage');

var util = require('../catavolt/util');
var Log = util.Log;

/*
 ***************************************************
 * Render a NavRequest
 ***************************************************
 */
var CvNavigation = React.createClass({

    render: function() {
        if(this.props.navRequestTry && this.props.navRequestTry.isSuccess) {
            if(this.props.navRequestTry.success instanceof FormContext) {
                return <CvForm catavolt={this.props.catavolt} formContext={this.props.navRequestTry.success} onNavRequest={this.props.onNavRequest}/>
            } else {
                return <CvMessage message={"Unsupported type of NavRequest " + this.props.navRequestTry}/>
            }
        } else {
            return <span> </span>
        }
    }

});

module.exports = CvNavigation;
