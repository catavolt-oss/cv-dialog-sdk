/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react.d.ts"/>
import * as React from 'react';
import { CvBaseMixin } from './catreact';
/*
 ***************************************************
 * When you need to look fancy
 ***************************************************
 */
export var CvHeroHeader = React.createClass({
    mixins: [CvBaseMixin],
    render: function () {
        return (React.createElement("div", {"className": "jumbotron logintron"}, React.createElement("div", {"className": "container-fluid"}, React.createElement("div", {"className": "center-block"}, React.createElement("img", {"className": "img-responsive center-block", "src": "img/Catavolt-Logo-retina.png", "style": { verticalAlign: 'middle' }})))));
    }
});
