/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a Workbench
 ***************************************************
 */
var CvWorkbench = React.createClass({
    render: function () {
        var launchActions = this.props.workbench.workbenchLaunchActions;
        var launchComps = [];
        for (var i = 0; i < launchActions.length; i++) {
            launchComps.push(React.createElement(CvLauncher, {"catavolt": this.props.catavolt, "launchAction": launchActions[i], "key": launchActions[i].actionId, "onLaunch": this.actionLaunched}));
        }
        return (React.createElement("div", {"className": "panel panel-primary"}, React.createElement("div", {"className": "panel-heading"}, " ", React.createElement("h3", {"className": "panel-title"}, this.props.workbench.name), " "), React.createElement("div", {"className": "panel-body"}, launchComps)));
    },
    actionLaunched: function (launchTry) {
        this.props.onNavRequest(launchTry);
    }
});
