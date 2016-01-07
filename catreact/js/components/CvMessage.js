/**
 * Created by rburson on 12/23/15.
 *
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
var CvMessage = React.createClass({
    render: function () {
        Log.info(this.props.message);
        return React.createElement("span", null);
    }
});
