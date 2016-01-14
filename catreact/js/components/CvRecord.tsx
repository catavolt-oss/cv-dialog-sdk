/**
 * Created by rburson on 1/14/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvRecordState extends CvState {
}

interface CvRecordProps extends CvProps {
    entityRec?:EntityRec;
}

/*
 ***************************************************
 * Render an EntityRec
 ***************************************************
 */
var CvRecord = React.createClass<CvRecordProps, CvRecordState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {
    },

    getChildContext: function () {
        return {scopeObj: this.props.entityRec}
    },

    getInitialState: function () {
        return {}
    },

    render: function () {

        const entityRec = this.props.entityRec;

        if (entityRec) {
            if(React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {
                return <span>{'Default row goes here'}</span>
            }
        } else {
            return null;
        }

    }

});