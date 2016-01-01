///<reference path="jasmine.d.ts"/>
var fp_1 = require("../src/catavolt/fp");
var dialog_1 = require("../src/catavolt/dialog");
var util_1 = require("../src/catavolt/util");
var dialog_2 = require("../src/catavolt/dialog");
var dialog_3 = require("../src/catavolt/dialog");
var dialog_4 = require("../src/catavolt/dialog");
var util_2 = require("../src/catavolt/util");
var dialog_5 = require("../src/catavolt/dialog");
var dialog_6 = require("../src/catavolt/dialog");
var dialog_7 = require("../src/catavolt/dialog");
var dialog_8 = require("../src/catavolt/dialog");
var dialog_9 = require("../src/catavolt/dialog");
var SERVICE_PATH = "www.catavolt.net";
var tenantId = "***REMOVED***z";
var userId = "sales";
var password = "***REMOVED***";
var clientType = "LIMITED_ACCESS";
describe("Api Usage", function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });
    it("Should run API Examples", function (done) {
        loginWithAppContext();
    });
});
function loginWithAppContext() {
    return dialog_1.AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind(function (appWinDef) {
        util_1.Log.info('Login Succeeded');
        util_1.Log.info('AppWinDef: ' + util_1.Log.formatRecString(appWinDef));
        util_1.Log.info('SessionContext: ' + util_1.Log.formatRecString(dialog_1.AppContext.singleton.sessionContextTry.success));
        util_1.Log.info('TenantSettings: ' + util_1.Log.formatRecString(dialog_1.AppContext.singleton.tenantSettingsTry.success));
        return setupWorkbench().bind(function (result) {
            util_1.Log.info('Competed all workbenches.');
            return null;
        });
    });
}
function setupWorkbench() {
    var workbenches = dialog_1.AppContext.singleton.appWinDefTry.success.workbenches;
    var launchWorkbenchesFuture = fp_1.Future.createSuccessfulFuture('startSetupWorkbench', null);
    workbenches.forEach(function (workbench) {
        util_1.Log.info("Examining Workbench: " + workbench.name);
        //test the first action
        /*launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=>{
         var launchAction = workbench.workbenchLaunchActions[0];
         Log.info(">>>>> Launching Action: " +  launchAction.name + " Icon: " + launchAction.iconBase);
         return performLaunchAction(launchAction).map((launchActionResult)=>{
         Log.info('<<<<< Completed Launch Action ' + launchAction.name);
         return launchActionResult;
         });
         });*/
        workbench.workbenchLaunchActions.forEach(function (launchAction) {
            launchWorkbenchesFuture = launchWorkbenchesFuture.bind(function (lastResult) {
                util_1.Log.info(">>>>> Launching Action: " + launchAction.name + " Icon: " + launchAction.iconBase);
                return performLaunchAction(launchAction).map(function (launchActionResult) {
                    util_1.Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                    return launchActionResult;
                });
            });
        });
    });
    return launchWorkbenchesFuture.map(function (lastLaunchActionResult) {
        util_1.Log.info("");
        util_1.Log.info("Completed all launch Actions");
        util_1.Log.info("");
    });
}
function performLaunchAction(launchAction) {
    return dialog_1.AppContext.singleton.performLaunchAction(launchAction).bind(function (navRequest) {
        util_1.Log.info("Perform Launch Action " + launchAction.name + ' succeeded. Continuing with NavRequest...');
        return handleNavRequest(navRequest);
    });
}
function getLaunchActionByName(name, workbenches) {
    return null;
}
function handleNavRequest(navRequest) {
    if (navRequest instanceof dialog_2.FormContext) {
        return handleFormContext(navRequest);
    }
    else {
        util_1.Log.info('NavRequest in not a FormContext:  ' + navRequest.constructor['name']);
        return fp_1.Future.createSuccessfulFuture('handleNavRequest', navRequest);
    }
}
function handleFormContext(formContext) {
    displayMenus(formContext);
    var handleContextsFuture = fp_1.Future.createSuccessfulFuture('startHandleContexts', null);
    formContext.childrenContexts.forEach(function (context) {
        util_1.Log.info('');
        util_1.Log.info('Got a ' + context.constructor['name'] + ' for display');
        util_1.Log.info('');
        if (context instanceof dialog_3.ListContext) {
            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                return handleListContext(context);
            });
        }
        else if (context instanceof dialog_4.DetailsContext) {
            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                return handleDetailsContext(context);
            });
        }
        else {
            util_1.Log.info('');
            util_1.Log.info('Not yet handling display for ' + context.constructor['name']);
            util_1.Log.info('');
            handleContextsFuture = handleContextsFuture.map(function (lastContextResult) {
                return context;
            });
        }
    });
    return handleContextsFuture;
}
function displayMenus(paneContext) {
    util_1.Log.info('----------Menus>>>-------------------------------');
    util_1.Log.info(util_2.ObjUtil.formatRecAttr(paneContext.menuDefs));
    util_1.Log.info('----------<<<Menus-------------------------------');
    return fp_1.Future.createSuccessfulFuture('displayMenus', paneContext);
}
function handleListContext(listContext) {
    util_1.Log.info('Handling a ListContext... ');
    listContext.setScroller(10, null, [dialog_5.QueryMarkerOption.None]);
    var listFuture = listContext.refresh().bind(function (entityRec) {
        util_1.Log.info('Finished refresh');
        displayMenus(listContext);
        var columnHeadings = listContext.listDef.activeColumnDefs.map(function (columnDef) {
            return columnDef.heading;
        });
        util_1.Log.info(columnHeadings.join('|'));
        listContext.scroller.buffer.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        var scrollResultsFuture = scrollThroughAllResults(listContext).bind(function (scrollResult) {
            return scrollBackwardThroughAllResults(listContext);
        });
        return scrollResultsFuture.bind(function (result) {
            return handleDefaultActionForListItem(0, listContext);
        });
    });
    listFuture.onFailure(function (failure) {
        util_1.Log.error("ListContext failed to render with " + failure);
    });
    return listFuture;
}
function scrollThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreForward) {
        util_1.Log.info('The list has more items to display.  Scrolling forward....');
        return getNextPageOfResults(listContext).bind(function (prevPageEntityRecs) {
            return scrollThroughAllResults(listContext);
        });
    }
    else {
        util_1.Log.info('The list has no more items to display.');
        return fp_1.Future.createSuccessfulFuture('scrollThroughAllResults', listContext);
    }
}
function scrollBackwardThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreBackward) {
        util_1.Log.info('The list has previous items to display.  Scrolling backward....');
        return getPreviousPageOfResults(listContext).bind(function (prevPageEntityRecs) {
            return scrollBackwardThroughAllResults(listContext);
        });
    }
    else {
        util_1.Log.info('The list has no more previous items to display.');
        return fp_1.Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
    }
}
function getNextPageOfResults(listContext) {
    return listContext.scroller.pageForward().map(function (entityRecs) {
        util_1.Log.info('Displaying next page of ' + entityRecs.length + ' records.');
        entityRecs.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function getPreviousPageOfResults(listContext) {
    return listContext.scroller.pageBackward().map(function (entityRecs) {
        util_1.Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
        entityRecs.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function displayListItem(entityRec, listContext) {
    var rowValues = listContext.rowValues(entityRec);
    util_1.Log.info(rowValues.join('|'));
}
function handleDefaultActionForListItem(index, listContext) {
    if (!listContext.listDef.defaultActionId) {
        return fp_1.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    }
    var defaultActionMenuDef = new dialog_6.MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
    var entityRecs = listContext.scroller.buffer;
    if (entityRecs.length === 0)
        return fp_1.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    if (entityRecs.length > index) {
        var entityRec = entityRecs[index];
        util_1.Log.info('--------------------------------------------------------------');
        util_1.Log.info('Invoking default action on list item ' + entityRec.objectId);
        util_1.Log.info('--------------------------------------------------------------');
        var targets = [entityRec.objectId];
        return listContext.performMenuAction(defaultActionMenuDef, targets).bind(function (navRequest) {
            return handleNavRequest(navRequest);
        });
    }
    else {
        return fp_1.Future.createFailedFuture('handleDefaultActionForListItem', 'Invalid index for listContext');
    }
}
function handleDetailsContext(detailsContext) {
    util_1.Log.info('Handling Details Context...');
    return detailsContext.read().bind(function (entityRec) {
        return layoutDetailsPane(detailsContext).map(function (renderedDetailRows) {
            renderedDetailRows.forEach(function (row) {
                util_1.Log.info('Detail Row: ' + row);
            });
            return renderedDetailRows;
        });
    });
}
function layoutDetailsPane(detailsContext) {
    var allDefsComplete = fp_1.Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
    var renderedDetailRows = [];
    detailsContext.detailsDef.rows.forEach(function (cellDefRow) {
        if (isValidDetailsDefRow(cellDefRow)) {
            if (isSectionTitleDef(cellDefRow)) {
                allDefsComplete = allDefsComplete.map(function (lastRowResult) {
                    var titleRow = createTitleRow(cellDefRow);
                    renderedDetailRows.push(titleRow);
                    return titleRow;
                });
            }
            else {
                allDefsComplete = allDefsComplete.bind(function (lastRowResult) {
                    return createEditorRow(cellDefRow, detailsContext).map(function (editorRow) {
                        renderedDetailRows.push(editorRow);
                        return editorRow;
                    });
                });
            }
        }
        else {
            util_1.Log.info('Detail row is invalid ' + util_2.ObjUtil.formatRecAttr(cellDefRow));
        }
    });
    return allDefsComplete.map(function (lastRowResult) {
        return renderedDetailRows;
    });
}
function isValidDetailsDefRow(row) {
    return row.length === 2 &&
        row[0].values.length === 1 &&
        row[1].values.length === 1 &&
        (row[0].values[0] instanceof dialog_7.LabelCellValueDef ||
            row[1].values[0] instanceof dialog_8.ForcedLineCellValueDef) &&
        (row[1].values[0] instanceof dialog_9.AttributeCellValueDef ||
            row[1].values[0] instanceof dialog_7.LabelCellValueDef ||
            row[1].values[0] instanceof dialog_8.ForcedLineCellValueDef);
}
function isSectionTitleDef(row) {
    return row[0].values[0] instanceof dialog_7.LabelCellValueDef &&
        row[1].values[0] instanceof dialog_7.LabelCellValueDef;
}
function createTitleRow(row) {
    return '<Label>' + row[0].values[0] + '</Label> : <Label>' + row[1].values[0] + '</Label>';
}
function createEditorRow(row, detailsContext) {
    var labelDef = row[0].values[0];
    var label;
    if (labelDef instanceof dialog_7.LabelCellValueDef) {
        label = '<Label>' + labelDef.value + '</Label>';
    }
    else {
        label = '<Label>N/A</Label>';
    }
    var valueDef = row[1].values[0];
    if (valueDef instanceof dialog_9.AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
        return createEditorControl(valueDef, detailsContext).map(function (editorCellString) {
            return label + editorCellString;
        });
    }
    else if (valueDef instanceof dialog_9.AttributeCellValueDef) {
        var value = "";
        var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
        if (prop && detailsContext.isBinary(valueDef)) {
            value = "<Binary name='" + valueDef.propertyName + "'/>";
        }
        else if (prop) {
            value = '<Label>' + detailsContext.formatForRead(prop.value, prop.name) + '</Label>';
        }
        return fp_1.Future.createSuccessfulFuture('createEditorRow', label + ' : ' + value);
    }
    else if (valueDef instanceof dialog_7.LabelCellValueDef) {
        return fp_1.Future.createSuccessfulFuture('createEditorRow', label + ' : <Label>' + valueDef.value + '</Label>');
    }
    else {
        fp_1.Future.createSuccessfulFuture('createEditorRow', label + " : ");
    }
}
function createEditorControl(attributeDef, detailsContext) {
    if (attributeDef.isComboBoxEntryMethod) {
        return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
            return '<ComboBox>' + values.join(", ") + '</ComboBox>';
        });
    }
    else if (attributeDef.isDropDownEntryMethod) {
        return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
            return '<DropDown>' + values.join(", ") + '</DropDown>';
        });
    }
    else {
        var entityRec = detailsContext.buffer;
        var prop = entityRec.propAtName(attributeDef.propertyName);
        if (prop && detailsContext.isBinary(attributeDef)) {
            return fp_1.Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
        }
        else {
            var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
            return fp_1.Future.createSuccessfulFuture('createEditorControl', '<TextField>' + value + '</TextField>');
        }
    }
}
