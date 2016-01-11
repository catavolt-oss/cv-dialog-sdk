///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

Log.logLevel(LogLevel.DEBUG);

ReactDOM.render(

    <CatavoltPane>

        <div>

            <CvLoginPane/>

            <CvAppWindow persistentWorkbench={true}>

                <div className="container">
                    <CvWorkbench workbenchId={"AAABACffAAAABpZL"}>
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h3 className="panel-title"><CvScope handler={(workbench)=>{return workbench.name}}/></h3>
                            </div>
                            <div className="panel-body">launchComps</div>
                        </div>
                    </CvWorkbench>
                </div>

            </CvAppWindow>

        </div>

    </CatavoltPane>,

    document.getElementById('cvApp')

)
