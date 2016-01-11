/**
 * Created by rburson on 1/11/16.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvScopeState extends CvState {
    scopeObj:any;
}

interface CvScopeProps extends CvProps{
    handler: (o:any) => {}
}

/*
 ***************************************************
 * Exposes the scope of the encosing tag via the handler function
 ***************************************************
 */
var CvScope = React.createClass<CvScopeProps, CvScopeState>({

    mixins: [CvBaseMixin],

    getDefaultProps: function () {
        return { handler: null }
    },

    getInitialState() {
        return {scopeObj: null}
    },

    render: function () {
        if(this.state.scopeObj) {
            if(this.props.handler) {
                return this.props.handler(this.state.scopeObj);
            }
        }
        return null;
    },

    setScopeObj: function(obj) {
        this.setState({scopeObj:obj});
    }

});
