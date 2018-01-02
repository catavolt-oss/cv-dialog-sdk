
import {Log} from "./util";

export class PersistenceTools {

    public static ACTIONS = 'actions';
    public static AVAILABLE_VALUES = 'availableValues';
    public static AVAILABLE_VIEWS = 'availableViews';
    public static DIALOGS = 'dialogs';
    public static RECORD = 'record';
    public static RECORDS = 'records';
    public static REDIRECTIONS = 'redirections';
    public static SELECTED_VIEW = 'selectedView';
    public static SESSIONS = 'sessions';
    public static TENANTS = 'tenants';
    public static VIEW_MODE = 'viewMode';
    public static WORKBENCHES = 'workbenches';

    public static deleteAllState(tenantId: string, userId: string) {
        const keyCount = localStorage.length;
        for (var i = keyCount - 1; i > -1; --i) {
            const key = localStorage.key(i);
            Log.debug("Removing from localStorage: " + key);
            localStorage.removeItem(key);
            // const item = localStorage.getItem(key);
        }
    }

    public static isDeleteSession(path: string[]): boolean {
        return path.length == 4 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS;
    }

    public static isGetAvailableViews(path: string[]): boolean {
        return path.length == 7 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.AVAILABLE_VIEWS;
    }

    public static isGetDialog(path: string[]): boolean {
        return path.length == 6 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS;
    }

    public static isGetRecord(path: string[]): boolean {
        return path.length == 7 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.RECORD;
    }

    public static isGetRedirection(path: string[]): boolean {
        return path.length == 6 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.REDIRECTIONS;
    }

    public static isGetSelectedView(path: string[]): boolean {
        return path.length == 7 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.SELECTED_VIEW;
    }

    public static isGetSession(path: string[]): boolean {
        return path.length == 4 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS;
    }

    public static isGetTenant(path: string[]): boolean {
        return path.length == 2 &&
            path[0] == PersistenceTools.TENANTS;
    }

    public static isGetTenants(path: string[]): boolean {
        return path.length == 1 &&
            path[0] == PersistenceTools.TENANTS;
    }

    public static isGetViewMode(path: string[]): boolean {
        return path.length == 7 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.VIEW_MODE;
    }

    public static isGetWorkbenches(path: string[]): boolean {
        return path.length == 5 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.WORKBENCHES;
    }

    public static isPostAvailableValues(path: string[]): boolean {
        return path.length == 9 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.RECORD &&
            path[8] == PersistenceTools.AVAILABLE_VALUES;
    }

    public static isPostMenuAction(path: string[]): boolean {
        return path.length == 8 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.ACTIONS;
    }

    public static isPostRecords(path: string[]): boolean {
        return path.length == 7 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.RECORDS;
    }

    public static isPostSession(path: string[]): boolean {
        return path.length == 3 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS;
    }

    public static isPostWorkbenchAction(path: string[]): boolean {
        return path.length == 8 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.WORKBENCHES &&
            path[6] == PersistenceTools.ACTIONS;
    }

    public static isPutRecord(path: string[]): boolean {
        return path.length == 7 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.RECORD;
    }

    public static isPutSelectedView(path: string[]): boolean {
        return path.length == 8 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.SELECTED_VIEW;
    }

    public static isPutViewMode(path: string[]): boolean {
        return path.length == 8 &&
            path[0] == PersistenceTools.TENANTS &&
            path[2] == PersistenceTools.SESSIONS &&
            path[4] == PersistenceTools.DIALOGS &&
            path[6] == PersistenceTools.VIEW_MODE;
    }

    public static deleteDialogState(tenantId: string, userId: string, dialogId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + dialogId);
    }

    public static deleteAllDialogState(tenantId: string, userId: string, dialogId: string) {
        const dialog = this.readDialogState(tenantId, userId, dialogId);
        if (dialog) {
            this.deleteAllDialogStateFor(tenantId, userId, dialog);
        }
    }

    public static deleteAllDialogStateFor(tenantId: string, userId: string, dialog: any) {
        const dialogChildren = dialog.children;
        if (dialogChildren) {
            for (let child of dialogChildren) {
                this.deleteAllDialogStateFor(tenantId, userId, child);
            }
        }
        this.deleteRedirectionState(tenantId, userId, dialog.id);
        this.deleteDialogState(tenantId, userId, dialog.id);
        this.deleteRecordSetState(tenantId, userId, dialog.id);
        this.deleteDialogParentState(tenantId, userId, dialog.id);
    }

    public static readDialogState(tenantId: string, userId: string, dialogId: string): any {
        return this.readPersistentState(tenantId, userId, 'dialog.' + dialogId, null);
    }

    public static readDialogParentState(tenantId: string, userId: string, childId: string): any {
        return this.readPersistentState(tenantId, userId, 'dialog.' + childId + '.parent', null);
    }

    public static writeDialogParentState(tenantId: string, userId: string, child: any, parent: any) {
        this.writePersistentState(tenantId, userId, 'dialog.' + child.id + '.parent', parent.id);
        this.writeAllDialogParentState(tenantId, userId, child);
    }

    public static deleteDialogParentState(tenantId: string, userId: string, childId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + childId + '.parent');
    }

    public static writeAllDialogParentState(tenantId: string, userId: string, parent: any) {
        const dialogChildren = parent.children;
        if (dialogChildren) {
            for (let child of dialogChildren) {
                this.writeDialogParentState(tenantId, userId, child, parent);
            }
        }
    }

    public static writeDialogState(tenantId: string, userId: string, dialog: any) {
        this.writePersistentState(tenantId, userId, 'dialog.' + dialog.id, dialog);
    }

    public static deleteNavigationState(tenantId: string, userId: string, navigationId: string) {
        this.deletePersistentState(tenantId, userId, 'navigation.' + navigationId);
    }

    public static readNavigationState(tenantId: string, userId: string, navigationId: string): any {
        return this.readPersistentState(tenantId, userId, 'navigation.' + navigationId, null);
    }

    public static writeNavigationState(tenantId: string, userId: string, navigation: any) {
        this.writePersistentState(tenantId, userId, 'navigation.' + navigation.id, navigation);
    }

    public static readRecordSetState(tenantId: string, userId: string, dialogId: string): any {
        return this.readPersistentState(tenantId, userId, 'dialog.' + dialogId + '.recordSet', null);
    }

    public static writeRecordSetState(tenantId: string, userId: string, dialogId: string, recordSet: any): any {
        this.writePersistentState(tenantId, userId, 'dialog.' + dialogId + '.recordSet', recordSet);
    }

    public static deleteRecordSetState(tenantId: string, userId: string, dialogId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + dialogId + '.recordSet');
    }

    public static deleteRedirectionState(tenantId: string, userId: string, redirectionId: string) {
        this.deletePersistentState(tenantId, userId, 'redirection.' + redirectionId);
    }

    public static readRedirectionState(tenantId: string, userId: string, redirectionId: string): any {
        return this.readPersistentState(tenantId, userId, 'redirection.' + redirectionId, null);
    }

    public static writeRedirectionState(tenantId: string, userId: string, redirection: any) {
        this.writePersistentState(tenantId, userId, 'redirection.' + redirection.id, redirection);
    }

    public static deleteSessionState(tenantId: string, userId: string) {
        this.deletePersistentState(tenantId, userId, 'session');
    }

    public static readSessionState(tenantId: string, userId: string): any {
        return this.readPersistentState(tenantId, userId, 'session', null);
    }

    public static writeSessionState(session: any) {
        this.writePersistentState(session.tenantId, session.userId, 'session', session);
    }

    public static deletePersistentState(tenantId: string, userId: string, stateId: string) {
        const key: string = tenantId + '.' + userId + '.' + stateId;
        window.localStorage.removeItem(key);
    }

    public static readPersistentState(tenantId: string, userId: string, stateId: string, defaultValue: any): any {
        const key: string = tenantId + '.' + userId + '.' + stateId;
        var json: string = window.localStorage.getItem(key);
        return json ? JSON.parse(json) : defaultValue;
    }

    public static writePersistentState(tenantId: string, userId: string, stateId: string, state: any) {
        const key: string = tenantId + '.' + userId + '.' + stateId;
        window.localStorage.setItem(key, JSON.stringify(state));
    }

}
