/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvWorkbenchState extends CvState {
    workbench:Workbench;
}

interface CvWorkbenchProps extends CvProps {
    workbenchId:string;
    onNavRequest?:(navRequestTry:Try<NavRequest>) => void;
}

/*
 ***************************************************
 * Render a Workbench
 ***************************************************
 */

var CvWorkbench = React.createClass<CvWorkbenchProps, CvWorkbenchState>({

    mixins: [CvBaseMixin],

    componentWillMount: function () {
        var targetWorkbench:Workbench = null;
        this.context.catavolt.appWinDefTry.success.workbenches.some((workbench)=> {
            if (workbench.workbenchId == this.props.workbenchId) {
                targetWorkbench = workbench;
                return true;
            } else {
                return false;
            }
        })

        this.findAllDescendants(this, (comp)=>{ return comp.type == CvScope})
        .forEach((comp)=>{comp.setScopeObj(targetWorkbench)});
        this.setState({workbench: targetWorkbench})
    },

    render: function () {

        if (this.state.workbench) {

            if(React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {

            var launchActions:Array<WorkbenchLaunchAction> = this.state.workbench.workbenchLaunchActions;
            var launchComps = [];
            for (let i = 0; i < launchActions.length; i++) {
                launchComps.push(
                    <CvLauncher launchAction={launchActions[i]} key={launchActions[i].actionId}
                                onLaunch={this.actionLaunched}/>
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

    actionLaunched: function (launchTry:Try<NavRequest>) {
        this.props.onNavRequest(launchTry);
    }

});
