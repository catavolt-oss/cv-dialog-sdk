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
}

/*
 ***************************************************
 *  Top-level container for a Catavolt Application
 ***************************************************
 */
var CatavoltPane = React.createClass<CatavoltPaneProps, CatavoltPaneState>({

    mixins: [CvBaseMixin],

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
        catavolt: React.PropTypes.object,
        eventRegistry: React.PropTypes.object
    },

    componentDidMount: function() {

        alert('mounted')
        this.props.eventRegistry.subscribe((loginEvent:CvEvent<VoidResult>)=>{
            this.setState({loggedIn: true})
        }, CvEventType.LOGIN);

        this.props.eventRegistry.subscribe((logoutEvent:CvEvent<VoidResult>)=>{
            this.setState({loggedIn: false})
        }, CvEventType.LOGOUT);

        /* @TODO - need to work on the AppContext to make the session restore possible */
        //this.checkSession();

    },

    getChildContext: function() {
        return {
            catavolt: this.props.catavolt,
            eventRegistry: this.props.eventRegistry
        }
    },

    getDefaultProps: function() {
        return {
            catavolt: AppContext.singleton,
            eventRegistry: new CvEventRegistry(),
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
            return this.props.children
        } else {
            return <span>
                <CvLoginPane/>
                <CvAppWindow persistentWorkbench={true}/>
            </span>
        }

    },

    removeSession: function() {
        sessionStorage.removeItem('session');
    },

    storeSession: function(sessionContext) {
        sessionStorage.setItem('session', JSON.stringify(sessionContext));
    }

});
