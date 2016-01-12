/**
 * Created by rburson on 1/11/16.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvScopeState extends CvState {
}

interface CvScopeProps extends CvProps{
    handler: (o:any) => {};
}

/*
 ***************************************************
 * Exposes the scope of the enclosing tag via the handler function
 ***************************************************
 */
var CvScope = React.createClass<CvScopeProps, CvScopeState>({

    mixins: [CvBaseMixin],

    getDefaultProps: function () {
        return { handler: null }
    },

    render: function () {
        if(this.context.scopeObj) {
            if(this.props.handler) {
                return this.props.handler(this.context.scopeObj)
            }
        }
        return null;
    },

});
