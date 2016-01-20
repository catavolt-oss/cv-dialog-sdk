(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 1/6/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
    Base Mixin for all catavolt components
 */
var CvBaseMixin = {
    contextTypes: {
        catavolt: React.PropTypes.object,
        eventRegistry: React.PropTypes.object,
        scopeObj: React.PropTypes.object
    },
    findFirstDescendant: function findFirstDescendant(elem, filter) {
        var result = null;
        if (elem.props && elem.props.children) {
            var elems = React.Children.toArray(elem.props.children);
            for (var i = 0; i < elems.length; i++) {
                var child = elems[i];
                console.log(child);
                if (filter(child)) {
                    result = child;
                } else if (child.props.children) {
                    result = this.findFirstDescendant(child, filter);
                }
            }
        }
        return result ? result : null;
    },
    findAllDescendants: function findAllDescendants(elem, filter, results) {
        if (results === void 0) {
            results = [];
        }
        if (elem.props && elem.props.children) {
            var elems = React.Children.toArray(elem.props.children);
            for (var i = 0; i < elems.length; i++) {
                var child = elems[i];
                console.log(child);
                if (filter(child)) {
                    results.push(child);
                }
                if (child.props && child.props.children) {
                    this.findAllDescendants(child, filter, results);
                }
            }
        }
        return results;
    }
};
/* Event types */
var CvEventType;
(function (CvEventType) {
    CvEventType[CvEventType["LOGIN"] = 0] = "LOGIN";
    CvEventType[CvEventType["LOGOUT"] = 1] = "LOGOUT";
    CvEventType[CvEventType["NAVIGATION"] = 2] = "NAVIGATION";
})(CvEventType || (CvEventType = {}));
/* Event routing */
var CvEventRegistry = (function () {
    function CvEventRegistry() {
        this._listenerMap = [];
    }
    CvEventRegistry.prototype.publish = function (event) {
        var listenerArray = this._listenerMap[event.type];
        if (listenerArray) {
            listenerArray.forEach(function (listener) {
                console.log('publishing ' + JSON.stringify(CvEventType[event.type]) + ' to ' + listener);
                listener(event);
            });
        }
    };
    CvEventRegistry.prototype.subscribe = function (listener, eventType) {
        var listenerArray = this._listenerMap[eventType];
        if (!listenerArray) {
            listenerArray = [];
            this._listenerMap[eventType] = listenerArray;
        }
        if (listenerArray.indexOf(listener) < 0) {
            listenerArray.push(listener);
        }
    };
    CvEventRegistry.prototype.unsubscribe = function (listener) {
        for (var eventType in this._listenerMap) {
            var listenerArray = this._listenerMap[eventType];
            if (listenerArray) {
                var index = listenerArray.indexOf(listener);
                if (index > -1) {
                    listenerArray.splice(index, 1);
                }
            }
        }
    };
    return CvEventRegistry;
})();
/**
 * Created by rburson on 1/15/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
var CvResource = React.createClass({
    displayName: "CvResource",

    mixins: [CvBaseMixin],
    getDefaultProps: function getDefaultProps() {
        return { type: 'image', resourceName: '' };
    },
    render: function render() {
        if (this.props.resourceName) {
            var baseUrl = null;
            var tenantSettingsTry = this.context.catavolt.tenantSettingsTry;
            if (tenantSettingsTry.isSuccess) {
                baseUrl = tenantSettingsTry.success['GMLAssetsURL'];
            }
            if (this.props.type === 'image') {
                return React.createElement("img", { "style": this.props.style, "className": this.props.className, "src": baseUrl + this.props.resourceName });
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
});
/**
 * Created by rburson on 1/11/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Exposes the scope of the enclosing tag via the handler function
 ***************************************************
 */
var CvScope = React.createClass({
    displayName: "CvScope",

    mixins: [CvBaseMixin],
    getDefaultProps: function getDefaultProps() {
        return { handler: null, get: null };
    },
    render: function render() {
        if (this.context.scopeObj) {
            if (this.props.get) {
                var value = this.context.scopeObj[this.props.get];
                return value ? React.createElement("span", null, value) : null;
            } else if (this.props.handler) {
                return this.props.handler(this.context.scopeObj);
            }
        }
        return null;
    }
});
/**
 * Created by rburson on 1/14/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render an EntityRec
 ***************************************************
 */
var CvRecord = React.createClass({
    displayName: "CvRecord",

    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {},
    getChildContext: function getChildContext() {
        return { scopeObj: this.props.entityRec };
    },
    getInitialState: function getInitialState() {
        return {};
    },
    render: function render() {
        var entityRec = this.props.entityRec;
        if (entityRec) {
            if (React.Children.count(this.props.children) > 0) {
                return React.createElement("span", { "onClick": this.itemClicked.bind(this, entityRec.objectId) }, this.props.children);
            } else {
                return React.createElement("span", null, 'Default row goes here');
            }
        } else {
            return null;
        }
    },
    itemClicked: function itemClicked(objectId) {
        var _this = this;
        var paneContext = this.context.scopeObj;
        if (paneContext instanceof ListContext) {
            var listContext = paneContext;
            if (listContext.listDef.defaultActionId) {
                var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
                listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(function (navRequestTry) {
                    _this.context.eventRegistry.publish({
                        type: CvEventType.NAVIGATION, eventObj: {
                            navRequestTry: navRequestTry,
                            actionId: listContext.listDef.defaultActionId,
                            navTarget: _this.props.navTarget
                        }
                    });
                });
            }
        }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a DetailsContext
 ***************************************************
 */
var CvDetails = React.createClass({
    displayName: "CvDetails",

    mixins: [CvBaseMixin],
    getInitialState: function getInitialState() {
        return { renderedDetailRows: [] };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;
        this.props.detailsContext.read().onComplete(function (entityRecTry) {
            _this.layoutDetailsPane(_this.props.detailsContext);
        });
    },
    render: function render() {
        var detailsContext = this.props.detailsContext;
        return React.createElement("div", { "className": "panel panel-primary" }, React.createElement("div", { "className": "panel-heading" }, React.createElement("span", null, detailsContext.paneTitle || '>'), React.createElement("div", { "className": "pull-right" }, detailsContext.menuDefs.map(function (menuDef, index) {
            return React.createElement(CvMenu, { "key": index, "actionId": menuDef.actionId });
        }))), React.createElement("div", { "style": { maxHeight: '400px', overflow: 'auto' } }, React.createElement("table", { "className": "table table-striped" }, React.createElement("tbody", null, this.state.renderedDetailRows))));
    },
    layoutDetailsPane: function layoutDetailsPane(detailsContext) {
        var _this = this;
        var allDefsComplete = Future.createSuccessfulFuture('layoutDetailsPaneStart', {});
        var renderedDetailRows = [];
        detailsContext.detailsDef.rows.forEach(function (cellDefRow, index) {
            if (_this.isValidDetailsDefRow(cellDefRow)) {
                if (_this.isSectionTitleDef(cellDefRow)) {
                    allDefsComplete = allDefsComplete.map(function (lastRowResult) {
                        var titleRow = _this.createTitleRow(cellDefRow, index);
                        renderedDetailRows.push(titleRow);
                        return titleRow;
                    });
                } else {
                    allDefsComplete = allDefsComplete.bind(function (lastRowResult) {
                        return _this.createEditorRow(cellDefRow, detailsContext, index).map(function (editorRow) {
                            renderedDetailRows.push(editorRow);
                            return editorRow;
                        });
                    });
                }
            } else {
                Log.error('Detail row is invalid ' + ObjUtil.formatRecAttr(cellDefRow));
            }
        });
        allDefsComplete.onComplete(function (lastRowResultTry) {
            _this.setState({ renderedDetailRows: renderedDetailRows });
        });
    },
    isValidDetailsDefRow: function isValidDetailsDefRow(row) {
        return row.length === 2 && row[0].values.length === 1 && row[1].values.length === 1 && (row[0].values[0] instanceof LabelCellValueDef || row[1].values[0] instanceof ForcedLineCellValueDef) && (row[1].values[0] instanceof AttributeCellValueDef || row[1].values[0] instanceof LabelCellValueDef || row[1].values[0] instanceof ForcedLineCellValueDef);
    },
    isSectionTitleDef: function isSectionTitleDef(row) {
        return row[0].values[0] instanceof LabelCellValueDef && row[1].values[0] instanceof LabelCellValueDef;
    },
    createTitleRow: function createTitleRow(row, index) {
        Log.info('row: ' + JSON.stringify(row));
        return React.createElement("tr", { "key": index }, React.createElement("td", null, React.createElement("span", null, React.createElement("strong", null, row[0].values[0].value))), React.createElement("td", null, React.createElement("span", null, React.createElement("strong", null, row[1].values[0].value))));
    },
    /* Returns a Future */
    createEditorRow: function createEditorRow(row, detailsContext, index) {
        var labelDef = row[0].values[0];
        var label;
        if (labelDef instanceof LabelCellValueDef) {
            label = React.createElement("span", null, labelDef.value);
        } else {
            label = React.createElement("span", null, "N/A");
        }
        var valueDef = row[1].values[0];
        if (valueDef instanceof AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
            return this.createEditorControl(valueDef, detailsContext).map(function (editorCellString) {
                return React.createElement("tr", { "key": index }, [React.createElement("td", null, label), React.createElement("td", null, editorCellString)]);
            });
        } else if (valueDef instanceof AttributeCellValueDef) {
            var value = React.createElement("span", null);
            var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
            if (prop && detailsContext.isBinary(valueDef)) {
                value = React.createElement("span", null);
            } else if (prop) {
                value = React.createElement("span", null, detailsContext.formatForRead(prop.value, prop.name));
            }
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", { "key": index }, [React.createElement("td", null, label), React.createElement("td", null, value)]));
        } else if (valueDef instanceof LabelCellValueDef) {
            var value = React.createElement("span", null, valueDef.value);
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", { "key": index }, [React.createElement("td", null, label), React.createElement("td", null, value)]));
        } else {
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", { "key": index }, [React.createElement("td", null, label), React.createElement("td", null)]));
        }
    },
    /* Returns a Future */
    createEditorControl: function createEditorControl(attributeDef, detailsContext) {
        if (attributeDef.isComboBoxEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
                return React.createElement("span", null);
                //return '<ComboBox>' + values.join(", ") + '</ComboBox>';
            });
        } else if (attributeDef.isDropDownEntryMethod) {
                return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
                    return React.createElement("span", null);
                    //return '<DropDown>' + values.join(", ") + '</DropDown>';
                });
            } else {
                    var entityRec = detailsContext.buffer;
                    var prop = entityRec.propAtName(attributeDef.propertyName);
                    if (prop && detailsContext.isBinary(attributeDef)) {
                        return Future.createSuccessfulFuture('createEditorControl', React.createElement("span", null));
                    } else {
                        var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
                        return Future.createSuccessfulFuture('createEditorControl', React.createElement("span", null, value));
                    }
                }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a FormContext
 ***************************************************
 */
var CvForm = React.createClass({
    displayName: "CvForm",

    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {
        this.setState({ formContext: this.context.scopeObj });
    },
    getChildContext: function getChildContext() {
        return { scopeObj: this.state.formContext };
    },
    getInitialState: function getInitialState() {
        return { formContext: null };
    },
    render: function render() {
        var _this = this;
        var formContext = this.state.formContext;
        if (formContext) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            } else {
                return React.createElement("span", null, formContext.childrenContexts.map(function (context) {
                    Log.info('');
                    Log.info('Got a ' + context.constructor['name'] + ' for display');
                    Log.info('');
                    if (context instanceof ListContext) {
                        return React.createElement(CvList, { "paneRef": context.paneRef, "key": context.paneRef });
                    } else if (context instanceof DetailsContext) {
                        return React.createElement(CvDetails, { "detailsContext": context, "onNavRequest": _this.props.onNavRequest, "key": context.paneRef });
                    } else {
                        Log.info('');
                        Log.info('Not yet handling display for ' + context.constructor['name']);
                        Log.info('');
                        return React.createElement(CvMessage, { "message": "Not yet handling display for " + context.constructor['name'], "key": context.paneRef });
                    }
                }), React.createElement("div", { "className": "panel-footer" }));
            }
        } else {
            return null;
        }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * When you need to look fancy
 ***************************************************
 */
var CvHeroHeader = React.createClass({
    displayName: "CvHeroHeader",

    mixins: [CvBaseMixin],
    render: function render() {
        return React.createElement("div", { "className": "jumbotron logintron" }, React.createElement("div", { "className": "container-fluid" }, React.createElement("div", { "className": "center-block" }, React.createElement("img", { "className": "img-responsive center-block", "src": "img/Catavolt-Logo-retina.png", "style": { verticalAlign: 'middle' } }))));
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a 'Launcher'
 ***************************************************
 */
var CvLauncher = React.createClass({
    displayName: "CvLauncher",

    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {
        var _this = this;
        var workbench = this.context.scopeObj;
        workbench.workbenchLaunchActions.some(function (launchAction) {
            if (launchAction.actionId == _this.props.actionId) {
                _this.setState({ launchAction: launchAction });
                return true;
            } else {
                return false;
            }
        });
    },
    getChildContext: function getChildContext() {
        return {
            scopeObj: this.state.launchAction
        };
    },
    getDefaultProps: function getDefaultProps() {
        return { launchListeners: [] };
    },
    getInitialState: function getInitialState() {
        return { launchAction: null };
    },
    render: function render() {
        if (this.state.launchAction) {
            if (React.Children.count(this.props.children) > 0) {
                return React.createElement("span", { "onClick": this.handleClick }, this.props.children);
            } else {
                return React.createElement("div", { "className": "col-md-4 launch-div" }, React.createElement("img", { "className": "launch-icon img-responsive center-block", "src": this.state.launchAction.iconBase, "onClick": this.handleClick }), React.createElement("h5", { "className": "launch-text small text-center", "onClick": this.handleClick }, this.state.launchAction.name));
            }
        } else {
            return null;
        }
    },
    handleClick: function handleClick() {
        var _this = this;
        this.context.catavolt.performLaunchAction(this.state.launchAction).onComplete(function (launchTry) {
            _this.props.launchListeners.forEach(function (listener) {
                listener(launchTry);
            });
            _this.context.eventRegistry.publish({ type: CvEventType.NAVIGATION, eventObj: { navRequestTry: launchTry,
                    workbenchId: _this.state.launchAction.workbenchId, navTarget: _this.props.navTarget } });
        });
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/**
   @TODO This class needs to allow for CvRecord at any depth with children.  Also better handling of 'wrapper' requirement

 */
/*
 ***************************************************
 * Render a ListContext
 ***************************************************
 */
var QueryMarkerOption = catavolt.dialog.QueryMarkerOption;
var CvList = React.createClass({
    displayName: "CvList",

    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {
        var _this = this;
        var formContext = this.context.scopeObj;
        var listContext = null;
        formContext.childrenContexts.some(function (childContext) {
            if (childContext instanceof ListContext && childContext.paneRef == _this.props.paneRef) {
                listContext = childContext;
                return true;
            } else {
                return false;
            }
        });
        this.setState({ listContext: listContext });
        listContext.setScroller(50, null, [QueryMarkerOption.None]);
        listContext.scroller.refresh().onComplete(function (entityRecTry) {
            if (entityRecTry.isFailure) {
                Log.error("ListContext failed to render with " + ObjUtil.formatRecAttr(entityRecTry.failure));
            } else {
                Log.info(JSON.stringify(listContext.scroller.buffer));
                _this.setState({ listContext: listContext });
            }
        });
    },
    getChildContext: function getChildContext() {
        return { scopeObj: this.state.listContext };
    },
    getInitialState: function getInitialState() {
        return { listContext: null };
    },
    itemClicked: function itemClicked(objectId) {
        var _this = this;
        var listContext = this.state.listContext;
        if (listContext.listDef.defaultActionId) {
            var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
            listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(function (navRequestTry) {
                _this.context.eventRegistry.publish({ type: CvEventType.NAVIGATION, eventObj: { navRequestTry: navRequestTry,
                        actionId: listContext.listDef.defaultActionId } });
            });
        }
    },
    render: function render() {
        var _this = this;
        var listContext = this.state.listContext;
        if (listContext) {
            var entityRecs = ArrayUtil.copy(listContext.scroller.buffer);
            if (React.Children.count(this.props.children) > 0) {
                var newChildren = [];
                React.Children.toArray(this.props.children).forEach(function (childElem) {
                    if (childElem.type == CvRecord) {
                        entityRecs.map(function (entityRec, index) {
                            newChildren.push(React.cloneElement(childElem, { entityRec: entityRec, key: index }));
                        });
                    } else {
                        newChildren.push(childElem);
                    }
                });
                if (this.props.wrapperElem) {
                    return React.createElement(this.props.wrapperElem, {}, newChildren);
                } else {
                    return React.createElement("span", null, newChildren);
                }
            } else {
                return React.createElement("div", { "className": "panel panel-primary" }, React.createElement("div", { "className": "panel-heading" }, React.createElement("span", null, listContext.paneTitle || '>'), React.createElement("div", { "className": "pull-right" }, listContext.menuDefs.map(function (menuDef, index) {
                    return React.createElement(CvMenu, { "key": index, "actionId": menuDef.actionId });
                }))), React.createElement("div", { "style": { maxHeight: '400px', overflow: 'auto' } }, React.createElement("table", { "className": "table table-striped" }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", { "key": "nbsp" }, " "), listContext.columnHeadings.map(function (heading, index) {
                    return React.createElement("th", { "key": index }, heading);
                }))), React.createElement("tbody", null, entityRecs.map(function (entityRec, index) {
                    return React.createElement("tr", { "key": index, "onClick": _this.itemClicked.bind(_this, entityRec.objectId) }, React.createElement("td", { "className": "text-center", "key": "checkbox" }, React.createElement("input", { "type": "checkbox" })), listContext.rowValues(entityRec).map(function (val, index) {
                        return React.createElement("td", { "key": index }, val ? val.toString() : ' ');
                    }));
                })))));
            }
        } else {
            return null;
        }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a 'context menu' for a MenuDef
 ***************************************************
 */
var CvMenu = React.createClass({
    displayName: "CvMenu",

    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {
        var _this = this;
        var paneContext = this.context.scopeObj;
        paneContext.menuDefs.some(function (menuDef) {
            if (menuDef.actionId == _this.props.actionId) {
                _this.setState({ menuDef: menuDef });
                return true;
            } else {
                return false;
            }
        });
    },
    getChildContext: function getChildContext() {
        return { scopeObj: this.state.menuDef };
    },
    getInitialState: function getInitialState() {
        return { menuDef: null };
    },
    render: function render() {
        var _this = this;
        var menuDef = this.props.menuDef;
        if (menuDef) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            } else {
                var findContextMenuDef = function findContextMenuDef(md) {
                    if (md.name === 'CONTEXT_MENU') return md;
                    if (md.menuDefs) {
                        for (var i = 0; i < md.menuDefs.length; i++) {
                            var result = findContextMenuDef(md.menuDefs[i]);
                            if (result) return result;
                        }
                    }
                    return null;
                };
                var ctxMenuDef = findContextMenuDef(menuDef);
                return React.createElement("div", { "className": "btn-group" }, React.createElement("button", { "type": "button", "className": "btn btn-xs btn-primary dropdown-toggle", "data-toggle": "dropdown" }, React.createElement("span", { "className": "caret" })), React.createElement("ul", { "className": "dropdown-menu", "role": "menu" }, ctxMenuDef.menuDefs.map(function (md, index) {
                    return React.createElement("li", { "key": index }, React.createElement("a", { "onClick": _this.performMenuAction(md.actionId) }, md.label));
                }), React.createElement("li", { "className": "divider", "key": "divider" }), React.createElement("li", { "key": "select_all" }, React.createElement("a", { "onClick": this.selectAll() }, "Select All")), React.createElement("li", { "key": "deselect_all" }, React.createElement("a", { "onClick": this.deselectAll() }, "Deselect All"))));
            }
        } else {
            return null;
        }
    },
    performMenuAction: function performMenuAction() {},
    selectAll: function selectAll() {},
    deselectAll: function deselectAll() {}
});
/**
 * Created by rburson on 12/23/15.
 *
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
var CvMessage = React.createClass({
    displayName: "CvMessage",

    mixins: [CvBaseMixin],
    render: function render() {
        Log.info(this.props.message);
        return React.createElement("span", null);
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a NavRequest
 ***************************************************
 */
var CvNavigation = React.createClass({
    displayName: "CvNavigation",

    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {
        var _this = this;
        this.context.eventRegistry.subscribe(function (navEvent) {
            if (navEvent.eventObj.navTarget) {
                if (_this.props.targetId === navEvent.eventObj.navTarget) {
                    _this.setState({ navRequestTry: navEvent.eventObj.navRequestTry, visible: true });
                } else {
                    if (!_this.props.persistent) _this.setState({ visible: false });
                }
            } else {
                if (!_this.props.targetId) {
                    _this.setState({ navRequestTry: navEvent.eventObj.navRequestTry, visible: true });
                } else {
                    if (!_this.props.persistent) _this.setState({ visible: false });
                }
            }
        }, CvEventType.NAVIGATION);
    },
    getChildContext: function getChildContext() {
        var navRequest = null;
        if (this.state.navRequestTry && !this.state.navRequestTry.isFailure) {
            navRequest = this.state.navRequestTry.success;
        }
        return {
            scopeObj: navRequest
        };
    },
    getInitialState: function getInitialState() {
        return { visible: false, navRequestTry: null };
    },
    render: function render() {
        if (this.state.visible && this.state.navRequestTry && this.state.navRequestTry.isSuccess) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            } else {
                if (this.state.navRequestTry.success instanceof FormContext) {
                    return React.createElement(CvForm, null);
                } else {
                    return React.createElement(CvMessage, { "message": "Unsupported type of NavRequest " + this.state.navRequestTry });
                }
            }
        } else {
            return null;
        }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a top-level application toolbar
 ***************************************************
 */
var CvToolbar = React.createClass({
    displayName: "CvToolbar",

    mixins: [CvBaseMixin],
    render: function render() {
        return React.createElement("nav", { "className": "navbar navbar-default navbar-static-top component-chrome" }, React.createElement("div", { "className": "container-fluid" }, React.createElement("div", { "className": "navbar-header" }, React.createElement("button", { "type": "button", "className": "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#navbar", "aria-expanded": "false", "aria-controls": "navbar" }, React.createElement("span", { "className": "sr-only" }, "Toggle Navigation"), React.createElement("span", { "className": "icon-bar" }, " "), React.createElement("span", { "className": "icon-bar" }, " "), React.createElement("span", { "className": "icon-bar" }, " ")), React.createElement("a", { "className": "navbar-brand", "href": "#" }, "Catavolt")), React.createElement("div", { "id": "navbar", "className": "navbar-collapse collapse" }, React.createElement("ul", { "className": "nav navbar-nav navbar-right" }, React.createElement("li", { "className": "dropdown" }, React.createElement("a", { "href": "", "className": "dropdown-toggle", "data-toggle": "dropdown", "role": "button", "aria-expanded": "true" }, "Workbenches", React.createElement("span", { "className": "caret" }, " ")), React.createElement("ul", { "className": "dropdown-menu", "role": "menu" }, React.createElement("li", null, React.createElement("a", { "href": "#" }, "Default")))), React.createElement("li", null, React.createElement("a", { "href": "#" }, "Settings"))), React.createElement("form", { "className": "navbar-form navbar-right" }, React.createElement("input", { "type": "text", "className": "form-control", "placeholder": "Search For Help On..." })))));
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * A component analogous to Catavolt AppWinDef
 ***************************************************
 */
var CvAppWindow = React.createClass({
    displayName: "CvAppWindow",

    mixins: [CvBaseMixin],
    componentDidMount: function componentDidMount() {
        var _this = this;
        this.context.eventRegistry.subscribe(function (loginEvent) {
            _this.setState({ loggedIn: true });
        }, CvEventType.LOGIN);
    },
    getInitialState: function getInitialState() {
        return {
            loggedIn: false
        };
    },
    render: function render() {
        var _this = this;
        if (this.state.loggedIn) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            } else {
                var workbenches = this.context.catavolt.appWinDefTry.success.workbenches;
                return React.createElement("span", null, React.createElement(CvToolbar, null), React.createElement("div", { "className": "container" }, (function () {
                    if (_this.showWorkbench()) {
                        return workbenches.map(function (workbench, index) {
                            return React.createElement(CvWorkbench, { "workbenchId": workbench.workbenchId, "key": index });
                        });
                    }
                })(), React.createElement(CvNavigation, null)));
            }
        } else {
            return null;
        }
    },
    showWorkbench: function showWorkbench() {
        return this.props.persistentWorkbench || !this.state.navRequestTry;
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a Workbench
 ***************************************************
 */
var CvWorkbench = React.createClass({
    displayName: "CvWorkbench",

    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {
        var _this = this;
        this.context.catavolt.appWinDefTry.success.workbenches.some(function (workbench) {
            if (workbench.workbenchId == _this.props.workbenchId) {
                _this.setState({ workbench: workbench });
                return true;
            } else {
                return false;
            }
        });
        this.context.eventRegistry.subscribe(function (navEvent) {
            if (!_this.props.persistent) {
                if (navEvent.eventObj.workbenchId == _this.props.workbenchId) {
                    _this.setState({ visible: false });
                }
            }
        }, CvEventType.NAVIGATION);
    },
    getDefaultProps: function getDefaultProps() {
        return { persistent: true, workbenchId: null };
    },
    getChildContext: function getChildContext() {
        return {
            scopeObj: this.state.workbench
        };
    },
    getInitialState: function getInitialState() {
        return { workbench: null, visible: true };
    },
    render: function render() {
        if (this.state.workbench && this.state.visible) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            } else {
                var launchActions = this.state.workbench.workbenchLaunchActions;
                var launchComps = [];
                for (var i = 0; i < launchActions.length; i++) {
                    launchComps.push(React.createElement(CvLauncher, { "actionId": launchActions[i].actionId, "key": launchActions[i].actionId }));
                }
                return React.createElement("div", { "className": "panel panel-primary" }, React.createElement("div", { "className": "panel-heading" }, React.createElement("h3", { "className": "panel-title" }, this.state.workbench.name)), React.createElement("div", { "className": "panel-body" }, launchComps));
            }
        } else {
            return null;
        }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a LoginPane
 ***************************************************
 */
var CvLoginPane = React.createClass({
    displayName: "CvLoginPane",

    mixins: [CvBaseMixin],
    componentDidMount: function componentDidMount() {
        var _this = this;
        this.context.eventRegistry.subscribe(function (logoutEvent) {
            _this.setState({ loggedIn: false });
        }, CvEventType.LOGOUT);
    },
    getDefaultProps: function getDefaultProps() {
        return {
            loginListeners: []
        };
    },
    getInitialState: function getInitialState() {
        return {
            tenantId: 'catavolt-dev',
            gatewayUrl: 'www.catavolt.net',
            userId: 'rob',
            password: 'rob123',
            clientType: 'RICH_CLIENT',
            loggedIn: false
        };
    },
    render: function render() {
        if (!this.state.loggedIn) {
            return React.createElement("div", { "className": "container" }, React.createElement("div", { "className": "well" }, React.createElement("form", { "className": "form-horizontal login-form", "onSubmit": this.handleSubmit }, React.createElement("div", { "className": "form-group" }, React.createElement("label", { "htmlFor": "tenantId", "className": "col-sm-2 control-label" }, "Tenant Id:"), React.createElement("div", { "className": "col-sm-10" }, React.createElement("input", { "id": "tenantId", "type": "text", "className": "form-control", "value": this.state.tenantId, "onChange": this.handleChange.bind(this, 'tenantId'), "required": true }))), React.createElement("div", { "className": "form-group" }, React.createElement("label", { "htmlFor": "gatewayUrl", "className": "col-sm-2 control-label" }, "Gateway URL:"), React.createElement("div", { "className": "col-sm-10" }, React.createElement("div", { "className": "input-group" }, React.createElement("input", { "id": "gatewayUrl", "type": "text", "className": "form-control", "value": this.state.gatewayUrl, "onChange": this.handleChange.bind(this, 'gatewayUrl'), "aria-describedby": "http-addon", "required": true })))), React.createElement("div", { "className": "form-group" }, React.createElement("label", { "htmlFor": "userId", "className": "col-sm-2 control-label" }, "User Id:"), React.createElement("div", { "className": "col-sm-10" }, React.createElement("input", { "id": "userId", "type": "text", "className": "form-control", "value": this.state.userId, "onChange": this.handleChange.bind(this, 'userId'), "required": true }))), React.createElement("div", { "className": "form-group" }, React.createElement("label", { "htmlFor": "password", "className": "col-sm-2 control-label" }, "Password:"), React.createElement("div", { "className": "col-sm-10" }, React.createElement("input", { "id": "password", "type": "password", "className": "form-control", "value": this.state.password, "onChange": this.handleChange.bind(this, 'password'), "required": true }))), React.createElement("div", { "className": "form-group" }, React.createElement("label", { "htmlFor": "clientType", "className": "col-sm-2 control-label" }, "Client Type:"), React.createElement("div", { "className": "col-sm-10" }, React.createElement("label", { "className": "radio-inline" }, React.createElement("input", { "id": "clientType", "type": "radio", "onChange": this.handleRadioChange.bind(this, 'clientType', 'LIMITED_ACCESS'), "checked": this.state.clientType === 'LIMITED_ACCESS' }), "Limited"), React.createElement("label", { "className": "radio-inline" }, React.createElement("input", { "id": "clientType", "type": "radio", "onChange": this.handleRadioChange.bind(this, 'clientType', 'RICH_CLIENT'), "checked": this.state.clientType === 'RICH_CLIENT' }), "Rich"))), React.createElement("div", { "className": "form-group" }, React.createElement("div", { "className": "col-sm-10 col-sm-offset-2" }, React.createElement("button", { "type": "submit", "className": "btn btn-default btn-primary btn-block", "value": "Login" }, "Login", React.createElement("span", { "className": "glyphicon glyphicon-log-in", "aria-hidden": "true" })))))));
        } else {
            return null;
        }
    },
    handleChange: function handleChange(field, e) {
        var nextState = {};
        nextState[field] = e.target.value;
        this.setState(nextState);
    },
    handleRadioChange: function handleRadioChange(field, value, e) {
        var nextState = {};
        nextState[field] = value;
        this.setState(nextState);
    },
    handleSubmit: function handleSubmit(e) {
        var _this = this;
        e.preventDefault();
        this.context.catavolt.login(this.state.gatewayUrl, this.state.tenantId, this.state.clientType, this.state.userId, this.state.password).onComplete(function (appWinDefTry) {
            _this.setState({ loggedIn: true });
            _this.props.loginListeners.forEach(function (listener) {
                listener();
            });
            _this.context.eventRegistry.publish({ type: CvEventType.LOGIN, eventObj: {} });
        });
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 *  Top-level container for a Catavolt Application
 ***************************************************
 */
var CatavoltPane = React.createClass({
    displayName: "CatavoltPane",

    mixins: [CvBaseMixin],
    checkSession: function checkSession() {
        var _this = this;
        var sessionContext = this.getSession();
        if (sessionContext) {
            this.props.catavolt.refreshContext(sessionContext).onComplete(function (appWinDefTry) {
                if (appWinDefTry.isFailure) {
                    Log.error("Failed to refresh session: " + ObjUtil.formatRecAttr(appWinDefTry.failure));
                } else {
                    _this.setState({ loggedIn: true });
                }
            });
        }
    },
    childContextTypes: {
        catavolt: React.PropTypes.object,
        eventRegistry: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {
        var _this = this;
        this.props.eventRegistry.subscribe(function (loginEvent) {
            _this.setState({ loggedIn: true });
        }, CvEventType.LOGIN);
        this.props.eventRegistry.subscribe(function (logoutEvent) {
            _this.setState({ loggedIn: false });
        }, CvEventType.LOGOUT);
        /* @TODO - need to work on the AppContext to make the session restore possible */
        //this.checkSession();
    },
    getChildContext: function getChildContext() {
        return {
            catavolt: this.props.catavolt,
            eventRegistry: this.props.eventRegistry
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            catavolt: AppContext.singleton,
            eventRegistry: new CvEventRegistry()
        };
    },
    getInitialState: function getInitialState() {
        return { loggedIn: false };
    },
    getSession: function getSession() {
        var session = sessionStorage.getItem('session');
        return session ? JSON.parse(session) : null;
    },
    render: function render() {
        if (React.Children.count(this.props.children) > 0) {
            return this.props.children;
        } else {
            return React.createElement("span", null, React.createElement(CvLoginPane, null), React.createElement(CvAppWindow, { "persistentWorkbench": true }));
        }
    },
    removeSession: function removeSession() {
        sessionStorage.removeItem('session');
    },
    storeSession: function storeSession(sessionContext) {
        sessionStorage.setItem('session', JSON.stringify(sessionContext));
    }
});
/**
 * Created by rburson on 3/6/15.
 */
//components
///<reference path="CvReact.tsx"/>
///<reference path="CvResource.tsx"/>
///<reference path="CvScope.tsx"/>
///<reference path="CvProp.tsx"/>
///<reference path="CvRecord.tsx"/>
///<reference path="CvDetails.tsx"/>
///<reference path="CvForm.tsx"/>
///<reference path="CvHeroHeader.tsx"/>
///<reference path="CvLauncher.tsx"/>
///<reference path="CvList.tsx"/>
///<reference path="CvMenu.tsx"/>
///<reference path="CvMessage.tsx"/>
///<reference path="CvNavigation.tsx"/>
///<reference path="CvToolbar.tsx"/>
///<reference path="CvAppWindow.tsx"/>
///<reference path="CvWorkbench.tsx"/>
///<reference path="CvLoginPane.tsx"/>
///<reference path="CatavoltPane.tsx"/>
/**
 * Created by rburson on 1/14/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a Property
 ***************************************************
 */
var CvProp = React.createClass({
    displayName: "CvProp",

    mixins: [CvBaseMixin],
    childContextTypes: {
        scopeObj: React.PropTypes.object
    },
    componentDidMount: function componentDidMount() {
        var entityRec = this.context.scopeObj;
        var prop = entityRec.propAtName(this.props.propName);
        this.setState({ prop: prop });
    },
    getChildContext: function getChildContext() {
        return { scopeObj: this.state.prop };
    },
    getInitialState: function getInitialState() {
        return { prop: null };
    },
    render: function render() {
        var prop = this.state.prop;
        if (prop) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.children;
            } else {
                if (prop.value instanceof InlineBinaryRef) {
                    var binary = prop.value;
                    var mimeType = binary.settings['mime-type'] || 'image/jpg';
                    return React.createElement("img", { "style": this.props.style, "src": 'data:' + mimeType + ';base64,' + binary.inlineData, "className": this.props.className });
                } else if (prop.value instanceof ObjectBinaryRef) {
                    var binary = prop.value;
                    return React.createElement("img", { "style": this.props.style, "src": binary.settings['webURL'] });
                } else {
                    return React.createElement("span", { "style": this.props.style }, prop.value ? PropFormatter.formatForRead(prop.value, null) : '');
                }
            }
        } else {
            return null;
        }
    }
});

},{}]},{},[1]);
