/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvNavigationState extends CvState {
    navRequestTry:Try<NavRequest>;
}

interface CvNavigationProps extends CvProps {
    navigationListeners?: Array<(navRequestTry:Try<NavRequest>)=>void>
}


/*
 ***************************************************
 * Render a NavRequest
 ***************************************************
 */
var CvNavigation = React.createClass<CvNavigationProps, CvNavigationState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {

        (this.context.eventRegistry as CvEventRegistry).subscribe<CvNavigationResult>((navEvent:CvEvent<CvNavigationResult>)=> {
            this.setState({navRequestTry: navEvent.eventObj.navRequestTry})
        }, CvEventType.NAVIGATION);

    },

    getChildContext: function() {
        let navRequest = null;
        if(this.state.navRequestTry && !this.state.navRequestTry.isFailure) {
           navRequest = this.state.navRequestTry.success;
        }
        return {
            scopeObj: navRequest
        }
    },


    getInitialState: function () {
        return {navRequestTry: null}
    },

    render: function () {

        if (this.state.navRequestTry && this.state.navRequestTry.isSuccess) {

            if (React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {
                if (this.state.navRequestTry.success instanceof FormContext) {
                    return <CvForm/>
                } else {
                    return <CvMessage message={"Unsupported type of NavRequest " + this.state.navRequestTry}/>
                }
            }
        } else {
            return null;
        }
    }

});
