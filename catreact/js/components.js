var React = require('react');
var ReactDOM = require('react-dom');

var CatavoltPane = require('./components/CatavoltPane');



ReactDOM.render(
    <CatavoltPane persistentWorkbench={false}/>,
        document.getElementById('cvApp')
)
