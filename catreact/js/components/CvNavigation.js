/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a NavRequest
 ***************************************************
 */
var CvNavigation = React.createClass({
    render: function () {
        if (this.props.navRequestTry && this.props.navRequestTry.isSuccess) {
            if (this.props.navRequestTry.success instanceof FormContext) {
                return React.createElement(CvForm, {"catavolt": this.props.catavolt, "formContext": this.props.navRequestTry.success, "onNavRequest": this.props.onNavRequest});
            }
            else {
                return React.createElement(CvMessage, {"message": "Unsupported type of NavRequest " + this.props.navRequestTry});
            }
        }
        else {
            return React.createElement("span", null, " ");
        }
    }
});
