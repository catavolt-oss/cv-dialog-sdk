/**
 * Created by rburson on 1/6/16.
 */
///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {Try, NavRequest} from './catavolt'

/*
    Base interface for catavolt component properties
 */
export interface CvProps {
    className?:string;
    style?: any,
    key?: string;
    clickAction?:string;
    doubleClickAction?:string;
}

/*
    Base interface for catavolt component state
 */
export interface CvState {
}

/*
    Base Mixin for all catavolt components
 */
export var CvBaseMixin = {

    contextTypes: {
        catavolt: React.PropTypes.object,
        eventRegistry: React.PropTypes.object,
        scopeObj: React.PropTypes.object
    },

    findFirstDescendant: function(elem, filter:(o)=>boolean) {
        var result = null;
        if(elem.props && elem.props.children) {
            var elems:Array<any> = React.Children.toArray(elem.props.children);
            for(let i = 0; i < elems.length; i++) {
                const child = elems[i];
                console.log(child);
                if(filter(child)) {
                    result = child;
                } else if (child.props.children) {
                    result = this.findFirstDescendant(child, filter);
                }
            }
        }
        return result ? result : null;
    },

    findAllDescendants: function(elem, filter:(o)=>boolean, results:Array<any>=[]):Array<any> {
        if(elem.props && elem.props.children) {
            var elems:Array<any> = React.Children.toArray(elem.props.children);
            for (let i = 0; i < elems.length; i++) {
                const child = elems[i];
                console.log(child);
                if (filter(child)) {
                    results.push(child);
                }
                if (child.props && child.props.children) {
                    this.findAllDescendants(child, filter, results);
                }
            }
        }
        return results;
    }

}

/*
 ******************************************************************
    Component Event Registry
    Framework for decoupled communication between our components
 ******************************************************************
 */
export interface CvListener<T> {
    (event:CvEvent<T>):void;
}

export interface CvEvent<T> {
    type:CvEventType;
    eventObj:T;
}


/* Event types */

export enum CvEventType {
    LOGIN,
    LOGOUT,
    NAVIGATION
}

/* Event type payloads */

export interface CvLoginResult {}

export interface CvLogoutResult {}

export interface CvNavigationResult {
    navRequestTry:Try<NavRequest>,
    workbenchId?:string;
    actionId?:string;
    navTarget?:string;
}

/* Event routing */

export class CvEventRegistry {

    private _listenerMap:{[index:number]:Array<CvListener<any>>} = [];

    constructor() {
    }

    publish<T>(event:CvEvent<T>):void {
        const listenerArray:Array<CvListener<any>> = this._listenerMap[event.type];
        if(listenerArray) {
            listenerArray.forEach((listener:CvListener<any>)=>{
                console.log('publishing ' + JSON.stringify(CvEventType[event.type]) + ' to ' + listener);
                listener(event);
            });
        }
    }

    subscribe<T>(listener:CvListener<T>, eventType:CvEventType):void {

            let listenerArray:Array<CvListener<any>> = this._listenerMap[eventType];
            if(!listenerArray){
                listenerArray = [];
                this._listenerMap[eventType] = listenerArray;
            }
            if(listenerArray.indexOf(listener) < 0) {
                listenerArray.push(listener);
            }
    }

    unsubscribe(listener:CvListener<any>):void {
        for(const eventType in this._listenerMap) {
            const listenerArray:Array<CvListener<any>> = this._listenerMap[eventType];
            if(listenerArray) {
                var index = listenerArray.indexOf(listener);
                if(index > -1) {
                    listenerArray.splice(index, 1);
                }
            }
        }
    }

}

