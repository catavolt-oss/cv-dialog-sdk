/**
 * Created by rburson on 9/1/17.
 */

import test from "blue-tape";

import {Catavolt, propertyFormatter} from "../../catavolt/dialog/Catavolt";
import {LargeProperty, PropertyDef} from "../../catavolt/models";
import {Cell} from "../../catavolt/models/Cell";
import {CellValue} from "../../catavolt/models/CellValue";
import {Details} from "../../catavolt/models/Details";
import {Dialog} from "../../catavolt/models/Dialog";
import {DialogRedirection} from "../../catavolt/models/DialogRedirection";
import {EditorDialog} from "../../catavolt/models/EditorDialog";
import {List} from "../../catavolt/models/List";
import {Property} from "../../catavolt/models/Property";
import {QueryDialog} from "../../catavolt/models/QueryDialog";
import {Record} from "../../catavolt/models/Record";
import {Redirection} from "../../catavolt/models/Redirection";
import {RedirectionUtil} from "../../catavolt/models/RedirectionUtil";
import {Session} from "../../catavolt/models/Session";
import {TypeNames} from "../../catavolt/models/types";
import {Workbench} from "../../catavolt/models/Workbench";
import {Log} from "../../catavolt/util/Log";
import {LogLevel} from "../../catavolt/util/Log";

/*
    Get a reference to the SDK instance
 */
/* tslint:disable */
let [tenantId, userId, password, sessionId, workbenchId, workbenchLaunchId] =
    ['', '', '', null, 'AAABACffAAAAAE8X', 'AAABACfaAAAAAKE8'];

const currentWorkbenches:Array<Workbench> = null;
let currentRedirection:Redirection = null;
let currentDialog:Dialog = null;

Log.logLevel(LogLevel.DEBUG);

test("Invalid Login Test", (t) => {

    return t.shouldFail(Catavolt.login(tenantId, 'DESKTOP', userId, 'not a valid password')
        .catch(error=>{
            //show the error we are expecting
            t.comment(`> ${JSON.stringify(error)}`);
            throw error;
        }));
});

test("Login Test", (t) => {

    return Catavolt.login(tenantId, 'DESKTOP', userId, password).then((session:Session)=>{

        t.ok(session, 'Expecting a non-null result');
        t.ok(session.id, 'Expecting a session id');
        t.comment(`> SessionId: ${session.id}`);
        sessionId = session.id;
        return session;

    });

});

test("Launch Workbench By id Test", (t) => {

    return Catavolt.performWorkbenchActionForId(workbenchId, workbenchLaunchId)
        .then((successOrRedirection:{actionId} | Redirection)=>{

            t.ok(successOrRedirection, 'Expecting a non-null result');
            t.ok(RedirectionUtil.isDialogRedirection(successOrRedirection), 'Expecting a DialogRedirection type');
            currentRedirection = successOrRedirection as DialogRedirection;
            t.comment(`> DialogRedirection: {id: ${currentRedirection.id}, description: ${(currentRedirection as DialogRedirection).dialogDescription}}`);
            return successOrRedirection;

        });

});

test("Open A DialogRedirection Test", (t) => {

    return Catavolt.openDialog(currentRedirection as DialogRedirection).then((dialog:Dialog)=>{

        t.ok(dialog, 'Expecting a non-null result');
        t.ok(dialog.id, 'Expecting a dialog id');
        t.ok(dialog.type === TypeNames.EditorDialogTypeName, 'Expecting an EditorDialog');
        t.ok(dialog.view.type === TypeNames.FormTypeName, 'Expecting a top-level Form');
        t.comment(`> Dialog: {id: ${dialog.id}, view: {type: ${dialog.view.type}}}`);
        const childObj = dialog.children.map((child:Dialog)=>{
            return {id:child.id, view:{type: child.view.type}};
        });
        t.comment(`>   Dialog Children: ${JSON.stringify(childObj)}`);
        currentDialog = dialog;

        return dialog;
    });
});

test("Load And Page A List Test", (t) => {

    const queryDialog:QueryDialog = currentDialog.children[0] as QueryDialog;
    const list:List = queryDialog.view as List;

    t.comment(`List: ${queryDialog.description}`);
    t.comment(`>   List Columns: ${list.columnHeadings.join(',')}`);

    queryDialog.initScroller(5);
    //scroll forward with the specified number of records
    return queryDialog.scroller.refresh().then((records:Array<Record>)=>{
        const rows = records.map((record:Record)=> {
            return record.properties.map((property:Property) => {
               return propertyFormatter.formatForRead(property, queryDialog.recordDef.propDefAtName(property.name));
            }).join(',');
        });
        t.comment(`>   First 5 Records (formatted for 'read mode'): `);
        rows.forEach(row=>t.comment(`>      ${row}`));
        //scroll forward with a specific number of records (override)
        return queryDialog.scroller.pageForward(20).then((records:Array<Record>)=>{
            const rows = records.map((record:Record)=> {
                return record.properties.map((property:Property) => {
                    return propertyFormatter.formatForWrite(property, queryDialog.recordDef.propDefAtName(property.name));
                }).join(',');
        });
            t.comment(`>   Next 20 Records (formatted for 'write mode'):`);
            rows.forEach(row=>t.comment(`>      ${row}`));
            //scroll forward with the previously specified default number of records
            return queryDialog.scroller.pageForward().then((records:Array<Record>)=>{
                const rows = records.map((record:Record)=> record.propValues.join(',') );
                t.comment(`>   Next 5 Records:`);
                rows.forEach(row=>t.comment(`>      ${row}`));
                return records;
            });
        });


    });

});

test("Perform Action Test", (t) => {
    const queryDialog:QueryDialog = currentDialog.children[0] as QueryDialog;
    const list:List = queryDialog.view as List;


    //Get the 'default action' on this QueryDialog
    const defaultActionId = queryDialog.defaultActionId;
    const menu = list.menu.findAtActionId(defaultActionId);
    t.ok(menu, "The View's Menu should contain the defaultActionId");

    //Choose a record to 'act on'
    const aRecord:Record = queryDialog.scroller.buffer[2];

    t.comment(`Navigating to actionId: ${defaultActionId}`);

    //Use toDialogOrRedirection Higher-Order Function to automatically open
    //the Redirection returned by performMenuAction
    return Catavolt.toDialogOrRedirection(

        // Perform the action
        queryDialog.performMenuAction(menu, [aRecord.id])
            .then((successOrRedirection:{actionId} | Redirection)=>{
                if(RedirectionUtil.isDialogRedirection(successOrRedirection)) { currentRedirection = successOrRedirection as Redirection; }
                return successOrRedirection;
        })

    ).then((dialogOrRedirection:Dialog | Redirection)=>{

        if(!RedirectionUtil.isRedirection(dialogOrRedirection)) {

            const dialog = dialogOrRedirection as Dialog;
            t.ok(dialog, 'Expecting a non-null result');
            t.ok(dialog.id, 'Expecting a dialog id');
            t.ok(dialog.type === TypeNames.EditorDialogTypeName, 'Expecting an EditorDialog');
            t.ok(dialog.view.type === TypeNames.FormTypeName, 'Expecting a top-level Form');
            t.comment(`> Dialog: {id: ${dialog.id}, view: {type: ${dialog.view.type}}}`);
            const childObj = dialog.children.map((child:Dialog)=>{
                return {id:child.id, view:{type: child.view.type}};
            });
            t.comment(`>   Dialog Children: ${JSON.stringify(childObj)}`);
            currentDialog = dialog;
        }
        return dialogOrRedirection;

    });

});

test("Read A Record From An EditorDialog Test", (t) => {

    const editorDialog = currentDialog.children[0] as EditorDialog;
    const details:Details = editorDialog.view as Details;

    t.comment(`Detail: ${editorDialog.description}`);

    // Get the Cell Layout defined for this Details Object
    const rowsLayout = details.rows.map((row:Array<Cell>)=>{
        return row.map((cell:Cell)=>{
            return cell.values.map((cellValue:CellValue)=>{
                return `[${cellValue.type}]`
            }).join(', ')
        }).join(', ');
    });

    t.comment(`>  Layout is: `);
    rowsLayout.forEach(row=>t.comment(`>    ${row}`));


    // Read the Record data
    return editorDialog.read().then((record:Record)=>{
       t.ok(record);
       t.comment(`>  Record is: ${record.propValues.join(', ')}`);
       return record;
    });

});

test("Read A Binary Property From EditorDialog Test", (t) => {

    const editorDialog = currentDialog.children[0] as EditorDialog;
    const details:Details = editorDialog.view as Details;

    return editorDialog.read().then((record:Record)=>{

        const largePropDefs = editorDialog.recordDef.propertyDefs
                    .filter((propDef:PropertyDef) => propDef.isLargePropertyType);
        const loadPrArray = largePropDefs.map((propDef:PropertyDef) => {
            return editorDialog.readLargeProperty(propDef.propertyName, record.id);
        });
        return Promise.all(loadPrArray).then((largeProperties:Array<LargeProperty>) => {
           t.ok(largeProperties);
           t.comment(`    Read ${largeProperties.length} LargeProperties`);
           largeProperties.forEach((largeProperty:LargeProperty) => {
              t.comment(`>    ${largeProperty.toUrl()}`);
           });
           return largeProperties;
        });

    });

});

test("Logout Test", (t) => {

    return Catavolt.logout().then((response:{sessionId:string})=>{
         t.ok(response);
         t.ok(response.sessionId);
         t.equal(sessionId, response.sessionId);
         t.comment(`> Session Logout: ${response.sessionId}`)
     })
 });
