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
                                <div className="panel-body row">
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
                                    <div style={{maxHeight: '800px', overflow: 'auto'}}>
                                        <ul className={'list-group'}>
                                            <CvList paneRef={0} wrapperElem={"a"}>
                                                <CvRecord navTarget={"2"}>
                                                    <li className={'list-group-item'}>
                                                        <CvProp propName={'name'}/>
                                                    </li>
                                                </CvRecord>
                                            </CvList>
                                        </ul>
                                    </div>
                                </div>
                            </CvForm>
                        </CvNavigation>
                        <CvNavigation targetId={"2"}>
                            <CvForm>
                                <div className="panel panel-primary">
                                    <div className="panel-heading">
                                        <CvScope get={'paneTitle'}/>
                                        <CvResource resourceName={'icon-action-join.png'}/>
                                    </div>
                                    <div style={{maxHeight: '800px', overflow: 'auto'}}>
                                        <CvList paneRef={0} wrapperElem={"span"}>
                                            <CvRecord>
                                                <div>
                                                    <CvProp propName={'avatar_large'} className={'img-rounded'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'created-by'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'group_name'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'created-at'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'likes_count'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'comments_count'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'title'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'body_preview'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'attachment_preview_1'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'attachment_preview_2'}/>
                                                </div>
                                                <div>
                                                    <CvProp propName={'attachment_preview_3'}/>
                                                </div>
                                            </CvRecord>
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
