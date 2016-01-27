/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {
    CvState,
    CvProps,
    CvBaseMixin,
    CvEvent,
    CvEventRegistry,
    CvEventType,
    CvToolbar,
    CvWorkbench,
    CvNavigation,
    CvLoginResult,
    CvWorkbenchProps
} from './catreat'
import {Workbench} from './catavolt'

export interface CvAppWindowState extends CvState {
    loggedIn: boolean;
}

export interface CvAppWindowProps extends CvProps {
    persistentWorkbench?:boolean;
    onLogout?:()=>void;
}

/*
 ***************************************************
 * A component analogous to Catavolt AppWinDef
 ***************************************************
 */
export var CvAppWindow = React.createClass<CvAppWindowProps, CvAppWindowState>({

    mixins: [CvBaseMixin],

    componentDidMount: function () {
        (this.context.eventRegistry as CvEventRegistry).subscribe<CvLoginResult>((loginEvent:CvEvent<CvLoginResult>)=> {
            this.setState({loggedIn: true})
        }, CvEventType.LOGIN);
    },

    getInitialState: function () {
        return {
            loggedIn: false
        }
    },

    render: function () {

        if (this.state.loggedIn) {

            if (React.Children.count(this.props.children) > 0) {

                return this.props.children

            } else {

                var workbenches:Array<Workbench> = this.context.catavolt.appWinDefTry.success.workbenches;
                return (
                    <span>
                        <CvToolbar/>
                        <div className="container">
                            {(() => {
                                if (this.showWorkbench()) {
                                    return workbenches.map((workbench:Workbench, index)=>{
                                        return <CvWorkbench workbenchId={workbench.workbenchId} key={index}/>
                                        })
                                    }
                                })()}
                            <CvNavigation/>
                        </div>
                    </span>
                );
            }
        } else {
            return null;
        }
    },

    showWorkbench: function () {
        return this.props.persistentWorkbench || !this.state.navRequestTry;
    },

});
