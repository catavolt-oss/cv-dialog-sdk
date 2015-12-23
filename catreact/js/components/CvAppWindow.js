/**
 * Created by rburson on 12/23/15.
 */
var React = require('react');
var CvWorkbench = require('./CvWorkbench');
var CvNavigation = require('./CvNavigation');
var CvToolbar = require('./CvToolbar');

/*
 ***************************************************
 * A component analogous to Catavolt AppWinDef
 ***************************************************
 */
var CvAppWindow = React.createClass({

    getInitialState: function () {
        return {workbenches: [],
            navRequestTry: null
        }
    },

    render: function () {

        var workbenches = this.props.catavolt.appWinDefTry.success.workbenches;

        return (
            <span>
                <CvToolbar/>
            <div className="container">
                {(() => {
                    if(this.showWorkbench()) {
                        return (
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Default Workbench</h3>
                                </div>
                                <CvWorkbench catavolt={this.props.catavolt} workbench={workbenches[0]}
                                             onNavRequest={this.onNavRequest}/>
                            </div>
                        );
                    }
                })()}
                <CvNavigation navRequestTry={this.state.navRequestTry} onNavRequest={this.onNavRequest}/>
            </div>
            </span>
        );
    },

    showWorkbench: function() {
        return this.props.persistentWorkbench ||
            !this.state.navRequestTry;
    },

    onNavRequest: function(navRequestTry) {
        if(navRequestTry.isFailure) {
            alert('Handle Navigation Failure!');
            Log.error(navRequestTry.failure);
        } else {
            this.setState({navRequestTry: navRequestTry});
        }
    }


});

module.exports = CvAppWindow;
