/**
 * Created by rburson on 1/15/16.
 */
import * as React from 'react';
import { CvBaseMixin } from './catreact';
/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
export var CvResource = React.createClass({
    mixins: [CvBaseMixin],
    getDefaultProps: function () {
        return { type: 'image', resourceName: '' };
    },
    render: function () {
        if (this.props.resourceName) {
            let baseUrl = null;
            const tenantSettingsTry = this.context.catavolt.tenantSettingsTry;
            if (tenantSettingsTry.isSuccess) {
                baseUrl = tenantSettingsTry.success['GMLAssetsURL'];
            }
            if (this.props.type === 'image') {
                return React.createElement("img", {"style": this.props.style, "className": this.props.className, "src": baseUrl + this.props.resourceName});
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
});
