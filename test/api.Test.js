///<reference path="jasmine.d.ts"/>
"use strict";
var catavolt_1 = require('../src/catavolt');
var catavolt_2 = require('../src/catavolt');
var catavolt_3 = require('../src/catavolt');
var catavolt_4 = require('../src/catavolt');
var catavolt_5 = require('../src/catavolt');
var catavolt_6 = require('../src/catavolt');
var catavolt_7 = require('../src/catavolt');
var catavolt_8 = require('../src/catavolt');
var catavolt_9 = require('../src/catavolt');
var catavolt_10 = require('../src/catavolt');
var catavolt_11 = require('../src/catavolt');
var catavolt_12 = require('../src/catavolt');
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
    return catavolt_4.AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind(function (appWinDef) {
        catavolt_2.Log.info('Login Succeeded');
        catavolt_2.Log.info('AppWinDef: ' + catavolt_2.Log.formatRecString(appWinDef));
        catavolt_2.Log.info('SessionContext: ' + catavolt_2.Log.formatRecString(catavolt_4.AppContext.singleton.sessionContextTry.success));
        catavolt_2.Log.info('TenantSettings: ' + catavolt_2.Log.formatRecString(catavolt_4.AppContext.singleton.tenantSettingsTry.success));
        return setupWorkbench().bind(function (result) {
            catavolt_2.Log.info('Competed all workbenches.');
            return null;
        });
    });
}
function setupWorkbench() {
    var workbenches = catavolt_4.AppContext.singleton.appWinDefTry.success.workbenches;
    var launchWorkbenchesFuture = catavolt_3.Future.createSuccessfulFuture('startSetupWorkbench', null);
    workbenches.forEach(function (workbench) {
        catavolt_2.Log.info("Examining Workbench: " + workbench.name);
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
                catavolt_2.Log.info(">>>>> Launching Action: " + launchAction.name + " Icon: " + launchAction.iconBase);
                return performLaunchAction(launchAction).map(function (launchActionResult) {
                    catavolt_2.Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                    return launchActionResult;
                });
            });
        });
    });
    return launchWorkbenchesFuture.map(function (lastLaunchActionResult) {
        catavolt_2.Log.info("");
        catavolt_2.Log.info("Completed all launch Actions");
        catavolt_2.Log.info("");
    });
}
function performLaunchAction(launchAction) {
    return catavolt_4.AppContext.singleton.performLaunchAction(launchAction).bind(function (navRequest) {
        catavolt_2.Log.info("Perform Launch Action " + launchAction.name + ' succeeded. Continuing with NavRequest...');
        return handleNavRequest(navRequest);
    });
}
function getLaunchActionByName(name, workbenches) {
    return null;
}
function handleNavRequest(navRequest) {
    if (navRequest instanceof catavolt_5.FormContext) {
        return handleFormContext(navRequest);
    }
    else {
        catavolt_2.Log.info('NavRequest in not a FormContext:  ' + navRequest.constructor['name']);
        return catavolt_3.Future.createSuccessfulFuture('handleNavRequest', navRequest);
    }
}
function handleFormContext(formContext) {
    displayMenus(formContext);
    var handleContextsFuture = catavolt_3.Future.createSuccessfulFuture('startHandleContexts', null);
    formContext.childrenContexts.forEach(function (context) {
        catavolt_2.Log.info('');
        catavolt_2.Log.info('Got a ' + context.constructor['name'] + ' for display');
        catavolt_2.Log.info('');
        if (context instanceof catavolt_6.ListContext) {
            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                return handleListContext(context);
            });
        }
        else if (context instanceof catavolt_8.DetailsContext) {
            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                return handleDetailsContext(context);
            });
        }
        else {
            catavolt_2.Log.info('');
            catavolt_2.Log.info('Not yet handling display for ' + context.constructor['name']);
            catavolt_2.Log.info('');
            handleContextsFuture = handleContextsFuture.map(function (lastContextResult) {
                return context;
            });
        }
    });
    return handleContextsFuture;
}
function displayMenus(paneContext) {
    catavolt_2.Log.info('----------Menus>>>-------------------------------');
    catavolt_2.Log.info(catavolt_1.ObjUtil.formatRecAttr(paneContext.menuDefs));
    catavolt_2.Log.info('----------<<<Menus-------------------------------');
    return catavolt_3.Future.createSuccessfulFuture('displayMenus', paneContext);
}
function handleListContext(listContext) {
    catavolt_2.Log.info('Handling a ListContext... ');
    listContext.setScroller(10, null, [catavolt_7.QueryMarkerOption.None]);
    var listFuture = listContext.refresh().bind(function (entityRec) {
        catavolt_2.Log.info('Finished refresh');
        displayMenus(listContext);
        var columnHeadings = listContext.listDef.activeColumnDefs.map(function (columnDef) {
            return columnDef.heading;
        });
        catavolt_2.Log.info(columnHeadings.join('|'));
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
        catavolt_2.Log.error("ListContext failed to render with " + failure);
    });
    return listFuture;
}
function scrollThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreForward) {
        catavolt_2.Log.info('The list has more items to display.  Scrolling forward....');
        return getNextPageOfResults(listContext).bind(function (prevPageEntityRecs) {
            return scrollThroughAllResults(listContext);
        });
    }
    else {
        catavolt_2.Log.info('The list has no more items to display.');
        return catavolt_3.Future.createSuccessfulFuture('scrollThroughAllResults', listContext);
    }
}
function scrollBackwardThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreBackward) {
        catavolt_2.Log.info('The list has previous items to display.  Scrolling backward....');
        return getPreviousPageOfResults(listContext).bind(function (prevPageEntityRecs) {
            return scrollBackwardThroughAllResults(listContext);
        });
    }
    else {
        catavolt_2.Log.info('The list has no more previous items to display.');
        return catavolt_3.Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
    }
}
function getNextPageOfResults(listContext) {
    return listContext.scroller.pageForward().map(function (entityRecs) {
        catavolt_2.Log.info('Displaying next page of ' + entityRecs.length + ' records.');
        entityRecs.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function getPreviousPageOfResults(listContext) {
    return listContext.scroller.pageBackward().map(function (entityRecs) {
        catavolt_2.Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
        entityRecs.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function displayListItem(entityRec, listContext) {
    var rowValues = listContext.rowValues(entityRec);
    catavolt_2.Log.info(rowValues.join('|'));
}
function handleDefaultActionForListItem(index, listContext) {
    if (!listContext.listDef.defaultActionId) {
        return catavolt_3.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    }
    var defaultActionMenuDef = new catavolt_10.MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
    var entityRecs = listContext.scroller.buffer;
    if (entityRecs.length === 0)
        return catavolt_3.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    if (entityRecs.length > index) {
        var entityRec = entityRecs[index];
        catavolt_2.Log.info('--------------------------------------------------------------');
        catavolt_2.Log.info('Invoking default action on list item ' + entityRec.objectId);
        catavolt_2.Log.info('--------------------------------------------------------------');
        var targets = [entityRec.objectId];
        return listContext.performMenuAction(defaultActionMenuDef, targets).bind(function (navRequest) {
            return handleNavRequest(navRequest);
        });
    }
    else {
        return catavolt_3.Future.createFailedFuture('handleDefaultActionForListItem', 'Invalid index for listContext');
    }
}
function handleDetailsContext(detailsContext) {
    catavolt_2.Log.info('Handling Details Context...');
    return detailsContext.read().bind(function (entityRec) {
        return layoutDetailsPane(detailsContext).map(function (renderedDetailRows) {
            renderedDetailRows.forEach(function (row) {
                catavolt_2.Log.info('Detail Row: ' + row);
            });
            return renderedDetailRows;
        });
    });
}
function layoutDetailsPane(detailsContext) {
    var allDefsComplete = catavolt_3.Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
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
            catavolt_2.Log.info('Detail row is invalid ' + catavolt_1.ObjUtil.formatRecAttr(cellDefRow));
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
        (row[0].values[0] instanceof catavolt_9.LabelCellValueDef ||
            row[1].values[0] instanceof catavolt_11.ForcedLineCellValueDef) &&
        (row[1].values[0] instanceof catavolt_12.AttributeCellValueDef ||
            row[1].values[0] instanceof catavolt_9.LabelCellValueDef ||
            row[1].values[0] instanceof catavolt_11.ForcedLineCellValueDef);
}
function isSectionTitleDef(row) {
    return row[0].values[0] instanceof catavolt_9.LabelCellValueDef &&
        row[1].values[0] instanceof catavolt_9.LabelCellValueDef;
}
function createTitleRow(row) {
    return '<Label>' + row[0].values[0] + '</Label> : <Label>' + row[1].values[0] + '</Label>';
}
function createEditorRow(row, detailsContext) {
    var labelDef = row[0].values[0];
    var label;
    if (labelDef instanceof catavolt_9.LabelCellValueDef) {
        label = '<Label>' + labelDef.value + '</Label>';
    }
    else {
        label = '<Label>N/A</Label>';
    }
    var valueDef = row[1].values[0];
    if (valueDef instanceof catavolt_12.AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
        return createEditorControl(valueDef, detailsContext).map(function (editorCellString) {
            return label + editorCellString;
        });
    }
    else if (valueDef instanceof catavolt_12.AttributeCellValueDef) {
        var value = "";
        var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
        if (prop && detailsContext.isBinary(valueDef)) {
            value = "<Binary name='" + valueDef.propertyName + "'/>";
        }
        else if (prop) {
            value = '<Label>' + detailsContext.formatForRead(prop.value, prop.name) + '</Label>';
        }
        return catavolt_3.Future.createSuccessfulFuture('createEditorRow', label + ' : ' + value);
    }
    else if (valueDef instanceof catavolt_9.LabelCellValueDef) {
        return catavolt_3.Future.createSuccessfulFuture('createEditorRow', label + ' : <Label>' + valueDef.value + '</Label>');
    }
    else {
        catavolt_3.Future.createSuccessfulFuture('createEditorRow', label + " : ");
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
            return catavolt_3.Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
        }
        else {
            var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
            return catavolt_3.Future.createSuccessfulFuture('createEditorControl', '<TextField>' + value + '</TextField>');
        }
    }
}
//# sourceMappingURL=api.Test.js.map