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
}

interface CvLauncherProps extends CvProps{
    launchAction:WorkbenchLaunchAction;
    onLaunch: (navRequestTry:Try<NavRequest>)=>void;
}

var CvLauncher = React.createClass<CvLauncherProps, CvLauncherState>({

    mixins: [CvBaseMixin],

    render: function() {
        return (
            <div className="col-md-4 launch-div">
                <img className="launch-icon img-responsive center-block" src={this.props.launchAction.iconBase} onClick={this.handleClick}/>
                <h5 className="launch-text small text-center" onClick={this.handleClick}>{this.props.launchAction.name}</h5>
            </div>
        );
    },

    handleClick: function() {
        this.context.catavolt.performLaunchAction(this.props.launchAction).onComplete((launchTry:Try<NavRequest>) => {
            this.props.onLaunch(launchTry);
        });
    }

});
