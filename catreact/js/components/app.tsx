///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

Log.logLevel(LogLevel.DEBUG);

ReactDOM.render(

    <CatavoltPane>

        <div>
            <CvLoginPane/>
            <CvAppWindow persistentWorkbench={true}>
                <span>
                    <CvToolbar/>
                    <div className="container">
                        <CvWorkbench workbenchId={"AAABACffAAAABpZL"}>
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                        <CvScope handler={(workbench)=>{
                                            return <h3 className="panel-title">{workbench.name}</h3>
                                         }}/>
                                </div>
                                <div className="panel-body">
                                   <CvLauncher actionId={"AAABACfaAAAABpIk"}>
                                       <CvScope handler={(launcher)=>{
                                            return <div className="col-md-4 launch-div">
                                              <img className="launch-icon img-responsive center-block" src={launcher.iconBase}/>
                                              <h5 className="launch-text small text-center">{launcher.name}</h5>
                                            </div>
                                         }}/>
                                   </CvLauncher>
                                </div>
                            </div>
                        </CvWorkbench>
                    </div>
                </span>
            </CvAppWindow>
        </div>

    </CatavoltPane>,

    document.getElementById('cvApp')

)
