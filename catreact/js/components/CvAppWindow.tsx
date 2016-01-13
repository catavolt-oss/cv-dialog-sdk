/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvAppWindowState extends CvState {
    loggedIn: boolean;
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

    componentDidMount: function () {
        (this.context.eventRegistry as CvEventRegistry).subscribe<CvLoginResult>((loginEvent:CvEvent<CvLoginResult>)=> {
            this.setState({loggedIn: true})
        }, CvEventType.LOGIN);
    },

    getInitialState: function () {
        return {
            loggedIn: false
        }
    },

    render: function () {

        if (this.state.loggedIn) {

            if (React.Children.count(this.props.children) > 0) {

                return this.props.children

            } else {

                var workbenches:Array<Workbench> = this.context.catavolt.appWinDefTry.success.workbenches;
                return (
                    <span>
                        <CvToolbar/>
                        <div className="container">
                            {(() => {
                                if (this.showWorkbench()) {
                                    return workbenches.map((workbench:Workbench, index)=>{
                                        return <CvWorkbench workbenchId={workbench.workbenchId} key={index}/>
                                        })
                                    }
                                })()}
                            <CvNavigation/>
                        </div>
                    </span>
                );
            }
        } else {
            return null;
        }
    },

    showWorkbench: function () {
        return this.props.persistentWorkbench || !this.state.navRequestTry;
    },

});
