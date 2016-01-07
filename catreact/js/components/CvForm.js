/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a FormContext
 ***************************************************
 */
var CvForm = React.createClass({
    getInitialState: function () {
        return { statusMessage: '' };
    },
    render: function () {
        var _this = this;
        var formContext = this.props.formContext;
        return React.createElement("span", null, formContext.childrenContexts.map(function (context) {
            Log.info('');
            Log.info('Got a ' + context.constructor['name'] + ' for display');
            Log.info('');
            if (context instanceof ListContext) {
                return React.createElement(CvList, {"listContext": context, "onNavRequest": _this.props.onNavRequest, "key": context.paneRef});
            }
            else if (context instanceof DetailsContext) {
                return React.createElement(CvDetails, {"detailsContext": context, "onNavRequest": _this.props.onNavRequest, "key": context.paneRef});
            }
            else {
                Log.info('');
                Log.info('Not yet handling display for ' + context.constructor['name']);
                Log.info('');
                return React.createElement(CvMessage, {"message": "Not yet handling display for " + context.constructor['name'], "key": context.paneRef});
            }
        }), React.createElement("div", {"className": "panel-footer"}, this.state.statusMessage));
        return React.createElement(CvMessage, {"message": "Could not render any contexts!"});
    }
});
