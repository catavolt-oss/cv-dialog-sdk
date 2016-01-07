/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * A component analogous to Catavolt AppWinDef
 ***************************************************
 */
var CvAppWindow = React.createClass({
    getInitialState: function () {
        return {
            workbenches: [],
            navRequestTry: null
        };
    },
    render: function () {
        var _this = this;
        var workbenches = this.props.catavolt.appWinDefTry.success.workbenches;
        return (React.createElement("span", null, React.createElement(CvToolbar, null), React.createElement("div", {"className": "container"}, (function () {
            if (_this.showWorkbench()) {
                return workbenches.map(function (workbench, index) {
                    return React.createElement(CvWorkbench, {"catavolt": _this.props.catavolt, "workbench": workbench, "onNavRequest": _this.onNavRequest});
                });
            }
        })(), React.createElement(CvNavigation, {"navRequestTry": this.state.navRequestTry, "onNavRequest": this.onNavRequest}))));
    },
    showWorkbench: function () {
        return this.props.persistentWorkbench || !this.state.navRequestTry;
    },
    onNavRequest: function (navRequestTry) {
        if (navRequestTry.isFailure) {
            alert('Handle Navigation Failure!');
            Log.error(navRequestTry.failure);
        }
        else {
            this.setState({ navRequestTry: navRequestTry });
        }
    }
});
