/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvWorkbenchState extends CvState {
}

interface CvWorkbenchProps extends CvProps {
    workbench:Workbench;
    onNavRequest:(navRequestTry:Try<NavRequest>) => void;
}

/*
 ***************************************************
 * Render a Workbench
 ***************************************************
 */

var CvWorkbench = React.createClass<CvWorkbenchProps, CvWorkbenchState>({

    mixins: [CvBaseMixin],

    render: function () {

        var launchActions:Array<WorkbenchLaunchAction> = this.props.workbench.workbenchLaunchActions;
        var launchComps = [];
        for(let i=0; i < launchActions.length; i++) {
            launchComps.push(
                <CvLauncher launchAction={launchActions[i]} key={launchActions[i].actionId} onLaunch={this.actionLaunched}/>
            );
        }
        return (
            <div className="panel panel-primary">
                <div className="panel-heading"> <h3 className="panel-title">{this.props.workbench.name}</h3> </div>
                <div className="panel-body">{launchComps}</div>
            </div>
        );
    },

    actionLaunched: function(launchTry:Try<NavRequest>) {
        this.props.onNavRequest(launchTry);
    }

});
