var React = require('react');
var ReactDOM = require('react-dom');

var Catavolt = catavolt.dialog.AppContext.singleton;
var AppWinDef = catavolt.dialog.AppWinDef;
var Try = catavolt.fp.Try;
var Log = catavolt.util.Log;
var ObjUtil = catavolt.util.ObjUtil;

var LoginPane = React.createClass({

    getInitialState: function() {
        return {
            tenantId:'***REMOVED***z',
            gatewayUrl:'www.catavolt.net',
            userId:'sales',
            password:'***REMOVED***',
            clientType: 'LIMITED_ACCESS'
        }
    },

    render: function() {
        return (

            <div className="container">
                <div className="well">
                    <form className="form-horizontal login-form" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="tenantId" className="col-sm-2 control-label">Tenant Id:</label>
                            <div className="col-sm-10">
                                <input id="tenantId" type="text" className="form-control"
                                       value={this.state.tenantId}
                                       onChange={this.handleChange.bind(this, 'tenantId')}
                                       required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="gatewayUrl" className="col-sm-2 control-label">Gateway URL:</label>
                            <div className="col-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon" id="http-addon">http://</span>
                                    <input id="gatewayUrl" type="text" className="form-control"
                                           value={this.state.gatewayUrl}
                                           onChange={this.handleChange.bind(this, 'gatewayUrl')}
                                           aria-describedby="http-addon"
                                           required/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="userId" className="col-sm-2 control-label">User Id:</label>
                            <div className="col-sm-10">
                                <input id="userId" type="text" className="form-control"
                                       value={this.state.userId}
                                       onChange={this.handleChange.bind(this, 'userId')}
                                       required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="col-sm-2 control-label"> Password:</label>
                            <div className="col-sm-10">
                                <input id="password" type="password" className="form-control"
                                       value={this.state.password}
                                       onChange={this.handleChange.bind(this, 'password')}
                                       required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientType" className="col-sm-2 control-label">Client Type:</label>
                            <div className="col-sm-10">
                                <label className="radio-inline">
                                    <input id="clientType" type="radio"
                                           onChange={this.handleRadioChange.bind(this, 'clientType', 'LIMITED_ACCESS')}
                                           checked={this.state.clientType === 'LIMITED_ACCESS'}/>Limited</label>
                                <label className="radio-inline">
                                    <input id="clientType" type="radio"
                                           onChange={this.handleRadioChange.bind(this, 'clientType', 'RICH_CLIENT')}
                                           checked={this.state.clientType === 'RICH_CLIENT'}/>Rich</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-10 col-sm-offset-2">
                                <button type="submit" className="btn btn-default btn-primary btn-block" value="Login">
                                    Login  <span className="glyphicon glyphicon-log-in" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    },

    handleChange: function(field, e) {
        var nextState = {};
        nextState[field] = e.target.value;
        this.setState(nextState);
    },

    handleRadioChange: function(field, value, e) {
        var nextState = {};
        nextState[field] = value;
        this.setState(nextState);
    },

    handleSubmit: function(e) {
        e.preventDefault();
        Catavolt.login(this.state.gatewayUrl, this.state.tenantId, this.state.clientType, this.state.userId, this.state.password)
            .onComplete(function (appWinDefTry:Try<AppWinDef>) {
                Log.info(ObjUtil.formatRecAttr(appWinDefTry.success.workbenches[0]));
            });
    }
});

ReactDOM.render(
    <LoginPane/>,
    document.getElementById('root')
);