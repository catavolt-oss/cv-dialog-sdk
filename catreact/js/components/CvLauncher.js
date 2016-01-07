/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a 'Launcher'
 ***************************************************
 */
var CvLauncher = React.createClass({
    render: function () {
        return (React.createElement("div", {"className": "col-md-4 launch-div"}, React.createElement("img", {"className": "launch-icon img-responsive center-block", "src": this.props.launchAction.iconBase, "onClick": this.handleClick}), React.createElement("h5", {"className": "launch-text small text-center", "onClick": this.handleClick}, this.props.launchAction.name)));
    },
    handleClick: function () {
        var _this = this;
        this.props.catavolt.performLaunchAction(this.props.launchAction).onComplete(function (launchTry) {
            _this.props.onLaunch(launchTry);
        });
    }
});
