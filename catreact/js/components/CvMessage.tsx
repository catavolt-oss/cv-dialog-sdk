/**
 * Created by rburson on 12/23/15.
 *
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>

interface CvMessageState extends CvState {
}

interface CvMessageProps extends CvProps {
    message:string;
}

/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
var CvMessage = React.createClass<CvMessageProps, CvMessageState>({

    render: function() {
        Log.info(this.props.message);
        return <span></span>
    }

});