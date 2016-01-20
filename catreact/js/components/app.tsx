///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

Log.logLevel(LogLevel.DEBUG);

ReactDOM.render(

    <div className="container">
        <CatavoltPane>
            <div>
                <div className="header"></div>
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
                                            return <div className="col-sm-8 launch-div">
                                              <img className="launch-icon img-responsive center-block" src={launcher.iconBase}/>
                                              <h4 className="launch-text small text-center">{launcher.name}</h4>
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
                                        <h4><CvScope get={'paneTitle'}/></h4>
                                    </div>
                                    <div style={{maxHeight: '800px', overflow: 'auto'}}>
                                        <ul className={'list-group'}>
                                            <CvList paneRef={0} wrapperElem={"h4"}>
                                                <CvRecord clickAction={'default'} navTarget={"2"}>
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
                                        <h4>Messages</h4>
                                        <div className="messageToolbar text-right">
                                            <CvResource resourceName={'icon-action-join.png'}/>
                                            <a className="hlText">New Message</a>
                                        </div>
                                    </div>
                                    <div style={{maxHeight: '800px', overflow: 'auto'}}>
                                        <div className="messageCol">
                                            <CvList paneRef={0} wrapperElem={"span"}>
                                                <CvRecord>
                                                    <div className="row"><div className="col-sm-12">
                                                        <div className="messagePanel">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <div className="row">
                                                                        <div className="col-sm-2"><CvProp propName={'avatar_large'} className={'img-rounded avatar'}/></div>
                                                                        <div className="col-sm-4 text-center attrib-box">
                                                                            <h4><CvProp propName={'created-by'}/></h4>
                                                                            <small><CvProp propName={'group_name'}/></small>
                                                                            <small className="text-muted"><CvProp propName={'created-at'}/></small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <div className="pull-right">
                                                                        <CvProp propName={'is_flagged'} handler={(prop)=>{
                                                                            return prop.value ?
                                                                                <CvResource resourceName={'icon-bookmark.png'} style={{width:24, height:38}}/> :
                                                                                <CvResource resourceName={'icon-bookmark-unchecked.png'} style={{width:24, height:38}}/>
                                                                        }}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="like-row">
                                                                 <span><CvProp propName={'likes_count'}/></span><span>liked</span>
                                                                <span></span><span></span>
                                                                 <span><CvProp propName={'comments_count'}/></span><span>comments</span>
                                                            </div>
                                                            <div>
                                                                <div> <CvProp propName={'title'}/> </div>
                                                                <blockquote><p><CvProp propName={'body_preview'}/></p></blockquote>
                                                                <div className="text-center">{
                                                                    function() {
                                                                        const attachments = [];
                                                                        for(let i = 1; i<=10; i++) {
                                                                            attachments.push(<CvProp propName={'attachment_preview_' + i} key={'' + i}/>)
                                                                        }
                                                                        return attachments;
                                                                    }()}
                                                                </div>
                                                            </div>
                                                            <div className="badge-row">
                                                                <div className="text-right"><CvResource resourceName={'icon-action-comment.png'} style={{width:24, height:24}}/></div>
                                                            </div>
                                                        </div>
                                                    </div></div>
                                                </CvRecord>
                                            </CvList>
                                        </div>
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
