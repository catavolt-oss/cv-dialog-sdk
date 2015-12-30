/**
 * Created by rburson on 5/5/15.
 */
///<reference path="../../../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var ng;
    (function (ng) {
        var LoginController = (function () {
            function LoginController($scope, $location, $rootScope, $timeout, Catavolt) {
                //prefill the form for now...
                $scope.creds = { tenantId: '***REMOVED***z', gatewayUrl: 'www.catavolt.net',
                    userId: 'sales', password: '***REMOVED***', clientType: 'LIMITED_ACCESS' };
                $scope.loginMessage = "";
                $scope.loggingIn = false;
                $scope.loggedIn = Catavolt.isLoggedIn;
                $scope.login = function (creds) {
                    $scope.loginMessage = "";
                    $scope.loggingIn = true;
                    if (Catavolt.loggedIn) {
                        $scope.loggedIn = Catavolt.isLoggedIn;
                        $location.path('/main');
                    }
                    else {
                        Catavolt.login(creds.gatewayUrl, creds.tenantId, creds.clientType, creds.userId, creds.password)
                            .onComplete(function (appWinDefTry) {
                            $rootScope.$apply(function () {
                                $scope.loggingIn = false;
                                if (appWinDefTry.isFailure) {
                                    $scope.loginMessage = "Invalid Login";
                                    $scope.loggedIn = Catavolt.isLoggedIn;
                                }
                                else {
                                    $scope.loggedIn = Catavolt.isLoggedIn;
                                    $timeout(function () {
                                        $location.path('/main');
                                    }, 800);
                                }
                            });
                        });
                    }
                };
            }
            return LoginController;
        })();
        ng.LoginController = LoginController;
    })(ng = catavolt.ng || (catavolt.ng = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/6/15.
 */
///<reference path="../../../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var ng;
    (function (ng) {
        var WorkbenchController = (function () {
            function WorkbenchController($scope, $location, $rootScope, $timeout, Catavolt) {
                $scope.launchActions = [];
                var workbenches = Catavolt.appWinDefTry.success.workbenches;
                var launchActions = workbenches.length ? workbenches[0].workbenchLaunchActions : [];
                //preload images
                var loader = new PxLoader();
                loader.addCompletionListener(function () {
                    addLaunchers(launchActions);
                });
                for (var i = 0; i < launchActions.length; i++) {
                    loader.addImage(launchActions[i].iconBase);
                }
                loader.start();
                function addLaunchers(launchActions) {
                    launchActions.forEach(function (item, i) {
                        $timeout(function () {
                            $scope.launchActions.push(item);
                        }, i * 200);
                    });
                }
                $scope.performLaunchAction = function (launchAction) {
                    Catavolt.performLaunchAction(launchAction).onComplete(function (launchTry) {
                        if (launchTry.isFailure) {
                            alert('Handle Launch Failure!');
                            Log.error(launchTry.failure);
                        }
                        else {
                            if (launchTry.success instanceof FormContext) {
                                Log.info('Succeded with ' + launchTry.success);
                            }
                            else {
                                alert('Unhandled type of NavRequest ' + launchTry.success);
                            }
                        }
                    });
                };
            }
            return WorkbenchController;
        })();
        ng.WorkbenchController = WorkbenchController;
    })(ng = catavolt.ng || (catavolt.ng = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
//ng
///<reference path="LoginController.ts"/>
///<reference path="WorkbenchController.ts"/>
/**
 * Created by rburson on 5/6/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="references.ts"/>
var catavolt;
(function (catavolt) {
    var ng;
    (function (ng) {
        var PaneController = (function () {
            function PaneController($scope, $location, $rootScope, $timeout, Catavolt) {
            }
            return PaneController;
        })();
        ng.PaneController = PaneController;
        var FormController = (function (_super) {
            __extends(FormController, _super);
            function FormController($scope, $location, $rootScope, $timeout, Catavolt) {
                _super.call(this, $scope, $location, $rootScope, $timeout, Catavolt);
            }
            return FormController;
        })(PaneController);
        ng.FormController = FormController;
    })(ng = catavolt.ng || (catavolt.ng = {}));
})(catavolt || (catavolt = {}));
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
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
            return AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind(function (appWinDef) {
                Log.info('Login Succeeded');
                Log.info('AppWinDef: ' + Log.formatRecString(appWinDef));
                Log.info('SessionContext: ' + Log.formatRecString(AppContext.singleton.sessionContextTry.success));
                Log.info('TenantSettings: ' + Log.formatRecString(AppContext.singleton.tenantSettingsTry.success));
                return setupWorkbench().bind(function (result) {
                    Log.info('Competed all workbenches.');
                    return null;
                });
            });
        }
        function setupWorkbench() {
            var workbenches = AppContext.singleton.appWinDefTry.success.workbenches;
            var launchWorkbenchesFuture = Future.createSuccessfulFuture('startSetupWorkbench', null);
            workbenches.forEach(function (workbench) {
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
                workbench.workbenchLaunchActions.forEach(function (launchAction) {
                    launchWorkbenchesFuture = launchWorkbenchesFuture.bind(function (lastResult) {
                        Log.info(">>>>> Launching Action: " + launchAction.name + " Icon: " + launchAction.iconBase);
                        return performLaunchAction(launchAction).map(function (launchActionResult) {
                            Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                            return launchActionResult;
                        });
                    });
                });
            });
            return launchWorkbenchesFuture.map(function (lastLaunchActionResult) {
                Log.info("");
                Log.info("Completed all launch Actions");
                Log.info("");
            });
        }
        function performLaunchAction(launchAction) {
            return AppContext.singleton.performLaunchAction(launchAction).bind(function (navRequest) {
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
            formContext.childrenContexts.forEach(function (context) {
                Log.info('');
                Log.info('Got a ' + context.constructor['name'] + ' for display');
                Log.info('');
                if (context instanceof ListContext) {
                    handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                        return handleListContext(context);
                    });
                }
                else if (context instanceof DetailsContext) {
                    handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                        return handleDetailsContext(context);
                    });
                }
                else {
                    Log.info('');
                    Log.info('Not yet handling display for ' + context.constructor['name']);
                    Log.info('');
                    handleContextsFuture = handleContextsFuture.map(function (lastContextResult) { return context; });
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
            var listFuture = listContext.refresh().bind(function (entityRec) {
                Log.info('Finished refresh');
                displayMenus(listContext);
                var columnHeadings = listContext.listDef.activeColumnDefs.map(function (columnDef) {
                    return columnDef.heading;
                });
                Log.info(columnHeadings.join('|'));
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
            listFuture.onFailure(function (failure) { Log.error("ListContext failed to render with " + failure); });
            return listFuture;
        }
        function scrollThroughAllResults(listContext) {
            if (listContext.scroller.hasMoreForward) {
                Log.info('The list has more items to display.  Scrolling forward....');
                return getNextPageOfResults(listContext).bind(function (prevPageEntityRecs) {
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
                return getPreviousPageOfResults(listContext).bind(function (prevPageEntityRecs) {
                    return scrollBackwardThroughAllResults(listContext);
                });
            }
            else {
                Log.info('The list has no more previous items to display.');
                return Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
            }
        }
        function getNextPageOfResults(listContext) {
            return listContext.scroller.pageForward().map(function (entityRecs) {
                Log.info('Displaying next page of ' + entityRecs.length + ' records.');
                entityRecs.forEach(function (entityRec) { displayListItem(entityRec, listContext); });
                return entityRecs;
            });
        }
        function getPreviousPageOfResults(listContext) {
            return listContext.scroller.pageBackward().map(function (entityRecs) {
                Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
                entityRecs.forEach(function (entityRec) { displayListItem(entityRec, listContext); });
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
                return listContext.performMenuAction(defaultActionMenuDef, targets).bind(function (navRequest) {
                    return handleNavRequest(navRequest);
                });
            }
            else {
                return Future.createFailedFuture('handleDefaultActionForListItem', 'Invalid index for listContext');
            }
        }
        function handleDetailsContext(detailsContext) {
            Log.info('Handling Details Context...');
            return detailsContext.read().bind(function (entityRec) {
                return layoutDetailsPane(detailsContext).map(function (renderedDetailRows) {
                    renderedDetailRows.forEach(function (row) {
                        Log.info('Detail Row: ' + row);
                    });
                    return renderedDetailRows;
                });
            });
        }
        function layoutDetailsPane(detailsContext) {
            var allDefsComplete = Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
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
                    Log.info('Detail row is invalid ' + ObjUtil.formatRecAttr(cellDefRow));
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
                return createEditorControl(valueDef, detailsContext).map(function (editorCellString) {
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
                    return Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
                }
                else {
                    var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
                    return Future.createSuccessfulFuture('createEditorControl', '<TextField>' + value + '</TextField>');
                }
            }
        }
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/19/15.
 */
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SERVICE_PATH = "www.catavolt.net";
        var tenantId = "***REMOVED***z";
        var userId = "sales";
        var password = "***REMOVED***";
        var clientType = "LIMITED_ACCESS";
        xdescribe("AppContext::login", function () {
            it("should login successfully with valid creds", function (done) {
                AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).onComplete(function (appWinDefTry) {
                    Log.info(Log.formatRecString(appWinDefTry));
                    Log.info(Log.formatRecString(AppContext.singleton.sessionContextTry));
                    Log.info(Log.formatRecString(AppContext.singleton.tenantSettingsTry));
                    expect(AppContext.singleton.appWinDefTry.success.workbenches.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
        xdescribe("AppContext::performLaunchAction", function () {
            it("should peform launch action successfully", function (done) {
                var launchAction = AppContext.singleton.appWinDefTry.success.workbenches[0].workbenchLaunchActions[0];
                AppContext.singleton.performLaunchAction(launchAction).onComplete(function (navRequestTry) {
                    Log.debug("completed with: " + navRequestTry);
                    if (navRequestTry.isFailure) {
                        Log.debug(navRequestTry.failure);
                    }
                    expect(navRequestTry.isSuccess).toBeTruthy();
                    done();
                });
            });
        });
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        xdescribe("Future", function () {
            it("should be created successfully with Try", function () {
                var f = Future.createCompletedFuture("test", new Success("successfulValue"));
            });
        });
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/11/15.
 */
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var ws;
    (function (ws) {
        xdescribe("Request::XMLHttpClient", function () {
            it("Should get endpoint successfully", function (done) {
                var SERVICE_PATH = "https://www.catavolt.net/***REMOVED***/soi-json";
                var client = new XMLHttpClient();
                var f = client.jsonGet(SERVICE_PATH, 30000);
                f.onComplete(function (t) {
                    expect(t.isSuccess).toBe(true);
                    var endPoint = t.success;
                    expect(endPoint.responseType).toBe('soi-json');
                    done();
                });
            });
        });
    })(ws = catavolt.ws || (catavolt.ws = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
///<reference path="fp.Test.ts"/>
///<reference path="ws.Test.ts"/>
///<reference path="dialog.Test.ts"/>
///<reference path="api.Test.ts"/>
//# sourceMappingURL=catavolt_sdk.js.map