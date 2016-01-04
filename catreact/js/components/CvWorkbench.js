/**
 * Created by rburson on 12/23/15.
 */

var React = require('react');
var CvLauncher = require('./CvLauncher');

/*
 ***************************************************
 * Render a Workbench
 ***************************************************
 */
var CvWorkbench = React.createClass({


    render: function () {

        var launchActions = this.props.workbench.workbenchLaunchActions;
        var launchComps = [];
        for(let i=0; i < launchActions.length; i++) {
            launchComps.push(
                <CvLauncher catavolt={this.props.catavolt} launchAction={launchActions[i]} key={launchActions[i].actionId} onLaunch={this.actionLaunched}/>
            );
        }
        return (
            <div className="panel-body">{launchComps}</div>
        );
    },

    actionLaunched: function(launchTry) {
        this.props.onNavRequest(launchTry);
    }

});

module.exports = CvWorkbench;