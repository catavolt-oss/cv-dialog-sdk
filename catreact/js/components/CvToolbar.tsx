/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin} from './catreact'

export interface CvToolbarState extends CvState {
}

export interface CvToolbarProps extends CvProps {
}

/*
 ***************************************************
 * Render a top-level application toolbar
 ***************************************************
 */
export var CvToolbar = React.createClass<CvToolbarProps, CvToolbarState>({
    mixins: [CvBaseMixin],
    render: function () {
        return (
            <nav className="navbar navbar-default navbar-static-top component-chrome">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle Navigation</span>
                            <span className="icon-bar"> </span>
                            <span className="icon-bar"> </span>
                            <span className="icon-bar"> </span>
                        </button>
                        <a className="navbar-brand" href="#">Catavolt</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li className="dropdown">
                                <a href="" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-expanded="true">Workbenches<span className="caret"> </span></a>
                                <ul className="dropdown-menu" role="menu">
                                    <li><a href="#">Default</a></li>
                                </ul>
                            </li>
                            <li><a href="#">Settings</a></li>
                        </ul>
                        <form className="navbar-form navbar-right">
                            <input type="text" className="form-control" placeholder="Search For Help On..."/>
                        </form>
                    </div>
                </div>
            </nav>
        );
    }
});
