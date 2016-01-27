/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin, CvEventRegistry, CvEventType, CvNavigationResult, CvRecord, CvMenu} from './catreat'
import {FormContext, ListContext, QueryMarkerOption, ObjUtil, Log, ArrayUtil, MenuDef, EntityRec} from './catavolt'

export interface CvListState extends CvState {
    listContext:ListContext;
}

export interface CvListProps extends CvProps {
    paneRef:number;
    wrapperElem?:string;
}

/**
   @TODO This class needs to allow for CvRecord at any depth with children.  Also better handling of 'wrapper' requirement

 */
/*
 ***************************************************
 * Render a ListContext
 ***************************************************
 */
export var CvList = React.createClass<CvListProps, CvListState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {

        const formContext:FormContext = this.context.scopeObj;
        let listContext = null;
        formContext.childrenContexts.some((childContext)=> {
            if (childContext instanceof ListContext &&
                childContext.paneRef == this.props.paneRef) {
                listContext = childContext;
                return true;
            } else {
                return false;
            }
        });
        this.setState({listContext: listContext});

        listContext.setScroller(50, null, [QueryMarkerOption.None]);
        listContext.scroller.refresh().onComplete(entityRecTry=> {
            if (entityRecTry.isFailure) {
                Log.error("ListContext failed to render with " + ObjUtil.formatRecAttr(entityRecTry.failure));
            } else {
                Log.info(JSON.stringify(listContext.scroller.buffer));
                this.setState({listContext:listContext});
            }
        });

    },

    getChildContext: function () {
        return {scopeObj: this.state.listContext}
    },

    getInitialState() {
        return {listContext: null}
    },

    itemClicked: function (objectId) {
        const listContext = this.state.listContext;
        if (listContext.listDef.defaultActionId) {
            var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW',
                listContext.listDef.defaultActionId, null, null, []);
            listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(navRequestTry=> {
                (this.context.eventRegistry as CvEventRegistry)
                    .publish<CvNavigationResult>({type:CvEventType.NAVIGATION, eventObj:{navRequestTry:navRequestTry,
                        actionId:listContext.listDef.defaultActionId}});
            });
        }
    },

    render: function () {

        const listContext = this.state.listContext;
        if (listContext) {
            const entityRecs:Array<EntityRec> = ArrayUtil.copy<EntityRec>(listContext.scroller.buffer);
            if (React.Children.count(this.props.children) > 0) {
                let newChildren = [];
                React.Children.toArray(this.props.children).forEach((childElem:any)=>{
                    if(childElem.type == CvRecord) {
                        entityRecs.map((entityRec:EntityRec, index) => {
                            newChildren.push(React.cloneElement(childElem, {entityRec: entityRec, key: index}))
                        })
                    } else {
                        newChildren.push(childElem);
                    }
                });
                if(this.props.wrapperElem) {
                    return React.createElement(this.props.wrapperElem, {}, newChildren);
                } else {
                    return <span>{newChildren}</span>
                }
            } else {
                return (
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <span>{listContext.paneTitle || '>'}</span>
                            <div className="pull-right">
                                {listContext.menuDefs.map((menuDef, index) => { return <CvMenu key={index}
                                                                                               actionId={menuDef.actionId}/> })}
                            </div>
                        </div>
                        <div style={{maxHeight: '400px', overflow: 'auto'}}>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th key="nbsp">&nbsp;</th>
                                        {listContext.columnHeadings.map((heading, index) => { return <th
                                            key={index}>{heading}</th> })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {entityRecs.map((entityRec, index) => {
                                        return (
                                        <tr key={index}
                                            onClick={this.itemClicked.bind(this, entityRec.objectId)}>
                                            <td className="text-center" key="checkbox">
                                                <input type="checkbox"/>
                                            </td>
                                            {listContext.rowValues(entityRec).map((val,index)=>{ return <td
                                                key={index}>{val ? val.toString() : ' '}</td> })}
                                        </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        } else {
            return null;
        }
    }
});
