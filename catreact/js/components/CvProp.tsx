/**
 * Created by rburson on 1/14/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvPropState extends CvState {
    prop:Prop
}

interface CvPropProps extends CvProps {
    propName:string;
}

/*
 ***************************************************
 * Render a Property
 ***************************************************
 */
var CvProp = React.createClass<CvPropProps, CvPropState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {
        const entityRec:EntityRec = this.context.scopeObj;
        const prop:Prop = entityRec.propAtName(this.props.propName)
        this.setState({prop:prop});
    },

    getChildContext: function () {
        return {scopeObj: this.state.prop}
    },

    getInitialState: function () {
        return {prop: null}
    },

    render: function () {

        const prop = this.state.prop;

        if (prop) {
            if(React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {
                if(prop.value instanceof InlineBinaryRef) {
                    const binary:InlineBinaryRef = prop.value as InlineBinaryRef;
                    const mimeType:string = binary.settings['mime-type'] || 'image/jpg'
                    return <img style={this.props.style} src={'data:' + mimeType + ';base64,' + binary.inlineData} className={this.props.className}/>
                } else if(prop.value instanceof ObjectBinaryRef){
                    const binary:ObjectBinaryRef = prop.value as ObjectBinaryRef;
                    return <img style={this.props.style} src={binary.settings['webURL']}/>
                } else {
                    return <span style={this.props.style}>{prop.value ? PropFormatter.formatForRead(prop.value, null): ''}</span>
                }
            }
        } else {
            return null;
        }

    }

});