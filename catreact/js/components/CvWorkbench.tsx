/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
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

    render: function () {

        var launchActions:Array<WorkbenchLaunchAction> = this.props.workbench.workbenchLaunchActions;
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

    actionLaunched: function(launchTry:Try<NavRequest>) {
        this.props.onNavRequest(launchTry);
    }

});
