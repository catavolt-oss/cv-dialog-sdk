///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
Log.logLevel(LogLevel.DEBUG);
ReactDOM.render(React.createElement(CatavoltPane, {"persistentWorkbench": true}, React.createElement("div", null)), document.getElementById('cvApp'));
