/**
 * Created by rburson on 12/23/15.
 */
var React = require('react');

var CvList = require('./CvList');
var CvDetails = require('./CvDetails');
var CvMessage = require('./CvMessage');

var util = require('../catavolt/util');
var dialog = require('../catavolt/dialog');
var Log = util.Log;
var FormContext = dialog.FormContext;
var ListContext = dialog.ListConext;
var DetailsContext = dialog.DetailsContext;

/*
 ***************************************************
 * Render a FormContext
 ***************************************************
 */
var CvForm = React.createClass({

    getInitialState: function(){
        return {statusMessage: ''};
    },

    render: function() {

        const formContext = this.props.formContext;

        return <span>
            {formContext.childrenContexts.map(context => {
                Log.info('');
                Log.info('Got a ' + context.constructor['name'] + ' for display');
                Log.info('');
                if (context instanceof ListContext) {
                    return <CvList listContext={context} onNavRequest={this.props.onNavRequest} key={context.paneRef}/>
                } else if (context instanceof DetailsContext) {
                    return <CvDetails detailsContext={context} onNavRequest={this.props.onNavRequest} key={context.paneRef}/>
                } else {
                    Log.info('');
                    Log.info('Not yet handling display for ' + context.constructor['name']);
                    Log.info('');
                    return <CvMessage message={"Not yet handling display for " + context.constructor['name']} key={context.paneRef}/>
                }
            })}
            <div className="panel-footer">{this.state.statusMessage}</div>
        </span>

        return <CvMessage message="Could not render any contexts!"/>
    }

});

module.exports = CvForm;