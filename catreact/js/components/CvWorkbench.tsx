/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvWorkbenchState extends CvState {
    workbench:Workbench;
    visible:boolean;
}

interface CvWorkbenchProps extends CvProps {
    persistent?: boolean;
    workbenchId:string;
}

/*
 ***************************************************
 * Render a Workbench
 ***************************************************
 */

var CvWorkbench = React.createClass<CvWorkbenchProps, CvWorkbenchState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {
        this.context.catavolt.appWinDefTry.success.workbenches.some((workbench)=> {
            if (workbench.workbenchId == this.props.workbenchId) {
                this.setState({workbench: workbench})
                return true;
            } else {
                return false;
            }
        });
        (this.context.eventRegistry as CvEventRegistry).subscribe<CvNavigationResult>((navEvent:CvEvent<CvNavigationResult>)=>{
            if(!this.props.persistent) {
                if(navEvent.eventObj.workbenchId == this.props.workbenchId) {
                    this.setState({visible: false});
                }
            }
        }, CvEventType.NAVIGATION);

    },

    getDefaultProps: function() {
        return {persistent: true, workbenchId:null}
    },

    getChildContext: function() {
        return {
            scopeObj: this.state.workbench
        }
    },

    getInitialState: function () {
        return {workbench: null, visible: true}
    },

    render: function () {

        if (this.state.workbench && this.state.visible) {

            if(React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {

            var launchActions:Array<WorkbenchLaunchAction> = this.state.workbench.workbenchLaunchActions;
            var launchComps = [];
            for (let i = 0; i < launchActions.length; i++) {
                launchComps.push(
                    <CvLauncher actionId={launchActions[i].actionId} key={launchActions[i].actionId}/>
                );
            }
            return (
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h3 className="panel-title">{this.state.workbench.name}</h3>
                    </div>
                    <div className="panel-body">{launchComps}</div>
                </div>
            );
            }

        } else {
            return null;
        }
    },

});
