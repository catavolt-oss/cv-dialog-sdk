var React = require('react');
var ReactDOM = require('react-dom');

var AppWinDef = catavolt.dialog.AppWinDef;
var Try = catavolt.fp.Try;
var Log = catavolt.util.Log;
var ObjUtil = catavolt.util.ObjUtil;


var CatavoltPane = React.createClass({

    getInitialState: function () {
        return {loggedIn: false}
    },

    render: function () {
        var Catavolt = catavolt.dialog.AppContext.singleton;
        return this.state.loggedIn ? <CvAppWindow catavolt={Catavolt} loggedOutFn={this.loggedOut}/> :
            <CvLoginPane catavolt={Catavolt} loggedInFn={this.loggedIn}/>
    },

    loggedIn: function () {
        this.setState({loggedIn: true})
    },

    loggedOut: function () {
        this.setState({loggedIn: false})
    }

});


var CvLoginPane = React.createClass({

    getInitialState: function () {
        return {
            tenantId: '***REMOVED***z',
            gatewayUrl: 'www.catavolt.net',
            userId: 'sales',
            password: '***REMOVED***',
            clientType: 'LIMITED_ACCESS'
        }
    },

    render: function () {
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
                                    Login <span className="glyphicon glyphicon-log-in" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    },

    handleChange: function (field, e) {
        var nextState = {};
        nextState[field] = e.target.value;
        this.setState(nextState);
    },

    handleRadioChange: function (field, value, e) {
        var nextState = {};
        nextState[field] = value;
        this.setState(nextState);
    },

    handleSubmit: function (e) {
        e.preventDefault();
        var comp = this;
        this.props.catavolt.login(this.state.gatewayUrl, this.state.tenantId, this.state.clientType, this.state.userId, this.state.password)
            .onComplete(function (appWinDefTry:Try<AppWinDef>) {
                Log.info(ObjUtil.formatRecAttr(appWinDefTry.success.workbenches[0]));
                comp.props.loggedInFn();
            });
    }
});

var CvAppWindow = React.createClass({

    getInitialState: function () {
        return {workbenches: []}
    },

    render: function () {

        var workbenches = this.props.catavolt.appWinDefTry.success.workbenches;
        return (
            <div className="container">
                <div className="container-fluid">
                    <div className="center-block logo">
                        <img className="img-responsive center-block" src="img/Catavolt-Logo-retina.png"
                             style={{verticalAlign: 'middle'}}/>
                    </div>
                </div>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h3 className="panel-title">Default Workbench</h3>
                        <CvWorkbench catavolt={this.props.catavolt} workbench={workbenches[0]}/>
                    </div>
                </div>
            </div>
        );
    }

});

var CvWorkbench = React.createClass({

    render: function () {

        var launchActions = this.props.workbench.workbenchLaunchActions;
        var launchComps = [];
        for(let i=0; i < launchActions.length; i++) {
            launchComps.push(<CvLauncher launchAction={launchActions[i]}/>);
        }
        return (
            <div className="panel-body">{launchComps}</div>
        );
    }
});

var CvLauncher = React.createClass({

    render: function() {
        return (
            <div className="col-md-4 launch-div">
                <img className="launch-icon img-responsive center-block" src={this.props.launchAction.iconBase} />
                <h5 className="launch-text small text-center">{this.props.launchAction.name}</h5>
            </div>
        );
    }

});

var CvToolBar = React.createClass({
    render: function () {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">catavolt</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li className="dropdown">
                                <a href="" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-expanded="true">workbenches<span className="caret"></span></a>
                                <ul className="dropdown-menu" role="menu">
                                    <li><a href="#">default</a></li>
                                </ul>
                            </li>
                            <li><a href="#">settings</a></li>
                        </ul>
                        <form className="navbar-form navbar-right">
                            <input type="text" className="form-control" placeholder="search help..."/>
                        </form>
                    </div>
                </div>
            </nav>
        );
    }
});

ReactDOM.render(
    <CatavoltPane/>,
    document.getElementById('root')
);