var React = require('react');
var ReactDOM = require('react-dom');

var CatavoltPane = require('./CatavoltPane');

ReactDOM.render(
    <CatavoltPane persistentWorkbench={true}/>,
    document.getElementById('cvApp')
)
