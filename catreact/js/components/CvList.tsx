/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvListState extends CvState {
    listContext:ListContext;
    entityRecs:Array<EntityRec>;
}

interface CvListProps extends CvProps {
    paneId:string;
}
/*
 ***************************************************
 * Render a ListContext
 ***************************************************
 */
import QueryMarkerOption = catavolt.dialog.QueryMarkerOption;

var CvList = React.createClass<CvListProps, CvListState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {

        const formContext:FormContext = this.context.scopeObj;
        let listContext = null;
        formContext.childrenContexts.some((childContext)=> {
            if (childContext instanceof ListContext &&
                childContext.paneDef.paneId == this.props.paneId) {
                listContext = childContext;
                return true;
            } else {
                return false;
            }
        });
        this.setState({listContext: listContext});

        listContext.setScroller(50, null, [QueryMarkerOption.None]);
        listContext.scroller.refresh().onComplete(entityRecTry=> {
            if (entityRecTry.isFailure) {
                Log.error("ListContext failed to render with " + ObjUtil.formatRecAttr(entityRecTry.failure));
            } else {
                Log.info(JSON.stringify(listContext.scroller.buffer));
                this.setState({entityRecs: ArrayUtil.copy(listContext.scroller.buffer)});
            }
        });

    },

    getChildContext: function () {
        return {scopeObj: this.state.listContext}
    },

    getInitialState() {
        return {listContext: null, entityRecs: []}
    },

    itemDoubleClicked: function (objectId) {
        const listContext = this.state.listContext;
        if (listContext.listDef.defaultActionId) {
            var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW',
                listContext.listDef.defaultActionId, null, null, []);
            listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(navRequestTry=> {
            });
        }
    },

    render: function () {

        const listContext = this.state.listContext;
        if (listContext) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {
                return (
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <span>{listContext.paneTitle || '>'}</span>
                            <div className="pull-right">
                                {listContext.menuDefs.map((menuDef, index) => { return <CvMenu key={index}
                                                                                               actionId={menuDef.actionId}/> })}
                            </div>
                        </div>
                        <div style={{maxHeight: '400px', overflow: 'auto'}}>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th key="nbsp">&nbsp;</th>
                                        {listContext.columnHeadings.map((heading, index) => { return <th
                                            key={index}>{heading}</th> })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.entityRecs.map((entityRec, index) => {
                                        return (
                                        <tr key={index}
                                            onDoubleClick={this.itemDoubleClicked.bind(this, entityRec.objectId)}>
                                            <td className="text-center" key="checkbox">
                                                <input type="checkbox"/>
                                            </td>
                                            {listContext.rowValues(entityRec).map((val,index)=>{ return <td
                                                key={index}>{val ? val.toString() : ' '}</td> })}
                                        </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        } else {
            return null;
        }
    }
});
