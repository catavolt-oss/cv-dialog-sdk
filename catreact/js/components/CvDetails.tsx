/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin, CvMenu} from './catreat'
import {
    EntityRec,
    DetailsContext,
    Try,
    NavRequest,
    Future,
    Log,
    ObjUtil,
    LabelCellValueDef,
    ForcedLineCellValueDef,
    AttributeCellValueDef,
    VoidResult
} from './catavolt'

export interface CvDetailsState extends CvState {
    renderedDetailRows:Array<any>;
}

export interface CvDetailsProps extends CvProps {
    detailsContext:DetailsContext;
    onNavRequest:(navRequestTry:Try<NavRequest>)=>void;
}

/*
 ***************************************************
 * Render a DetailsContext
 ***************************************************
 */
export var CvDetails = React.createClass<CvDetailsProps, CvDetailsState>({

    mixins: [CvBaseMixin],

    getInitialState() {
        return {renderedDetailRows: []}
    },

    componentWillMount: function () {
        this.props.detailsContext.read().onComplete((entityRecTry:Try<EntityRec>)=> {
            this.layoutDetailsPane(this.props.detailsContext);
        });
    },

    render: function () {
        const detailsContext = this.props.detailsContext;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <span>{detailsContext.paneTitle || '>'}</span>
                    <div className="pull-right">
                        {detailsContext.menuDefs.map((menuDef, index) => { return <CvMenu key={index}
                                                                                          actionId={menuDef.actionId}/> })}
                    </div>
                </div>
                <div style={{maxHeight: '400px', overflow: 'auto'}}>
                    <table className="table table-striped">
                        <tbody>{this.state.renderedDetailRows}</tbody>
                    </table>
                </div>
            </div>
        )
    },

    layoutDetailsPane: function (detailsContext) {

        let allDefsComplete = Future.createSuccessfulFuture<VoidResult>('layoutDetailsPaneStart', {});
        const renderedDetailRows = [];
        detailsContext.detailsDef.rows.forEach((cellDefRow, index)=> {
            if (this.isValidDetailsDefRow(cellDefRow)) {
                if (this.isSectionTitleDef(cellDefRow)) {
                    allDefsComplete = allDefsComplete.map((lastRowResult)=> {
                        var titleRow = this.createTitleRow(cellDefRow, index);
                        renderedDetailRows.push(titleRow);
                        return titleRow;
                    });
                } else {
                    allDefsComplete = allDefsComplete.bind((lastRowResult)=> {
                        return this.createEditorRow(cellDefRow, detailsContext, index).map((editorRow)=> {
                            renderedDetailRows.push(editorRow);
                            return editorRow;
                        });
                    });
                }
            } else {
                Log.error('Detail row is invalid ' + ObjUtil.formatRecAttr(cellDefRow));
            }
        });

        allDefsComplete.onComplete((lastRowResultTry)=> {
            this.setState({renderedDetailRows: renderedDetailRows});
        });
    },

    isValidDetailsDefRow: function (row) {
        return row.length === 2 &&
            row[0].values.length === 1 &&
            row[1].values.length === 1 &&
            (row[0].values[0] instanceof LabelCellValueDef ||
            row[1].values[0] instanceof ForcedLineCellValueDef) &&
            (row[1].values[0] instanceof AttributeCellValueDef ||
            row[1].values[0] instanceof LabelCellValueDef ||
            row[1].values[0] instanceof ForcedLineCellValueDef);
    },

    isSectionTitleDef: function (row) {
        return row[0].values[0] instanceof LabelCellValueDef &&
            row[1].values[0] instanceof LabelCellValueDef;
    },

    createTitleRow: function (row, index) {
        Log.info('row: ' + JSON.stringify(row));
        return <tr key={index}>
            <td>
                <span>
                    <strong>{row[0].values[0].value}</strong>
                </span>
            </td>
            <td>
                <span>
                    <strong>{row[1].values[0].value}</strong>
                </span>
            </td>
        </tr>;
    },

    /* Returns a Future */
    createEditorRow: function (row, detailsContext, index) {

        let labelDef = row[0].values[0];
        let label;
        if (labelDef instanceof LabelCellValueDef) {
            label = <span>{labelDef.value}</span>
        } else {
            label = <span>N/A</span>
        }

        var valueDef = row[1].values[0];
        if (valueDef instanceof AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
            return this.createEditorControl(valueDef, detailsContext).map((editorCellString)=> {
                return <tr key={index}>{[<td>{label}</td>, <td>{editorCellString}</td>]}</tr>
            });
        } else if (valueDef instanceof AttributeCellValueDef) {
            let value = <span></span>;
            var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
            if (prop && detailsContext.isBinary(valueDef)) {
                value = <span></span>;
            } else if (prop) {
                value = <span>{detailsContext.formatForRead(prop.value, prop.name)}</span>
            }
            return Future.createSuccessfulFuture('createEditorRow', <tr key={index}>{[<td>{label}</td>,
            <td>{value}</td>]}</tr>);
        } else if (valueDef instanceof LabelCellValueDef) {
            const value = <span>{valueDef.value}</span>
            return Future.createSuccessfulFuture('createEditorRow', <tr key={index}>{[<td>{label}</td>,
            <td>{value}</td>]}</tr>);
        } else {
            return Future.createSuccessfulFuture('createEditorRow', <tr key={index}>{[<td>{label}</td>,
            <td></td>]}</tr>);
        }

    },

    /* Returns a Future */
    createEditorControl: function (attributeDef:AttributeCellValueDef, detailsContext:DetailsContext) {
        if (attributeDef.isComboBoxEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map((values)=> {
                return <span></span>
                //return '<ComboBox>' + values.join(", ") + '</ComboBox>';
            });
        } else if (attributeDef.isDropDownEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map((values)=> {
                return <span></span>
                //return '<DropDown>' + values.join(", ") + '</DropDown>';
            });
        } else {
            var entityRec = detailsContext.buffer;
            var prop = entityRec.propAtName(attributeDef.propertyName);
            if (prop && detailsContext.isBinary(attributeDef)) {
                return Future.createSuccessfulFuture('createEditorControl', <span></span>);
                //return Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
            } else {
                var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
                return Future.createSuccessfulFuture('createEditorControl', <span>{value}</span>);
            }
        }
    }
});
