/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>


interface CatavoltPaneState extends CvState {
    loggedIn:boolean;
}

interface CatavoltPaneProps extends CvProps {
    catavolt?:AppContext;
    persistentWorkbench?:boolean;
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

    childContextTypes: {
        catavolt: React.PropTypes.object
    },

    componentWillMount: function() {
        /* @TODO - need to work on the AppContext to make the session restore possible */
        //this.checkSession();
    },

    getChildContext: function() {
        return {catavolt: this.props.catavolt};
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

        if(React.Children.count(this.props.children) > 0){
            console.log(this.findFirstDescendantOfType(React.Children.toArray(this.props.children), CvLoginPane));
            if(React.Children.count(this.props.children) == 1) {
                return this.props.children;
            } else {
                return <span>{this.props.children}</span>
            }
        } else {
            return this.state.loggedIn ?
                (<CvAppWindow onLogout={this.loggedOut} persistentWorkbench={this.props.persistentWorkbench}/>) :
                (<span><CvHeroHeader/><CvLoginPane onLogin={this.loggedIn}/></span>);
        }

    },

    findFirstDescendantOfType: function(comps:Array<any>, compType:any) {
        var result = null;
        for(let i = 0; i < comps.length; i++) {
            const comp = comps[i];
            console.log(comp);
            if(comp.type == compType) {
                return comp;
            } else if (comp.props.children) {
                result = this.findFirstDescendantOfType(React.Children.toArray(comp.props.children), compType);
                if(result) return result;
            }
        }
        return null;
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
