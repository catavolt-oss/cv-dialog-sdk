/**
 * Created by rburson on 12/23/15.
 */
import * as React from 'react';
import { CvBaseMixin, CvMenu } from './catreat';
import { Future, Log, ObjUtil, LabelCellValueDef, ForcedLineCellValueDef, AttributeCellValueDef } from './catavolt';
/*
 ***************************************************
 * Render a DetailsContext
 ***************************************************
 */
export var CvDetails = React.createClass({
    mixins: [CvBaseMixin],
    getInitialState() {
        return { renderedDetailRows: [] };
    },
    componentWillMount: function () {
        this.props.detailsContext.read().onComplete((entityRecTry) => {
            this.layoutDetailsPane(this.props.detailsContext);
        });
    },
    render: function () {
        const detailsContext = this.props.detailsContext;
        return (React.createElement("div", {"className": "panel panel-primary"}, React.createElement("div", {"className": "panel-heading"}, React.createElement("span", null, detailsContext.paneTitle || '>'), React.createElement("div", {"className": "pull-right"}, detailsContext.menuDefs.map((menuDef, index) => {
            return React.createElement(CvMenu, {"key": index, "actionId": menuDef.actionId});
        }))), React.createElement("div", {"style": { maxHeight: '400px', overflow: 'auto' }}, React.createElement("table", {"className": "table table-striped"}, React.createElement("tbody", null, this.state.renderedDetailRows)))));
    },
    layoutDetailsPane: function (detailsContext) {
        let allDefsComplete = Future.createSuccessfulFuture('layoutDetailsPaneStart', {});
        const renderedDetailRows = [];
        detailsContext.detailsDef.rows.forEach((cellDefRow, index) => {
            if (this.isValidDetailsDefRow(cellDefRow)) {
                if (this.isSectionTitleDef(cellDefRow)) {
                    allDefsComplete = allDefsComplete.map((lastRowResult) => {
                        var titleRow = this.createTitleRow(cellDefRow, index);
                        renderedDetailRows.push(titleRow);
                        return titleRow;
                    });
                }
                else {
                    allDefsComplete = allDefsComplete.bind((lastRowResult) => {
                        return this.createEditorRow(cellDefRow, detailsContext, index).map((editorRow) => {
                            renderedDetailRows.push(editorRow);
                            return editorRow;
                        });
                    });
                }
            }
            else {
                Log.error('Detail row is invalid ' + ObjUtil.formatRecAttr(cellDefRow));
            }
        });
        allDefsComplete.onComplete((lastRowResultTry) => {
            this.setState({ renderedDetailRows: renderedDetailRows });
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
        return React.createElement("tr", {"key": index}, React.createElement("td", null, React.createElement("span", null, React.createElement("strong", null, row[0].values[0].value))), React.createElement("td", null, React.createElement("span", null, React.createElement("strong", null, row[1].values[0].value))));
    },
    /* Returns a Future */
    createEditorRow: function (row, detailsContext, index) {
        let labelDef = row[0].values[0];
        let label;
        if (labelDef instanceof LabelCellValueDef) {
            label = React.createElement("span", null, labelDef.value);
        }
        else {
            label = React.createElement("span", null, "N/A");
        }
        var valueDef = row[1].values[0];
        if (valueDef instanceof AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
            return this.createEditorControl(valueDef, detailsContext).map((editorCellString) => {
                return React.createElement("tr", {"key": index}, [React.createElement("td", null, label), React.createElement("td", null, editorCellString)]);
            });
        }
        else if (valueDef instanceof AttributeCellValueDef) {
            let value = React.createElement("span", null);
            var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
            if (prop && detailsContext.isBinary(valueDef)) {
                value = React.createElement("span", null);
            }
            else if (prop) {
                value = React.createElement("span", null, detailsContext.formatForRead(prop.value, prop.name));
            }
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", {"key": index}, [React.createElement("td", null, label),
                React.createElement("td", null, value)]));
        }
        else if (valueDef instanceof LabelCellValueDef) {
            const value = React.createElement("span", null, valueDef.value);
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", {"key": index}, [React.createElement("td", null, label),
                React.createElement("td", null, value)]));
        }
        else {
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", {"key": index}, [React.createElement("td", null, label),
                React.createElement("td", null)]));
        }
    },
    /* Returns a Future */
    createEditorControl: function (attributeDef, detailsContext) {
        if (attributeDef.isComboBoxEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map((values) => {
                return React.createElement("span", null);
                //return '<ComboBox>' + values.join(", ") + '</ComboBox>';
            });
        }
        else if (attributeDef.isDropDownEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map((values) => {
                return React.createElement("span", null);
                //return '<DropDown>' + values.join(", ") + '</DropDown>';
            });
        }
        else {
            var entityRec = detailsContext.buffer;
            var prop = entityRec.propAtName(attributeDef.propertyName);
            if (prop && detailsContext.isBinary(attributeDef)) {
                return Future.createSuccessfulFuture('createEditorControl', React.createElement("span", null));
            }
            else {
                var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
                return Future.createSuccessfulFuture('createEditorControl', React.createElement("span", null, value));
            }
        }
    }
});
