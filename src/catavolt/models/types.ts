export type AttributeCellValueEntryMethod = 'COMBO_BOX' | 'DROP_DOWN' | 'TEXT_FIELD' | 'ICON_CHOOSER';
export type ClientType = 'DESKTOP' | 'MOBILE';
export type DialogMessageMessageType = 'CONFIRM' | 'ERROR' | 'INFO' | 'WARN';

export enum DialogModeEnum {
    COPY = 'COPY',
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DESTROYED = 'DESTROYED',
    DELETE = 'DELETE',
    LIST = 'LIST'
}

export type DialogMode =
    | DialogModeEnum.COPY
    | DialogModeEnum.CREATE
    | DialogModeEnum.READ
    | DialogModeEnum.UPDATE
    | DialogModeEnum.DESTROYED
    | DialogModeEnum.DELETE
    | DialogModeEnum.LIST;
export type DialogType = 'hxgn.api.dialog.EditorDialog' | 'hxgn.api.dialog.QueryDialog';
export type FilterOperator =
    | 'AND'
    | 'CONTAINS'
    | 'ENDS_WITH'
    | 'EQUAL_TO'
    | 'GREATER_THAN'
    | 'GREATER_THAN_OR_EQUAL_TO'
    | 'LESS_THAN'
    | 'LESS_THAN_OR_EQUAL_TO'
    | 'NOT_EQUAL_TO'
    | 'OR'
    | 'STARTS_WITH';
export type PositionalQueryAbilityType = 'FULL' | 'NONE';

export enum QueryDirectionEnum {
    FORWARD = 'FORWARD',
    BACKWARD = 'BACKWARD'
}

export type QueryDirection = QueryDirectionEnum.FORWARD | QueryDirectionEnum.BACKWARD;
export type RedirectionType =
    | 'hxgn.api.dialog.DialogRedirection'
    | 'hxgn.api.dialog.ContentRedirection'
    | 'hxgn.api.dialog.WebRedirection'
    | 'hxgn.api.dialog.WorkbenchRedirection'
    | 'hxgn.api.dialog.NullRedirection';
export type SortDirection = 'ASC' | 'DESC';

export enum ViewModeEnum {
    READ = 'READ',
    WRITE = 'WRITE'
}

export type ViewMode = ViewModeEnum.READ | ViewModeEnum.WRITE;
export type ViewType =
    | 'hxgn.api.dialog.BarcodeScan'
    | 'hxgn.api.dialog.Calendar'
    | 'hxgn.api.dialog.Details'
    | 'hxgn.api.dialog.Form'
    | 'hxgn.api.dialog.GpsReading'
    | 'hxgn.api.dialog.MapLocation'
    | 'hxgn.api.dialog.Graph'
    | 'hxgn.api.dialog.List'
    | 'hxgn.api.dialog.Map'
    | 'hxgn.api.dialog.Stream';

export enum TypeNames {
    ActionParametersTypeName = 'hxgn.api.dialog.ActionParameters',
    AppWindowTypeName = 'hxgn.api.dialog.AppWindow',
    BarcodeScan = 'hxgn.api.dialog.BarcodeScan',
    CalendarTypeName = 'hxgn.api.dialog.Calendar',
    CodeRefTypeName = 'hxgn.api.dialog.CodeRef',
    ContentRedirectionTypeName = 'hxgn.api.dialog.ContentRedirection',
    DetailsTypeName = 'hxgn.api.dialog.Details',
    DialogTypeName = 'hxgn.api.dialog.Dialog',
    DialogMessageTypeName = 'hxgn.api.dialog.DialogMessage',
    DialogRedirectionTypeName = 'hxgn.api.dialog.DialogRedirection',
    EditorDialogTypeName = 'hxgn.api.dialog.EditorDialog',
    FormTypeName = 'hxgn.api.dialog.Form',
    GpsReadingTypeName = 'hxgn.api.dialog.GpsReading',
    GpsReadingPropertyTypeName = 'hxgn.api.dialog.GpsReadingProperty',
    GraphTypeName = 'hxgn.api.dialog.Graph',
    LargePropertyTypeName = 'hxgn.api.dialog.LargeProperty',
    ListTypeName = 'hxgn.api.dialog.List',
    LoginTypeName = 'hxgn.api.dialog.Login',
    MapTypeName = 'hxgn.api.dialog.Map',
    MapLocationTypeName = 'hxgn.api.dialog.MapLocation',
    MapLocationPropertyTypeName = 'hxgn.api.dialog.MapLocationProperty',
    NullRedirectionTypeName = 'hxgn.api.dialog.NullRedirection',
    ObjectRefTypeName = 'hxgn.api.dialog.ObjectRef',
    PropertyTypeName = 'hxgn.api.dialog.Property',
    QueryDialogTypeName = 'hxgn.api.dialog.QueryDialog',
    QueryParametersTypeName = 'hxgn.api.dialog.QueryParameters',
    ReadLargePropertyParameters = 'hxgn.api.dialog.ReadLargePropertyParameters',
    RecordTypeName = 'hxgn.api.dialog.Record',
    ReferringDialogTypeName = 'hxgn.api.dialog.ReferringDialog',
    ReferringWorkbenchTypeName = 'hxgn.api.dialog.ReferringWorkbench',
    SessionTypeName = 'hxgn.api.dialog.Session',
    StreamTypeName = 'hxgn.api.dialog.Stream',
    WebRedirectionTypeName = 'hxgn.api.dialog.WebRedirection',
    WorkbenchTypeName = 'hxgn.api.dialog.Workbench',
    WorkbenchRedirectionTypeName = 'hxgn.api.dialog.WorkbenchRedirection',
    WriteLargePropertyParameters = 'hxgn.api.dialog.WriteLargePropertyParameters'
}
