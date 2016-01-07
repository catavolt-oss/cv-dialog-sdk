/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * When you need to look fancy
 ***************************************************
 */
var CvHeroHeader = React.createClass({
    render: function () {
        return (React.createElement("div", {"className": "jumbotron logintron"}, React.createElement("div", {"className": "container-fluid"}, React.createElement("div", {"className": "center-block"}, React.createElement("img", {"className": "img-responsive center-block", "src": "img/Catavolt-Logo-retina.png", "style": { verticalAlign: 'middle' }})))));
    }
});
