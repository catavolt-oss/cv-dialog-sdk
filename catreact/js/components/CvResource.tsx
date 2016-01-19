/**
 * Created by rburson on 1/15/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvResourceState extends CvState {
}

interface CvResourceProps extends CvProps {
    type?: string;
    resourceName:string
}

/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
var CvResource = React.createClass<CvResourceProps, CvResourceState>({

    mixins: [CvBaseMixin],

    getDefaultProps: function() {
        return {type:'image', resourceName: ''}
    },

    render: function() {
        if(this.props.resourceName) {
            let baseUrl = null;
            const tenantSettingsTry = (this.context.catavolt as AppContext).tenantSettingsTry;
            if(tenantSettingsTry.isSuccess) {
               baseUrl = tenantSettingsTry.success['GMLAssetsURL']
            }
            if(this.props.type === 'image') {
                return <img style={this.props.style} src={baseUrl + this.props.resourceName}/>
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

});