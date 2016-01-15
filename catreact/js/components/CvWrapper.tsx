/**
 * Created by rburson on 1/15/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvWrapperState extends CvState {
}

interface CvWrapperProps extends CvProps {
}

/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
var CvWrapper = React.createClass<CvWrapperProps, CvWrapperState>({

    mixins: [CvBaseMixin],

    render: function() {

        if(React.Children.count(this.props.children) >0) {
            return this.props.children
        } else {
            return null;
        }
    }

});