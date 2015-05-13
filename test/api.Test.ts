///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>

module catavolt.dialog {

    var SERVICE_PATH = "www.catavolt.net";
    var tenantId = "***REMOVED***z";
    var userId = "sales";
    var password = "***REMOVED***";
    var clientType = "LIMITED_ACCESS";

    describe("Api Usage", function () {

        it("Should run API Examples", function (done) {
            loginWithAppContext();
        });

    });

    function loginWithAppContext():Future<any> {

        return AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind(
            (appWinDef:AppWinDef)=>{
                Log.info('Login Succeeded');
                Log.info('AppWinDef: ' + Log.formatRecString(appWinDef));
                Log.info('SessionContext: ' + Log.formatRecString(AppContext.singleton.sessionContextTry.success));
                Log.info('TenantSettings: ' + Log.formatRecString(AppContext.singleton.tenantSettingsTry.success));
                return setupWorkbench().bind((result:any)=>{
                  return null;
                });
            }
        );
    }

    function setupWorkbench():Future<any> {

        var workbenches = AppContext.singleton.appWinDefTry.success.workbenches;

        var launchWorkbenchesFuture:Future<any> = Future.createSuccessfulFuture('startSetupWorkbench', null);
        workbenches.forEach((workbench:Workbench)=>{
            Log.info("Examining Workbench: " + workbench.name);

            //test the first action
            launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=>{
                var launchAction = workbench.workbenchLaunchActions[0];
                Log.info(">>>>> Launching Action: " +  launchAction.name + " Icon: " + launchAction.iconBase);
                return performLaunchAction(launchAction).map((launchActionResult)=>{
                    Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                    return launchActionResult;
                });
            });
            /*
            workbench.workbenchLaunchActions.forEach((launchAction:WorkbenchLaunchAction)=>{
                launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=>{
                    Log.info(">>>>> Launching Action: " +  launchAction.name + " Icon: " + launchAction.iconBase);
                    return performLaunchAction(launchAction).map((launchActionResult)=>{
                        Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                        return launchActionResult;
                    });
                });
            });
            */
        });
        return launchWorkbenchesFuture.map((lastLaunchActionResult)=>{
            Log.info("");
            Log.info("Completed all launch Actions");
            Log.info("");
        });
    }

    function performLaunchAction(launchAction:WorkbenchLaunchAction):Future<any> {

        return AppContext.singleton.performLaunchAction(launchAction).bind((navRequest:NavRequest)=>{
            Log.info("Perform Launch Action " + launchAction.name + ' succeeded. Continuing with NavRequest...');
            return handleNavRequest(navRequest);
        });
    }

    function getLaunchActionByName(name:string, workbenches:Array<Workbench>):Future<any> {
        return null;
    }

    function handleNavRequest(navRequest:NavRequest):Future<any>{
        if(navRequest instanceof FormContext){
            return handleFormContext(navRequest);
        } else {
            Log.error('NavRequest in not a FormContext ' + navRequest.constructor['name']);
            return Future.createFailedFuture('handleNavRequest', 'NavRequest is not a FormContext ' + navRequest.constructor['name']);
        }
    }

    function handleFormContext(formContext:FormContext):Future<any> {
        displayMenus(formContext);
        var handleContextsFuture:Future<any> = Future.createSuccessfulFuture('startHandleContexts', null);
        formContext.childrenContexts.forEach((context:PaneContext)=>{
            Log.info('');
            Log.info('Got a ' + context.constructor['name'] + ' for display');
            Log.info('');
            if(context instanceof ListContext) {
               handleContextsFuture = handleContextsFuture.bind((lastContextResult)=>{
                   return handleListContext(context);
               });
            } else if(context instanceof DetailsContext) {
                handleContextsFuture = handleContextsFuture.bind((lastContextResult)=>{
                    return handleDetailsContext(context);
                });

            } else {
                Log.info('');
                Log.info('Not yet handling display for ' + context.constructor['name']);
                Log.info('');
                handleContextsFuture = handleContextsFuture.map((lastContextResult)=>{ return context });
            }
        });
        return handleContextsFuture;
    }

    function displayMenus(paneContext:PaneContext):Future<any> {
        Log.info('display menus ' + ObjUtil.formatRecAttr(paneContext.menuDefs));
        return null;
    }

    function showMenu(menuDef:MenuDef):Future<any>{
        return null;
    }

    function handleListContext(listContext:ListContext):Future<any> {

        Log.info('Handling a ListContext... ');
        listContext.setScroller(10, null, [QueryMarkerOption.None]);

        var listFuture = listContext.refresh().bind((entityRec:Array<EntityRec>)=>{
            Log.info('Finished refresh');
            displayMenus(listContext);
            var columnHeadings = listContext.listDef.activeColumnDefs.map((columnDef:ColumnDef)=>{
              return columnDef.heading;
            });
            Log.info(columnHeadings.join('|'));
            listContext.scroller.buffer.forEach((entityRec:EntityRec)=>{
               displayListItem(entityRec, listContext);
            });
            return Future.createSuccessfulFuture('handleListContext', listContext);
        });

        listFuture.onFailure((failure)=>{ Log.error("ListContext failed to render with " + failure)});

        return listFuture;

    }

    function displayListItem(entityRec:EntityRec, listContext:ListContext) {
        var rowValues = listContext.rowValues(entityRec);
        Log.info(rowValues.join('|'));
    }

    function handleDetailsContext(detailsContext:DetailsContext):Future<any> {
        return null;
    }





}