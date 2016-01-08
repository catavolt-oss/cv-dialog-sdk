/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvAppWindowState extends CvState {
    navRequestTry:Try<NavRequest>;
}

interface CvAppWindowProps extends CvProps {
    persistentWorkbench?:boolean;
    onLogout?:()=>void;
}

/*
 ***************************************************
 * A component analogous to Catavolt AppWinDef
 ***************************************************
 */
var CvAppWindow = React.createClass<CvAppWindowProps, CvAppWindowState>({

    mixins: [CvBaseMixin],

    getInitialState: function () {
        return {
            workbenches: [],
            navRequestTry: null
        }
    },

    render: function () {

        var workbenches:Array<Workbench> = this.context.catavolt.appWinDefTry.success.workbenches;

        return (
            <span>
                <CvToolbar/>
                <div className="container">
                    {(() => {
                        if (this.showWorkbench()) {
                            return workbenches.map((workbench:Workbench, index:number)=>{
                                    return <CvWorkbench workbench={workbench} onNavRequest={this.onNavRequest}/>
                                })
                        }
                    })()}
                    <CvNavigation navRequestTry={this.state.navRequestTry} onNavRequest={this.onNavRequest}/>
                </div>
            </span>
        );
    },

    showWorkbench: function () {
        return this.props.persistentWorkbench || !this.state.navRequestTry;
    },

    onNavRequest: function (navRequestTry) {
        if (navRequestTry.isFailure) {
            alert('Handle Navigation Failure!');
            Log.error(navRequestTry.failure);
        } else {
            this.setState({navRequestTry: navRequestTry});
        }
    }


});
