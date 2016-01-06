/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>

interface CvNavigationState extends CvState {
}

interface CvNavigationProps extends CvProps {
    navRequestTry:Try<NavRequest>;
    onNavRequest:(navRequestTry:Try<NavRequest>) => void;
}


/*
 ***************************************************
 * Render a NavRequest
 ***************************************************
 */
var CvNavigation = React.createClass<CvNavigationProps, CvNavigationState>({

    render: function() {
        if(this.props.navRequestTry && this.props.navRequestTry.isSuccess) {
            if(this.props.navRequestTry.success instanceof FormContext) {
                return <CvForm catavolt={this.props.catavolt} formContext={this.props.navRequestTry.success} onNavRequest={this.props.onNavRequest}/>
            } else {
                return <CvMessage message={"Unsupported type of NavRequest " + this.props.navRequestTry}/>
            }
        } else {
            return <span> </span>
        }
    }

});