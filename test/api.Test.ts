///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>

module catavolt.dialog {

    var SERVICE_PATH = "www.catavolt.net";
    var tenantId = "***REMOVED***z";
    var userId = "sales";
    var password = "***REMOVED***";
    var clientType = "LIMITED_ACCESS";

    describe("Api Usage", function () {

        beforeEach(()=>{
          jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        });

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
                    Log.info('Competed all workbenches.');
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

            /*
            //test the first action
            launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=>{
                var launchAction = workbench.workbenchLaunchActions[0];
                Log.info(">>>>> Launching Action: " +  launchAction.name + " Icon: " + launchAction.iconBase);
                return performLaunchAction(launchAction).map((launchActionResult)=>{
                    Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                    return launchActionResult;
                });
            });*/
            workbench.workbenchLaunchActions.forEach((launchAction:WorkbenchLaunchAction)=>{
                launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=>{
                    Log.info(">>>>> Launching Action: " +  launchAction.name + " Icon: " + launchAction.iconBase);
                    return performLaunchAction(launchAction).map((launchActionResult)=>{
                        Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                        return launchActionResult;
                    });
                });
            });
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

            return scrollThroughAllResults(listContext).bind((scrollResult)=>{
                return scrollBackwardThroughAllResults(listContext);
            });

            //return Future.createSuccessfulFuture('handleListContext', listContext);
        });

        listFuture.onFailure((failure)=>{ Log.error("ListContext failed to render with " + failure)});

        return listFuture;

    }

    function scrollThroughAllResults(listContext:ListContext):Future<any> {
       if(listContext.scroller.hasMoreForward) {
           Log.info('The list has more items to display.  Scrolling forward....');
           return getNextPageOfResults(listContext).bind((prevPageEntityRecs:Array<EntityRec>)=>{
               return scrollThroughAllResults(listContext);
           });
       } else {
           Log.info('The list has no more items to display.');
           return Future.createSuccessfulFuture('scrollThroughAllResults', listContext);
       }
    }

    function scrollBackwardThroughAllResults(listContext:ListContext):Future<any> {
        if(listContext.scroller.hasMoreBackward) {
            Log.info('The list has previous items to display.  Scrolling backward....');
            return getPreviousPageOfResults(listContext).bind((prevPageEntityRecs:Array<EntityRec>)=>{
                return scrollBackwardThroughAllResults(listContext);
            });
        } else {
            Log.info('The list has no more previous items to display.');
            return Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
        }
    }


    function getNextPageOfResults(listContext:ListContext):Future<any> {
       return listContext.scroller.pageForward().map((entityRecs:Array<EntityRec>)=>{
           Log.info('Displaying next page of ' + entityRecs.length + ' records.');
           entityRecs.forEach((entityRec)=>{ displayListItem(entityRec, listContext)});
           return entityRecs;
       });
    }

    function getPreviousPageOfResults(listContext:ListContext):Future<any> {
        return listContext.scroller.pageBackward().map((entityRecs:Array<EntityRec>)=>{
            Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
            entityRecs.forEach((entityRec)=>{ displayListItem(entityRec, listContext)});
            return entityRecs;
        });
    }

    function displayListItem(entityRec:EntityRec, listContext:ListContext) {
        var rowValues = listContext.rowValues(entityRec);
        Log.info(rowValues.join('|'));
    }

    function handleDetailsContext(detailsContext:DetailsContext):Future<any> {
        return null;
    }





}