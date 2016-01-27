/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin} from './catreat'
import {} from './catavolt'

export interface CvHeroHeaderState extends CvState {
}

export interface CvHeroHeaderProps extends CvProps {
}

/*
 ***************************************************
 * When you need to look fancy
 ***************************************************
 */
export var CvHeroHeader = React.createClass<CvHeroHeaderProps, CvHeroHeaderState>({

    mixins: [CvBaseMixin],

    render: function() {
        return (
            <div className="jumbotron logintron">
                <div className="container-fluid">
                    <div className="center-block">
                        <img className="img-responsive center-block" src="img/Catavolt-Logo-retina.png" style={{verticalAlign: 'middle'}}/>
                    </div>
                </div>
            </div>
        );
    }
});
