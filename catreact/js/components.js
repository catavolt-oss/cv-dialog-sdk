var React = require('react');
var ReactDOM = require('react-dom');

var AppWinDef = catavolt.dialog.AppWinDef;
var FormContext = catavolt.dialog.FormContext;
var Log = catavolt.util.Log;
var ObjUtil = catavolt.util.ObjUtil;
var Try = catavolt.fp.Try;
var QueryMarkerOption = catavolt.dialog.QueryMarkerOption;

//Log.logLevel(catavolt.util.LogLevel.DEBUG);

/*
   ***************************************************
   *  Top-level container for a Catavolt Application
   ***************************************************
 */
var CatavoltPane = React.createClass({

    checkSession: function() {
        var sessionContext = this.getSession();
        if(sessionContext){
            this.props.catavolt.refreshContext(sessionContext).onComplete(appWinDefTry=>{
                if(appWinDefTry.isFailure) {
                    Log.error("Failed to refresh session: " + ObjUtil.formatRecAttr(appWinDefTry.failure));
                } else {
                    this.setState({loggedIn:true});
                }
            });
        }
    },

    componentWillMount: function() {
        /* @TODO - need to work on the AppContext to make the session restore possible */
        //this.checkSession();
    },

    getDefaultProps: function() {
       return {catavolt: catavolt.dialog.AppContext.singleton}
    },

    getInitialState: function () {
        return {loggedIn: false}
    },

    getSession: function() {
        var session = sessionStorage.getItem('session');
        return session ? JSON.parse(session) : null;

    },

    render: function () {

        return this.state.loggedIn ?
            (<CvAppWindow catavolt={this.props.catavolt} onLogout={this.loggedOut}/>) :
            (<span><CvHeroHeader/><CvLoginPane catavolt={this.props.catavolt} onLogin={this.loggedIn}/></span>);

    },

    loggedIn: function (sessionContext) {
        this.setState({loggedIn: true})
        this.storeSession(this.props.catavolt.sessionContextTry.success);
    },

    loggedOut: function () {
        this.removeSession();
        this.setState({loggedIn: false})
    },

    removeSession: function() {
      sessionStorage.removeItem('session');
      sessionStorage.removeItem('systemCtx');
    },

    storeSession: function(sessionContext) {
        sessionStorage.setItem('session', JSON.stringify(sessionContext));
        sessionStorage.setItem('systemCtx', JSON.stringify(sessionContext.systemContext));
    }

});

/*
  ***************************************************
  * A component analogous to Catavolt AppWinDef
  ***************************************************
 */
var CvAppWindow = React.createClass({

    getInitialState: function () {
        return {workbenches: [],
                navRequestTry: null}
    },

    render: function () {

        var workbenches = this.props.catavolt.appWinDefTry.success.workbenches;
        return (
            <span>
                <CvToolbar/>
            <div className="container">
                {(() => {
                        if(!this.state.navRequestTry) {
                        return (
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Default Workbench</h3>
                                </div>
                            <CvWorkbench catavolt={this.props.catavolt} workbench={workbenches[0]} onNavRequest={this.onNavRequest}/>
                            </div>
                        );
                    } else {
                        if(this.state.navRequestTry.isSuccess) {
                            return <CvNavigation navRequest={this.state.navRequestTry.success} onNavRequest={this.onNavRequest}/>
                        } else {
                            return <CvMessage message={'Failed to Navigate: ' + this.state.navRequestTry.failure}/>
                        }
                    }
                })()}
            </div>
            </span>
        );
    },

    onNavRequest: function(navRequestTry) {
        if(navRequestTry.isFailure) {
            alert('Handle Navigation Failure!');
            Log.error(navRequestTry.failure);
        } else {
            Log.info('Succeeded with ' + navRequestTry.success);
            this.setState({navRequestTry: navRequestTry});
        }
    }


});


/*
  ***************************************************
  * When you need to look fancy
  ***************************************************
 */
var CvHeroHeader = React.createClass({

    render: function() {
        return (
            <div className="jumbotron logintron">
                <div className="container-fluid">
                    <div className="center-block">
                        <img className="img-responsive center-block" src="img/Catavolt-Logo-retina.png" style={{verticalAlign: 'middle'}}/>
                    </div>
                </div>
            </div>
        );
    }
});


/*
  ***************************************************
  * Render a DetailsContext
  ***************************************************
 */
var CvDetails = React.createClass({

    getInitialState() {
        return {renderedDetailRows: []}
    },

    componentWillMount: function() {
        this.layoutDetailsPane(this.props.detailsContext);
    },

    render: function () {
        const detailsContext = this.props.detailsContext;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <span>{detailsContext.paneTitle || '>'}</span>
                    <div className="pull-right">
                        {detailsContext.menuDefs.map((menuDef, index) => { return <CvMenu key={index} menuDef={menuDef}/> })}
                    </div>
                </div>
                <div style={{maxHeight: '400px', overflow: 'auto'}}>
                    <table className="table table-striped">
                        <tbody>{this.state.renderedDetailRows}</tbody>
                    </table>
                </div>
            </div>
        )
    },

    layoutDetailsPane: function (detailsContext) {

        let allDefsComplete = Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
        const renderedDetailRows = [];
        detailsContext.detailsDef.rows.forEach((cellDefRow)=> {
            if (this.isValidDetailsDefRow(cellDefRow)) {
                if (this.isSectionTitleDef(cellDefRow)) {
                    allDefsComplete = allDefsComplete.map((lastRowResult)=> {
                        var titleRow = this.createTitleRow(cellDefRow);
                        renderedDetailRows.push(titleRow);
                        return titleRow;
                    });
                } else {
                    allDefsComplete = allDefsComplete.bind((lastRowResult)=> {
                        return this.createEditorRow(cellDefRow, detailsContext).map((editorRow)=> {
                            renderedDetailRows.push(editorRow);
                            return editorRow;
                        });
                    });
                }
            } else {
                Log.info('Detail row is invalid ' + ObjUtil.formatRecAttr(cellDefRow));
            }
        });

        allDefsComplete.onComplete((lastRowResultTry)=> {
            this.setState({renderedDetailRows: renderedDetailRows});
        });
    },

    isValidDetailsDefRow: function (row) {
        return row.length === 2 &&
            row[0].values.length === 1 &&
            row[1].values.length === 1 &&
            (row[0].values[0] instanceof LabelCellValueDef ||
            row[1].values[0] instanceof ForcedLineCellValueDef) &&
            (row[1].values[0] instanceof AttributeCellValueDef ||
            row[1].values[0] instanceof LabelCellValueDef ||
            row[1].values[0] instanceof ForcedLineCellValueDef);
    },

    isSectionTitleDef: function (row) {
        return row[0].values[0] instanceof LabelCellValueDef &&
            row[1].values[0] instanceof LabelCellValueDef;
    },

    createTitleRow: function (row) {
        return <tr><td><span>{row[0].values[0]}</span></td><td><span>{row[1].values[0]}</span></td></tr>;
    },

    /* Returns a Future */
    createEditorRow: function (row, detailsContext) {
        let labelDef = row[0].values[0];
        let label;
        if (labelDef instanceof LabelCellValueDef) {
            label = <span>{labelDef.value}</span>
        } else {
            label = <span>N/A</span>
        }

        var valueDef = row[1].values[0];
        if (valueDef instanceof AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
            return this.createEditorControl(valueDef, detailsContext).map((editorCellString)=> {
                return <tr>{[<td>{label}</td>, <td>{editorCellString}</td>]}</tr>
            });
        } else if (valueDef instanceof AttributeCellValueDef) {
            let value = "";
            var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
            if (prop && detailsContext.isBinary(valueDef)) {
                value = <span></span>;
            } else if (prop) {
                value = <span>{detailsContext.formatForRead(prop.value, prop.name)}</span>
            }
            return Future.createSuccessfulFuture('createEditorRow', <tr>{[<td>{label}</td>, <td>{value}</td>]}</tr>);
        } else if (valueDef instanceof LabelCellValueDef) {
            const value = <span>{valueDef.value}</span>
            return Future.createSuccessfulFuture('createEditorRow', <tr>{[<td>{label}</td>, <td>{value}</td>]}</tr>);
        } else {
            return Future.createSuccessfulFuture('createEditorRow', <tr>{[<td>{label}</td>, <td></td>]}</tr>);
        }

    },

    /* Returns a Future */
    createEditorControl: function (attributeCellValueDef, detailsContext) {
        if (attributeDef.isComboBoxEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map((values)=> {
                return <span></span>
                //return '<ComboBox>' + values.join(", ") + '</ComboBox>';
            });
        } else if (attributeDef.isDropDownEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map((values)=> {
                return <span></span>
                //return '<DropDown>' + values.join(", ") + '</DropDown>';
            });
        } else {
            var entityRec = detailsContext.buffer;
            var prop = entityRec.propAtName(attributeDef.propertyName);
            if (prop && detailsContext.isBinary(attributeDef)) {
                return Future.createSuccessfulFuture('createEditorControl', <span></span>);
                //return Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
            } else {
                var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
                return Future.createSuccessfulFuture('createEditorControl', <span>{value}</span>);
            }
        }
    }
});

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

/*
  ***************************************************
  * Render a 'Launcher'
  ***************************************************
 */
var CvLauncher = React.createClass({

    render: function() {
        return (
            <div className="col-md-4 launch-div">
                <img className="launch-icon img-responsive center-block" src={this.props.launchAction.iconBase} onClick={this.handleClick}/>
                <h5 className="launch-text small text-center" onClick={this.handleClick}>{this.props.launchAction.name}</h5>
            </div>
        );
    },

    handleClick: function() {
        this.props.catavolt.performLaunchAction(this.props.launchAction).onComplete(launchTry => {
            this.props.onLaunch(launchTry);
        });
    }

});

/*
  ***************************************************
  * Render a ListContext
  ***************************************************
 */
var CvList = React.createClass({

    getInitialState() {
        return {entityRecs: []}
    },

    componentWillMount: function() {

        const listContext = this.props.listContext;
        listContext.setScroller(50, null, [QueryMarkerOption.None]);
        listContext.scroller.refresh().onComplete(entityRecTry=>{
             Log.info('Finished refresh');
             if(entityRecTry.isFailure) {
                 Log.error("ListContext failed to render with " + ObjUtil.formatRecAttr(entityRecTry.failure));
             } else {
                 Log.info(JSON.stringify(listContext.scroller.buffer));
                 this.setState({entityRecs: ArrayUtil.copy(listContext.scroller.buffer)});
             }
         });


    },

    itemDoubleClicked: function(objectId) {
        const listContext = this.props.listContext;
        if(listContext.listDef.defaultActionId) {
            var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW',
                listContext.listDef.defaultActionId, null, null, []);
            listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(navRequestTry=>{
                this.props.onNavRequest(navRequestTry);
            });
        }
    },

    render: function(){

        const listContext = this.props.listContext;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <span>{listContext.paneTitle || '>'}</span>
                    <div className="pull-right">
                        {listContext.menuDefs.map((menuDef, index) => { return <CvMenu key={index} menuDef={menuDef}/> })}
                    </div>
                </div>
                <div style={{maxHeight: '400px', overflow: 'auto'}}>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th key="nbsp">&nbsp;</th>
                            {listContext.columnHeadings.map((heading, index) => { return <th key={index}>{heading}</th> })}
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.entityRecs.map((entityRec, index) => {
                            return (
                                <tr key={index} onDoubleClick={this.itemDoubleClicked.bind(this, entityRec.objectId)}>
                                    <td className="text-center" key="checkbox"><input type="checkbox"/> </td>
                                    {listContext.rowValues(entityRec).map((val,index)=>{ return <td key={index}>{val ? val.toString() : ' '}</td> })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
});

/*
  ***************************************************
  * Render a LoginPane
  ***************************************************
 */
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
        this.props.catavolt.login(this.state.gatewayUrl, this.state.tenantId, this.state.clientType, this.state.userId, this.state.password)
            .onComplete(appWinDefTry => {
                Log.info(ObjUtil.formatRecAttr(appWinDefTry.success.workbenches[0]));
                this.props.onLogin();
            });
    }
});

/*
    ***************************************************
    * Render a 'context menu' for a MenuDef
    ***************************************************
 */
var CvMenu = React.createClass({

    render: function() {

        const menuDef = this.props.menuDef;

        var findContextMenuDef = md => {
            if(md.name === 'CONTEXT_MENU') return md;
            if(md.menuDefs) {
                for (let i = 0; i < md.menuDefs.length; i++) {
                    let result = findContextMenuDef(md.menuDefs[i]);
                    if (result) return result;
                }
            }
            return null;
        }

        const ctxMenuDef = findContextMenuDef(menuDef);

        return (
            <div className="btn-group">
                <button type="button" className="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">
                    <span className="caret"> </span>
                </button>
                <ul className="dropdown-menu" role="menu">
                    {ctxMenuDef.menuDefs.map((md, index)=>{
                        return <li key={index}><a onClick={this.performMenuAction(md.actionId)}>{md.label}</a></li>
                    })}
                    <li className="divider" key="divider"> </li>
                    <li key="select_all"><a onClick={this.selectAll()}>Select All</a></li>
                    <li key="deselect_all"><a onClick={this.deselectAll()}>Deselect All</a></li>
                </ul>
            </div>
        );
    },

    performMenuAction() {
    },

    selectAll: function() {
    },

    deselectAll: function() {
    },

});

/*
    ***************************************************
    * Render a simple message
    ***************************************************
 */
var CvMessage = React.createClass({

    render: function() {
        Log.info(this.props.message);
        return <span></span>
    }

});

/*
    ***************************************************
    * Render a NavRequest
    ***************************************************
 */
var CvNavigation = React.createClass({

    render: function() {
        if(this.props.navRequest instanceof FormContext) {
            return <CvForm catavolt={this.props.catavolt} formContext={this.props.navRequest} onNavRequest={this.props.onNavRequest}/>
        } else {
            return <CvMessage message="Unsupported type of NavRequest ${this.props.navRequest}"/>
        }
    }

});

/*
    ***************************************************
    * Render a top-level application toolbar
    ***************************************************
 */
var CvToolbar = React.createClass({
    render: function () {
        return (
            <nav className="navbar navbar-default navbar-static-top component-chrome">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle Navigation</span>
                            <span className="icon-bar"> </span>
                            <span className="icon-bar"> </span>
                            <span className="icon-bar"> </span>
                        </button>
                        <a className="navbar-brand" href="#">Catavolt</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li className="dropdown">
                                <a href="" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-expanded="true">Workbenches<span className="caret"> </span></a>
                                <ul className="dropdown-menu" role="menu">
                                    <li><a href="#">Default</a></li>
                                </ul>
                            </li>
                            <li><a href="#">Settings</a></li>
                        </ul>
                        <form className="navbar-form navbar-right">
                            <input type="text" className="form-control" placeholder="Search For Help On..."/>
                        </form>
                    </div>
                </div>
            </nav>
        );
    }
});

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

/*
    ***************************************************
    * Add the top-level pane to the dom
    ***************************************************
 */
ReactDOM.render(
    <CatavoltPane/>,
    document.getElementById('root')
);