/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>

interface CvLoginPaneState extends CvState {
    tenantId: string;
    gatewayUrl: string;
    userId: string;
    password: string;
    clientType: string;
}

interface CvLoginPaneProps extends CvProps {
    onLogin: ()=>void;
}

/*
 ***************************************************
 * Render a LoginPane
 ***************************************************
 */
var CvLoginPane = React.createClass<CvLoginPaneProps, CvLoginPaneState>({

    getInitialState: function () {
        return {
            tenantId: 'catavolt-dev',
            gatewayUrl: 'www.catavolt.net',
            userId: 'rob',
            password: 'rob123',
            clientType: 'RICH_CLIENT'
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
