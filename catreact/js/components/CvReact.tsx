/**
 * Created by rburson on 1/6/16.
 */

 ///<reference path="../../typings/react/react-global.d.ts"/>
 ///<reference path="../catavolt/references.ts"/>
 ///<reference path="references.ts"/>

/*
    Base interface for catavolt component properties
 */

interface CvProps {
    catavolt?:AppContext;
    key?: string;
}

interface CvState {
}