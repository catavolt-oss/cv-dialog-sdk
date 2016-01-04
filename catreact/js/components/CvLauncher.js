/**
 * Created by rburson on 12/23/15.
 */


var React = require('react');
var CvMessage = require('./CvMessage');

/*
 ***************************************************
 * Render a 'Launcher'
 ***************************************************
 */
var CvLauncher = React.createClass({

    render: function() {
        return (
            <div className="col-md-4 launch-div">
                <img className="launch-icon img-responsive center-block" src={this.props.launchAction.iconBase} onClick={this.handleClick}/>
                <h5 className="launch-text small text-center" onClick={this.handleClick}>{this.props.launchAction.name}</h5>
            </div>
        );
    },

    handleClick: function() {
        this.props.catavolt.performLaunchAction(this.props.launchAction).onComplete(launchTry => {
            this.props.onLaunch(launchTry);
        });
    }

});

module.exports = CvLauncher;
