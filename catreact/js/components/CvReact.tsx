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
    },

    findFirstDescendant: function(comp, filter:(o)=>boolean) {
        var result = null;
        if(comp.props && comp.props.children) {
            var comps:Array<any> = React.Children.toArray(comp.props.children);
            for(let i = 0; i < comps.length; i++) {
                const child = comps[i];
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

    findAllDescendants: function(comp, filter:(o)=>boolean, results:Array<any>=[]):Array<any> {
        if(comp.props && comp.props.children) {
            var comps:Array<any> = React.Children.toArray(comp.props.children);
            for (let i = 0; i < comps.length; i++) {
                const child = comps[i];
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