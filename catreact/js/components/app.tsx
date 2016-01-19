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
                        <CvWorkbench workbenchId={"AAABACffAAAABpZL"} persistent={false}>
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <CvScope get={'name'}/>
                                    </h3>
                                </div>
                                <div className="panel-body">
                                    <CvLauncher actionId={"AAABACfaAAAABpIk"} navTarget={"1"}>
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
                        <CvNavigation targetId={"1"} persistent={false}>
                            <CvForm>
                                <div className="panel panel-primary">
                                    <div className="panel-heading">
                                        <CvScope get={'paneTitle'}/>
                                    </div>
                                    <div style={{maxHeight: '400px', overflow: 'auto'}}>
                                        <CvList paneRef={0} wrapperElem={"span"}>
                                            <CvRecord navTarget={"2"}>
                                                <div>
                                                    <CvProp propName={'name'}/>
                                                </div>
                                            </CvRecord>
                                        </CvList>
                                    </div>
                                </div>
                            </CvForm>
                        </CvNavigation>
                        <CvNavigation targetId={"2"}>
                            <CvForm>
                                <div className="panel panel-primary">
                                    <div className="panel-heading">
                                        <CvScope get={'paneTitle'}/>
                                    </div>
                                    <div style={{maxHeight: '400px', overflow: 'auto'}}>
                                        <CvList paneRef={0} wrapperElem={"span"}>
                                        </CvList>
                                    </div>
                                </div>
                            </CvForm>
                        </CvNavigation>
                    </span>
                </CvAppWindow>
            </div>
        </CatavoltPane>
    </div>,

    document.getElementById('cvApp')
)
