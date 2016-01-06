/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>

interface CatavoltPaneState extends CvState {
    loggedIn:boolean;
}

interface CatavoltPaneProps extends CvProps {
    persistentWorkbench:boolean;
}

/*
 ***************************************************
 *  Top-level container for a Catavolt Application
 ***************************************************
 */
var CatavoltPane = React.createClass<CatavoltPaneProps, CatavoltPaneState>({

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
        return {
            catavolt: AppContext.singleton,
            persistentWorkbench: false
        }
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
            (<CvAppWindow catavolt={this.props.catavolt} onLogout={this.loggedOut} persistentWorkbench={this.props.persistentWorkbench}/>) :
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
    },

    storeSession: function(sessionContext) {
        sessionStorage.setItem('session', JSON.stringify(sessionContext));
    }

});
