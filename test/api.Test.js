///<reference path="jasmine.d.ts"/>
import { ObjUtil } from '../src/catavolt';
import { Log } from '../src/catavolt';
import { Future } from '../src/catavolt';
import { AppContext } from '../src/catavolt';
import { FormContext } from '../src/catavolt';
import { ListContext } from '../src/catavolt';
import { QueryMarkerOption } from '../src/catavolt';
import { DetailsContext } from '../src/catavolt';
import { LabelCellValueDef } from '../src/catavolt';
import { MenuDef } from '../src/catavolt';
import { ForcedLineCellValueDef } from '../src/catavolt';
import { AttributeCellValueDef } from '../src/catavolt';
var SERVICE_PATH = "www.catavolt.net";
var tenantId = "***REMOVED***z";
var userId = "sales";
var password = "***REMOVED***";
var clientType = "LIMITED_ACCESS";
describe("Api Usage", function () {
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });
    it("Should run API Examples", function (done) {
        loginWithAppContext();
    });
});
function loginWithAppContext() {
    return AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind((appWinDef) => {
        Log.info('Login Succeeded');
        Log.info('AppWinDef: ' + Log.formatRecString(appWinDef));
        Log.info('SessionContext: ' + Log.formatRecString(AppContext.singleton.sessionContextTry.success));
        Log.info('TenantSettings: ' + Log.formatRecString(AppContext.singleton.tenantSettingsTry.success));
        return setupWorkbench().bind((result) => {
            Log.info('Competed all workbenches.');
            return null;
        });
    });
}
function setupWorkbench() {
    var workbenches = AppContext.singleton.appWinDefTry.success.workbenches;
    var launchWorkbenchesFuture = Future.createSuccessfulFuture('startSetupWorkbench', null);
    workbenches.forEach((workbench) => {
        Log.info("Examining Workbench: " + workbench.name);
        //test the first action
        /*launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=>{
         var launchAction = workbench.workbenchLaunchActions[0];
         Log.info(">>>>> Launching Action: " +  launchAction.name + " Icon: " + launchAction.iconBase);
         return performLaunchAction(launchAction).map((launchActionResult)=>{
         Log.info('<<<<< Completed Launch Action ' + launchAction.name);
         return launchActionResult;
         });
         });*/
        workbench.workbenchLaunchActions.forEach((launchAction) => {
            launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult) => {
                Log.info(">>>>> Launching Action: " + launchAction.name + " Icon: " + launchAction.iconBase);
                return performLaunchAction(launchAction).map((launchActionResult) => {
                    Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                    return launchActionResult;
                });
            });
        });
    });
    return launchWorkbenchesFuture.map((lastLaunchActionResult) => {
        Log.info("");
        Log.info("Completed all launch Actions");
        Log.info("");
    });
}
function performLaunchAction(launchAction) {
    return AppContext.singleton.performLaunchAction(launchAction).bind((navRequest) => {
        Log.info("Perform Launch Action " + launchAction.name + ' succeeded. Continuing with NavRequest...');
        return handleNavRequest(navRequest);
    });
}
function getLaunchActionByName(name, workbenches) {
    return null;
}
function handleNavRequest(navRequest) {
    if (navRequest instanceof FormContext) {
        return handleFormContext(navRequest);
    }
    else {
        Log.info('NavRequest in not a FormContext:  ' + navRequest.constructor['name']);
        return Future.createSuccessfulFuture('handleNavRequest', navRequest);
    }
}
function handleFormContext(formContext) {
    displayMenus(formContext);
    var handleContextsFuture = Future.createSuccessfulFuture('startHandleContexts', null);
    formContext.childrenContexts.forEach((context) => {
        Log.info('');
        Log.info('Got a ' + context.constructor['name'] + ' for display');
        Log.info('');
        if (context instanceof ListContext) {
            handleContextsFuture = handleContextsFuture.bind((lastContextResult) => {
                return handleListContext(context);
            });
        }
        else if (context instanceof DetailsContext) {
            handleContextsFuture = handleContextsFuture.bind((lastContextResult) => {
                return handleDetailsContext(context);
            });
        }
        else {
            Log.info('');
            Log.info('Not yet handling display for ' + context.constructor['name']);
            Log.info('');
            handleContextsFuture = handleContextsFuture.map((lastContextResult) => {
                return context;
            });
        }
    });
    return handleContextsFuture;
}
function displayMenus(paneContext) {
    Log.info('----------Menus>>>-------------------------------');
    Log.info(ObjUtil.formatRecAttr(paneContext.menuDefs));
    Log.info('----------<<<Menus-------------------------------');
    return Future.createSuccessfulFuture('displayMenus', paneContext);
}
function handleListContext(listContext) {
    Log.info('Handling a ListContext... ');
    listContext.setScroller(10, null, [QueryMarkerOption.None]);
    var listFuture = listContext.refresh().bind((entityRec) => {
        Log.info('Finished refresh');
        displayMenus(listContext);
        var columnHeadings = listContext.listDef.activeColumnDefs.map((columnDef) => {
            return columnDef.heading;
        });
        Log.info(columnHeadings.join('|'));
        listContext.scroller.buffer.forEach((entityRec) => {
            displayListItem(entityRec, listContext);
        });
        var scrollResultsFuture = scrollThroughAllResults(listContext).bind((scrollResult) => {
            return scrollBackwardThroughAllResults(listContext);
        });
        return scrollResultsFuture.bind((result) => {
            return handleDefaultActionForListItem(0, listContext);
        });
    });
    listFuture.onFailure((failure) => {
        Log.error("ListContext failed to render with " + failure);
    });
    return listFuture;
}
function scrollThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreForward) {
        Log.info('The list has more items to display.  Scrolling forward....');
        return getNextPageOfResults(listContext).bind((prevPageEntityRecs) => {
            return scrollThroughAllResults(listContext);
        });
    }
    else {
        Log.info('The list has no more items to display.');
        return Future.createSuccessfulFuture('scrollThroughAllResults', listContext);
    }
}
function scrollBackwardThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreBackward) {
        Log.info('The list has previous items to display.  Scrolling backward....');
        return getPreviousPageOfResults(listContext).bind((prevPageEntityRecs) => {
            return scrollBackwardThroughAllResults(listContext);
        });
    }
    else {
        Log.info('The list has no more previous items to display.');
        return Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
    }
}
function getNextPageOfResults(listContext) {
    return listContext.scroller.pageForward().map((entityRecs) => {
        Log.info('Displaying next page of ' + entityRecs.length + ' records.');
        entityRecs.forEach((entityRec) => {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function getPreviousPageOfResults(listContext) {
    return listContext.scroller.pageBackward().map((entityRecs) => {
        Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
        entityRecs.forEach((entityRec) => {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function displayListItem(entityRec, listContext) {
    var rowValues = listContext.rowValues(entityRec);
    Log.info(rowValues.join('|'));
}
function handleDefaultActionForListItem(index, listContext) {
    if (!listContext.listDef.defaultActionId) {
        return Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    }
    var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
    var entityRecs = listContext.scroller.buffer;
    if (entityRecs.length === 0)
        return Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    if (entityRecs.length > index) {
        var entityRec = entityRecs[index];
        Log.info('--------------------------------------------------------------');
        Log.info('Invoking default action on list item ' + entityRec.objectId);
        Log.info('--------------------------------------------------------------');
        var targets = [entityRec.objectId];
        return listContext.performMenuAction(defaultActionMenuDef, targets).bind((navRequest) => {
            return handleNavRequest(navRequest);
        });
    }
    else {
        return Future.createFailedFuture('handleDefaultActionForListItem', 'Invalid index for listContext');
    }
}
function handleDetailsContext(detailsContext) {
    Log.info('Handling Details Context...');
    return detailsContext.read().bind((entityRec) => {
        return layoutDetailsPane(detailsContext).map((renderedDetailRows) => {
            renderedDetailRows.forEach((row) => {
                Log.info('Detail Row: ' + row);
            });
            return renderedDetailRows;
        });
    });
}
function layoutDetailsPane(detailsContext) {
    var allDefsComplete = Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
    var renderedDetailRows = [];
    detailsContext.detailsDef.rows.forEach((cellDefRow) => {
        if (isValidDetailsDefRow(cellDefRow)) {
            if (isSectionTitleDef(cellDefRow)) {
                allDefsComplete = allDefsComplete.map((lastRowResult) => {
                    var titleRow = createTitleRow(cellDefRow);
                    renderedDetailRows.push(titleRow);
                    return titleRow;
                });
            }
            else {
                allDefsComplete = allDefsComplete.bind((lastRowResult) => {
                    return createEditorRow(cellDefRow, detailsContext).map((editorRow) => {
                        renderedDetailRows.push(editorRow);
                        return editorRow;
                    });
                });
            }
        }
        else {
            Log.info('Detail row is invalid ' + ObjUtil.formatRecAttr(cellDefRow));
        }
    });
    return allDefsComplete.map((lastRowResult) => {
        return renderedDetailRows;
    });
}
function isValidDetailsDefRow(row) {
    return row.length === 2 &&
        row[0].values.length === 1 &&
        row[1].values.length === 1 &&
        (row[0].values[0] instanceof LabelCellValueDef ||
            row[1].values[0] instanceof ForcedLineCellValueDef) &&
        (row[1].values[0] instanceof AttributeCellValueDef ||
            row[1].values[0] instanceof LabelCellValueDef ||
            row[1].values[0] instanceof ForcedLineCellValueDef);
}
function isSectionTitleDef(row) {
    return row[0].values[0] instanceof LabelCellValueDef &&
        row[1].values[0] instanceof LabelCellValueDef;
}
function createTitleRow(row) {
    return '<Label>' + row[0].values[0] + '</Label> : <Label>' + row[1].values[0] + '</Label>';
}
function createEditorRow(row, detailsContext) {
    var labelDef = row[0].values[0];
    var label;
    if (labelDef instanceof LabelCellValueDef) {
        label = '<Label>' + labelDef.value + '</Label>';
    }
    else {
        label = '<Label>N/A</Label>';
    }
    var valueDef = row[1].values[0];
    if (valueDef instanceof AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
        return createEditorControl(valueDef, detailsContext).map((editorCellString) => {
            return label + editorCellString;
        });
    }
    else if (valueDef instanceof AttributeCellValueDef) {
        var value = "";
        var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
        if (prop && detailsContext.isBinary(valueDef)) {
            value = "<Binary name='" + valueDef.propertyName + "'/>";
        }
        else if (prop) {
            value = '<Label>' + detailsContext.formatForRead(prop.value, prop.name) + '</Label>';
        }
        return Future.createSuccessfulFuture('createEditorRow', label + ' : ' + value);
    }
    else if (valueDef instanceof LabelCellValueDef) {
        return Future.createSuccessfulFuture('createEditorRow', label + ' : <Label>' + valueDef.value + '</Label>');
    }
    else {
        Future.createSuccessfulFuture('createEditorRow', label + " : ");
    }
}
function createEditorControl(attributeDef, detailsContext) {
    if (attributeDef.isComboBoxEntryMethod) {
        return detailsContext.getAvailableValues(attributeDef.propertyName).map((values) => {
            return '<ComboBox>' + values.join(", ") + '</ComboBox>';
        });
    }
    else if (attributeDef.isDropDownEntryMethod) {
        return detailsContext.getAvailableValues(attributeDef.propertyName).map((values) => {
            return '<DropDown>' + values.join(", ") + '</DropDown>';
        });
    }
    else {
        var entityRec = detailsContext.buffer;
        var prop = entityRec.propAtName(attributeDef.propertyName);
        if (prop && detailsContext.isBinary(attributeDef)) {
            return Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
        }
        else {
            var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
            return Future.createSuccessfulFuture('createEditorControl', '<TextField>' + value + '</TextField>');
        }
    }
}
//# sourceMappingURL=api.Test.js.map