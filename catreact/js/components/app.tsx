///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

Log.logLevel(LogLevel.DEBUG);

ReactDOM.render(

    <CatavoltPane>

        <div>
            <CvLoginPane/>
        </div>

        <CvAppWindow persistentWorkbench={true}/>

    </CatavoltPane>,

    document.getElementById('cvApp')

)
