/**
 * Created by rburson on 12/23/15.
 */
var React = require('react');
var CvMenu = require('./CvMenu');

var util = require('../catavolt/util');
var Log = util.Log;
var QueryMarkerOption = require('../catavolt/dialog').QueryMarkerOption;
/*
 ***************************************************
 * Render a ListContext
 ***************************************************
 */
var CvList = React.createClass({

    getInitialState() {
        return {entityRecs: []}
    },

    componentWillMount: function() {

        const listContext = this.props.listContext;
        listContext.setScroller(50, null, [QueryMarkerOption.None]);
        listContext.scroller.refresh().onComplete(entityRecTry=>{
            if(entityRecTry.isFailure) {
                Log.error("ListContext failed to render with " + ObjUtil.formatRecAttr(entityRecTry.failure));
            } else {
                Log.info(JSON.stringify(listContext.scroller.buffer));
                this.setState({entityRecs: ArrayUtil.copy(listContext.scroller.buffer)});
            }
        });


    },

    itemDoubleClicked: function(objectId) {
        const listContext = this.props.listContext;
        if(listContext.listDef.defaultActionId) {
            var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW',
                listContext.listDef.defaultActionId, null, null, []);
            listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(navRequestTry=>{
                this.props.onNavRequest(navRequestTry);
            });
        }
    },

    render: function(){

        const listContext = this.props.listContext;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <span>{listContext.paneTitle || '>'}</span>
                    <div className="pull-right">
                        {listContext.menuDefs.map((menuDef, index) => { return <CvMenu key={index} menuDef={menuDef}/> })}
                    </div>
                </div>
                <div style={{maxHeight: '400px', overflow: 'auto'}}>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th key="nbsp">&nbsp;</th>
                            {listContext.columnHeadings.map((heading, index) => { return <th key={index}>{heading}</th> })}
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.entityRecs.map((entityRec, index) => {
                            return (
                                <tr key={index} onDoubleClick={this.itemDoubleClicked.bind(this, entityRec.objectId)}>
                                    <td className="text-center" key="checkbox"><input type="checkbox"/> </td>
                                    {listContext.rowValues(entityRec).map((val,index)=>{ return <td key={index}>{val ? val.toString() : ' '}</td> })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
});

module.exports = CvList;
