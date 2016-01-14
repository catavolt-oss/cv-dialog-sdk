///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

Log.logLevel(LogLevel.DEBUG);

ReactDOM.render(

    <div className="container">
        <CatavoltPane>
            <div>
                <CvLoginPane/>
                <CvAppWindow>
                    <span>
                        <CvToolbar/>
                        <CvWorkbench workbenchId={"AAABACffAAAABpZL"} persistent={false}>
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                    <CvScope get={'name'}/>
                                    </h3>
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
                        <CvNavigation>
                            <CvForm>
                                <CvList paneRef={0}>
                                    <CvRecord>
                                        <div>
                                            <CvProp propName={'name'}/>
                                        </div>
                                    </CvRecord>
                                </CvList>
                            </CvForm>
                        </CvNavigation>
                    </span>
                </CvAppWindow>
            </div>
        </CatavoltPane>
    </div>,

document.getElementById('cvApp')

)
