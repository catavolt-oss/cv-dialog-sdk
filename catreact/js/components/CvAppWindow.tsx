/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvAppWindowState extends CvState {
    navRequestTry:Try<NavRequest>;
    loggedIn: boolean;
}

interface CvAppWindowProps extends CvProps {
    persistentWorkbench?:boolean;
    onLogout?:()=>void;
}

/*
 ***************************************************
 * A component analogous to Catavolt AppWinDef
 ***************************************************
 */
var CvAppWindow = React.createClass<CvAppWindowProps, CvAppWindowState>({

    mixins: [CvBaseMixin],

    componentDidMount: function () {
        this.context.eventRegistry.subscribe((loginEvent:CvEvent<VoidResult>)=> {
            this.setState({loggedIn: true})
        }, CvEventType.LOGIN);
    },

    getInitialState: function () {
        return {
            navRequestTry: null,
            loggedIn: false
        }
    },

    render: function () {

        if (this.state.loggedIn) {

            if (React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {

                var workbenches:Array<Workbench> = this.context.catavolt.appWinDefTry.success.workbenches;
                return (
                    <span>
                        <CvToolbar/>
                        <div className="container">
                            {(() => {
                                if (this.showWorkbench()) {
                                    return workbenches.map((workbench:Workbench, index)=>{
                                        return <CvWorkbench workbenchId={workbench.workbenchId} onNavRequest={this.onNavRequest} key={index}/>
                                        })
                                    }
                                })()}
                            <CvNavigation navRequestTry={this.state.navRequestTry} onNavRequest={this.onNavRequest}/>
                        </div>
                    </span>
                );
            }
        } else {
            return null;
        }
    },

    showWorkbench: function () {
        return this.props.persistentWorkbench || !this.state.navRequestTry;
    },

    onNavRequest: function (navRequestTry) {
        if (navRequestTry.isFailure) {
            alert('Handle Navigation Failure!');
            Log.error(navRequestTry.failure);
        } else {
            this.setState({navRequestTry: navRequestTry});
        }
    }


});
