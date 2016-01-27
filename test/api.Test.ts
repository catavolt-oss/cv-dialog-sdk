///<reference path="jasmine.d.ts"/>

import {ObjUtil} from './catavolt'
import {Log} from './catavolt'
export {Try} from './catavolt'
export {Success} from './catavolt'
export {Failure} from './catavolt'
import {Future} from './catavolt'
import {AppContext} from './catavolt'
import {AppWinDef} from './catavolt'
import {Workbench} from './catavolt'
import {WorkbenchLaunchAction} from './catavolt'
import {NavRequest} from './catavolt'
import {PaneContext} from './catavolt'
import {FormContext} from './catavolt'
import {ListContext} from './catavolt'
import {QueryMarkerOption} from './catavolt'
import {DetailsContext} from './catavolt'
import {EntityRec} from './catavolt'
import {LabelCellValueDef} from './catavolt'
import {ColumnDef} from './catavolt'
import {MenuDef} from './catavolt'
import {CellDef} from './catavolt'
import {ForcedLineCellValueDef} from './catavolt'
import {AttributeCellValueDef} from './catavolt'

var SERVICE_PATH = "www.catavolt.net";
var tenantId = "***REMOVED***z";
var userId = "sales";
var password = "***REMOVED***";
var clientType = "LIMITED_ACCESS";

describe("Api Usage", function () {

    beforeEach(()=> {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    it("Should run API Examples", function (done) {
        loginWithAppContext();
    });

});

function loginWithAppContext():Future<any> {

    return AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind(
        (appWinDef:AppWinDef)=> {
            Log.info('Login Succeeded');
            Log.info('AppWinDef: ' + Log.formatRecString(appWinDef));
            Log.info('SessionContext: ' + Log.formatRecString(AppContext.singleton.sessionContextTry.success));
            Log.info('TenantSettings: ' + Log.formatRecString(AppContext.singleton.tenantSettingsTry.success));
            return setupWorkbench().bind((result:any)=> {
                Log.info('Competed all workbenches.');
                return null;
            });
        }
    );
}

function setupWorkbench():Future<any> {

    var workbenches = AppContext.singleton.appWinDefTry.success.workbenches;

    var launchWorkbenchesFuture:Future<any> = Future.createSuccessfulFuture('startSetupWorkbench', null);
    workbenches.forEach((workbench:Workbench)=> {
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
        workbench.workbenchLaunchActions.forEach((launchAction:WorkbenchLaunchAction)=> {
            launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=> {
                Log.info(">>>>> Launching Action: " + launchAction.name + " Icon: " + launchAction.iconBase);
                return performLaunchAction(launchAction).map((launchActionResult)=> {
                    Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                    return launchActionResult;
                });
            });
        });
    });
    return launchWorkbenchesFuture.map((lastLaunchActionResult)=> {
        Log.info("");
        Log.info("Completed all launch Actions");
        Log.info("");
    });
}

function performLaunchAction(launchAction:WorkbenchLaunchAction):Future<any> {

    return AppContext.singleton.performLaunchAction(launchAction).bind((navRequest:NavRequest)=> {
        Log.info("Perform Launch Action " + launchAction.name + ' succeeded. Continuing with NavRequest...');
        return handleNavRequest(navRequest);
    });
}

function getLaunchActionByName(name:string, workbenches:Array<Workbench>):Future<any> {
    return null;
}

function handleNavRequest(navRequest:NavRequest):Future<any> {
    if (navRequest instanceof FormContext) {
        return handleFormContext(navRequest);
    } else {
        Log.info('NavRequest in not a FormContext:  ' + navRequest.constructor['name']);
        return Future.createSuccessfulFuture('handleNavRequest', navRequest);
    }
}

function handleFormContext(formContext:FormContext):Future<any> {
    displayMenus(formContext);
    var handleContextsFuture:Future<any> = Future.createSuccessfulFuture('startHandleContexts', null);
    formContext.childrenContexts.forEach((context:PaneContext)=> {
        Log.info('');
        Log.info('Got a ' + context.constructor['name'] + ' for display');
        Log.info('');
        if (context instanceof ListContext) {
            handleContextsFuture = handleContextsFuture.bind((lastContextResult)=> {
                return handleListContext(context);
            });
        } else if (context instanceof DetailsContext) {
            handleContextsFuture = handleContextsFuture.bind((lastContextResult)=> {
                return handleDetailsContext(context);
            });

        } else {
            Log.info('');
            Log.info('Not yet handling display for ' + context.constructor['name']);
            Log.info('');
            handleContextsFuture = handleContextsFuture.map((lastContextResult)=> {
                return context
            });
        }
    });
    return handleContextsFuture;
}

function displayMenus(paneContext:PaneContext):Future<any> {
    Log.info('----------Menus>>>-------------------------------')
    Log.info(ObjUtil.formatRecAttr(paneContext.menuDefs));
    Log.info('----------<<<Menus-------------------------------')
    return Future.createSuccessfulFuture('displayMenus', paneContext);
}

function handleListContext(listContext:ListContext):Future<any> {

    Log.info('Handling a ListContext... ');
    listContext.setScroller(10, null, [QueryMarkerOption.None]);

    var listFuture = listContext.refresh().bind((entityRec:Array<EntityRec>)=> {
        Log.info('Finished refresh');
        displayMenus(listContext);
        var columnHeadings = listContext.listDef.activeColumnDefs.map((columnDef:ColumnDef)=> {
            return columnDef.heading;
        });
        Log.info(columnHeadings.join('|'));
        listContext.scroller.buffer.forEach((entityRec:EntityRec)=> {
            displayListItem(entityRec, listContext);
        });

        var scrollResultsFuture = scrollThroughAllResults(listContext).bind((scrollResult)=> {
            return scrollBackwardThroughAllResults(listContext);
        });

        return scrollResultsFuture.bind((result)=> {
            return handleDefaultActionForListItem(0, listContext);
        })
    });

    listFuture.onFailure((failure)=> {
        Log.error("ListContext failed to render with " + failure)
    });

    return listFuture;

}

function scrollThroughAllResults(listContext:ListContext):Future<any> {
    if (listContext.scroller.hasMoreForward) {
        Log.info('The list has more items to display.  Scrolling forward....');
        return getNextPageOfResults(listContext).bind((prevPageEntityRecs:Array<EntityRec>)=> {
            return scrollThroughAllResults(listContext);
        });
    } else {
        Log.info('The list has no more items to display.');
        return Future.createSuccessfulFuture('scrollThroughAllResults', listContext);
    }
}

function scrollBackwardThroughAllResults(listContext:ListContext):Future<any> {
    if (listContext.scroller.hasMoreBackward) {
        Log.info('The list has previous items to display.  Scrolling backward....');
        return getPreviousPageOfResults(listContext).bind((prevPageEntityRecs:Array<EntityRec>)=> {
            return scrollBackwardThroughAllResults(listContext);
        });
    } else {
        Log.info('The list has no more previous items to display.');
        return Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
    }
}


function getNextPageOfResults(listContext:ListContext):Future<any> {
    return listContext.scroller.pageForward().map((entityRecs:Array<EntityRec>)=> {
        Log.info('Displaying next page of ' + entityRecs.length + ' records.');
        entityRecs.forEach((entityRec)=> {
            displayListItem(entityRec, listContext)
        });
        return entityRecs;
    });
}

function getPreviousPageOfResults(listContext:ListContext):Future<any> {
    return listContext.scroller.pageBackward().map((entityRecs:Array<EntityRec>)=> {
        Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
        entityRecs.forEach((entityRec)=> {
            displayListItem(entityRec, listContext)
        });
        return entityRecs;
    });
}

function displayListItem(entityRec:EntityRec, listContext:ListContext) {
    var rowValues = listContext.rowValues(entityRec);
    Log.info(rowValues.join('|'));
}

function handleDefaultActionForListItem(index:number, listContext:ListContext):Future<any> {

    if (!listContext.listDef.defaultActionId) {
        return Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    }

    var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW',
        listContext.listDef.defaultActionId, null, null, []);

    var entityRecs = listContext.scroller.buffer;
    if (entityRecs.length === 0) return Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    if (entityRecs.length > index) {
        var entityRec = entityRecs[index];
        Log.info('--------------------------------------------------------------');
        Log.info('Invoking default action on list item ' + entityRec.objectId);
        Log.info('--------------------------------------------------------------');
        var targets = [entityRec.objectId];
        return listContext.performMenuAction(defaultActionMenuDef, targets).bind((navRequest)=> {
            return handleNavRequest(navRequest);
        });
    } else {
        return Future.createFailedFuture('handleDefaultActionForListItem', 'Invalid index for listContext');
    }
}

function handleDetailsContext(detailsContext:DetailsContext):Future<Array<string>> {
    Log.info('Handling Details Context...');
    return detailsContext.read().bind((entityRec)=> {
        return layoutDetailsPane(detailsContext).map((renderedDetailRows)=> {
            renderedDetailRows.forEach((row)=> {
                Log.info('Detail Row: ' + row);
            });
            return renderedDetailRows;
        });
    });

}

function layoutDetailsPane(detailsContext:DetailsContext):Future<Array<string>> {

    var allDefsComplete = Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
    var renderedDetailRows:Array<string> = [];
    detailsContext.detailsDef.rows.forEach((cellDefRow)=> {
        if (isValidDetailsDefRow(cellDefRow)) {
            if (isSectionTitleDef(cellDefRow)) {
                allDefsComplete = allDefsComplete.map((lastRowResult)=> {
                    var titleRow = createTitleRow(cellDefRow);
                    renderedDetailRows.push(titleRow);
                    return titleRow;
                });
            } else {
                allDefsComplete = allDefsComplete.bind((lastRowResult)=> {
                    return createEditorRow(cellDefRow, detailsContext).map((editorRow)=> {
                        renderedDetailRows.push(editorRow);
                        return editorRow;
                    });
                });
            }
        } else {
            Log.info('Detail row is invalid ' + ObjUtil.formatRecAttr(cellDefRow));
        }
    });

    return allDefsComplete.map((lastRowResult)=> {
        return renderedDetailRows;
    });
}

function isValidDetailsDefRow(row:Array<CellDef>) {
    return row.length === 2 &&
        row[0].values.length === 1 &&
        row[1].values.length === 1 &&
        (row[0].values[0] instanceof LabelCellValueDef ||
        row[1].values[0] instanceof ForcedLineCellValueDef) &&
        (row[1].values[0] instanceof AttributeCellValueDef ||
        row[1].values[0] instanceof LabelCellValueDef ||
        row[1].values[0] instanceof ForcedLineCellValueDef);
}

function isSectionTitleDef(row:Array<CellDef>):boolean {
    return row[0].values[0] instanceof LabelCellValueDef &&
        row[1].values[0] instanceof LabelCellValueDef;
}

function createTitleRow(row:Array<CellDef>):string {
    return '<Label>' + row[0].values[0] + '</Label> : <Label>' + row[1].values[0] + '</Label>';
}

function createEditorRow(row:Array<CellDef>, detailsContext:DetailsContext):Future<string> {
    var labelDef = row[0].values[0];
    var label;
    if (labelDef instanceof LabelCellValueDef) {
        label = '<Label>' + labelDef.value + '</Label>';
    } else {
        label = '<Label>N/A</Label>';
    }

    var valueDef = row[1].values[0];
    if (valueDef instanceof AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
        return createEditorControl(valueDef, detailsContext).map((editorCellString)=> {
            return label + editorCellString;
        });
    } else if (valueDef instanceof AttributeCellValueDef) {
        var value = "";
        var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
        if (prop && detailsContext.isBinary(valueDef)) {
            value = "<Binary name='" + valueDef.propertyName + "'/>";
        } else if (prop) {
            value = '<Label>' + detailsContext.formatForRead(prop.value, prop.name) + '</Label>';
        }

        return Future.createSuccessfulFuture('createEditorRow', label + ' : ' + value);
    } else if (valueDef instanceof LabelCellValueDef) {
        return Future.createSuccessfulFuture('createEditorRow', label + ' : <Label>' + valueDef.value + '</Label>');
    } else {
        Future.createSuccessfulFuture('createEditorRow', label + " : ");
    }

}

function createEditorControl(attributeDef:AttributeCellValueDef, detailsContext:DetailsContext):Future<string> {
    if (attributeDef.isComboBoxEntryMethod) {
        return detailsContext.getAvailableValues(attributeDef.propertyName).map((values)=> {
            return '<ComboBox>' + values.join(", ") + '</ComboBox>';
        });
    } else if (attributeDef.isDropDownEntryMethod) {
        return detailsContext.getAvailableValues(attributeDef.propertyName).map((values)=> {
            return '<DropDown>' + values.join(", ") + '</DropDown>';
        });
    } else {
        var entityRec = detailsContext.buffer;
        var prop = entityRec.propAtName(attributeDef.propertyName);
        if (prop && detailsContext.isBinary(attributeDef)) {
            return Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
        } else {
            var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
            return Future.createSuccessfulFuture('createEditorControl', '<TextField>' + value + '</TextField>');
        }
    }
}
