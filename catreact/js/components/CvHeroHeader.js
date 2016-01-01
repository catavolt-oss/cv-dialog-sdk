/**
 * Created by rburson on 12/23/15.
 */

var React = require('react');

var util = require('../catavolt/util');
var Log = util.Log;

/*
 ***************************************************
 * When you need to look fancy
 ***************************************************
 */
var CvHeroHeader = React.createClass({

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

module.exports = CvHeroHeader;
