/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a 'Launcher'
 ***************************************************
 */

interface CvLauncherState extends CvState {
    launchAction:WorkbenchLaunchAction;
}

interface CvLauncherProps extends CvProps {
    actionId?: string;
    launchListeners?: Array<(navRequestTry:Try<NavRequest>)=>void>
}

var CvLauncher = React.createClass<CvLauncherProps, CvLauncherState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {
        let workbench:Workbench = this.context.scopeObj;
        workbench.workbenchLaunchActions.some((launchAction)=> {
            if (launchAction.actionId == this.props.actionId) {
                this.setState({launchAction: launchAction})
                return true;
            } else {
                return false;
            }
        });
    },

    getChildContext: function () {
        return {
            scopeObj: this.state.launchAction
        }
    },

    getDefaultProps: function() {
        return {launchListeners:[]}
    },

    getInitialState: function () {
        return {launchAction: null}
    },

    render: function () {

        if (this.state.launchAction) {
            if (React.Children.count(this.props.children) > 0) {
                return <span onClick={this.handleClick}>{this.props.children}</span>;
            } else {
                return (
                    <div className="col-md-4 launch-div">
                        <img className="launch-icon img-responsive center-block" src={this.state.launchAction.iconBase}
                             onClick={this.handleClick}/>
                        <h5 className="launch-text small text-center"
                            onClick={this.handleClick}>{this.state.launchAction.name}</h5>
                    </div>
                );
            }
        } else {
            return null;
        }
    },

    handleClick: function () {
        this.context.catavolt.performLaunchAction(this.state.launchAction).onComplete((launchTry:Try<NavRequest>) => {
            this.props.launchListeners.forEach((listener)=>{listener(launchTry)});
            (this.context.eventRegistry as CvEventRegistry)
                .publish<CvNavigationResult>({type:CvEventType.NAVIGATION, eventObj:{navRequestTry:launchTry,
                    workbenchId:this.state.launchAction.workbenchId}});
        });
    }

});
