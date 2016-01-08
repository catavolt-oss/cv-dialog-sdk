/**
 * Created by rburson on 1/6/16.
 */

 ///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
 ///<reference path="references.ts"/>

/*
    Base interface for catavolt component properties
 */

interface CvProps {
    key?: string;
}

interface CvState {
}

var CvBaseMixin = {

    contextTypes: {
        catavolt: React.PropTypes.object
    }

}