/**
 * Created by rburson on 1/6/16.
 */
///<reference path="../../typings/react/react.d.ts"/>
import * as React from 'react';
/*
    Base Mixin for all catavolt components
 */
export var CvBaseMixin = {
    contextTypes: {
        catavolt: React.PropTypes.object,
        eventRegistry: React.PropTypes.object,
        scopeObj: React.PropTypes.object
    },
    findFirstDescendant: function (elem, filter) {
        var result = null;
        if (elem.props && elem.props.children) {
            var elems = React.Children.toArray(elem.props.children);
            for (let i = 0; i < elems.length; i++) {
                const child = elems[i];
                console.log(child);
                if (filter(child)) {
                    result = child;
                }
                else if (child.props.children) {
                    result = this.findFirstDescendant(child, filter);
                }
            }
        }
        return result ? result : null;
    },
    findAllDescendants: function (elem, filter, results = []) {
        if (elem.props && elem.props.children) {
            var elems = React.Children.toArray(elem.props.children);
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
};
/* Event types */
export var CvEventType;
(function (CvEventType) {
    CvEventType[CvEventType["LOGIN"] = 0] = "LOGIN";
    CvEventType[CvEventType["LOGOUT"] = 1] = "LOGOUT";
    CvEventType[CvEventType["NAVIGATION"] = 2] = "NAVIGATION";
})(CvEventType || (CvEventType = {}));
/* Event routing */
export class CvEventRegistry {
    constructor() {
        this._listenerMap = [];
    }
    publish(event) {
        const listenerArray = this._listenerMap[event.type];
        if (listenerArray) {
            listenerArray.forEach((listener) => {
                console.log('publishing ' + JSON.stringify(CvEventType[event.type]) + ' to ' + listener);
                listener(event);
            });
        }
    }
    subscribe(listener, eventType) {
        let listenerArray = this._listenerMap[eventType];
        if (!listenerArray) {
            listenerArray = [];
            this._listenerMap[eventType] = listenerArray;
        }
        if (listenerArray.indexOf(listener) < 0) {
            listenerArray.push(listener);
        }
    }
    unsubscribe(listener) {
        for (const eventType in this._listenerMap) {
            const listenerArray = this._listenerMap[eventType];
            if (listenerArray) {
                var index = listenerArray.indexOf(listener);
                if (index > -1) {
                    listenerArray.splice(index, 1);
                }
            }
        }
    }
}
