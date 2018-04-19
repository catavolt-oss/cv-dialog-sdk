/**
 */
export class SdaGetBriefcaseDialogJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/6';

    private static RESPONSE = {
        "recordDef": {
            "propertyDefs": [{
                "writeAllowed": false,
                "propertyName": "password",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "briefcaseid",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "online",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "boolean",
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "boolean",
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }], "type": "hxgn.api.dialog.RecordDef"
        },
        "dialogAliasPath": {"DataObject": "Briefcase", "Form": "FORM", "Detail": "Briefcase", "DataSource": "SDALocal"},
        "dialogMode": "READ",
        "description": "Briefcase: 1",
        "referringObject": {
            "actionId": "Briefcase",
            "type": "hxgn.api.dialog.ReferringWorkbench",
            "workbenchId": "SDAWorkbenchLOCAL"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.EditorDialog",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAAKH*.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.Briefcase",
        "recordId": "1",
        "view": {
            "formLayout": "TABS",
            "name": "Default",
            "formStyle": "INDIVIDUAL_ROUNDED_RECTANGLES",
            "alias": "Briefcase_Briefcase_FORM",
            "id": "FORM_AAABACcXAAAAAKIr_6_671398670:4260:1017952399:6_null_1",
            "title": "Default",
            "menu": {
                "visible": false,
                "children": [{
                    "visible": false,
                    "children": [{
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_EnterOfflineMode",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Go Offline",
                        "id": "alias_EnterOfflineMode",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ExitOfflineMode",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Go Online",
                        "id": "alias_ExitOfflineMode",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ClearBriefcaseContents",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Clear Briefcase Contents",
                        "id": "alias_ClearBriefcaseContents",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "#refresh",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                        "label": "Refresh",
                        "id": "#refresh",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "export",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/export.png",
                        "label": "Export",
                        "id": "export",
                        "type": "hxgn.api.dialog.Menu"
                    }],
                    "label": "Top Menu",
                    "id": "CONTEXT_MENU",
                    "type": "hxgn.api.dialog.Menu"
                }],
                "label": "Action Bar",
                "id": "ACTION_BAR",
                "type": "hxgn.api.dialog.Menu"
            },
            "type": "hxgn.api.dialog.Form"
        },
        "children": [{
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": false,
                    "propertyName": "password",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "briefcaseid",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "online",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "boolean",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "boolean",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }], "type": "hxgn.api.dialog.RecordDef"
            },
            "dialogAliasPath": {
                "DataObject": "Briefcase",
                "PropertySection": "Details",
                "Detail": "Briefcase",
                "DataSource": "SDALocal"
            },
            "dialogMode": "READ",
            "description": "Briefcase: 1",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.EditorDialog",
            "viewMode": "READ",
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
            "domainClassName": "cx.AAABACcSAAAAAKH*.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.Briefcase",
            "view": {
                "commitButtonText": "Save",
                "editable": false,
                "name": "Default",
                "alias": "Briefcase_Briefcase_Details",
                "id": "DETAILS_AAABACcdAAAAAKI8_3_671398670:4260:1017952399:6_null_1",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_EnterOfflineMode",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Go Offline",
                            "id": "alias_EnterOfflineMode",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ExitOfflineMode",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Go Online",
                            "id": "alias_ExitOfflineMode",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ClearBriefcaseContents",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Clear Briefcase Contents",
                            "id": "alias_ClearBriefcaseContents",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#refresh",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                            "label": "Refresh",
                            "id": "#refresh",
                            "type": "hxgn.api.dialog.Menu"
                        }],
                        "label": "Top Menu",
                        "id": "CONTEXT_MENU",
                        "type": "hxgn.api.dialog.Menu"
                    }],
                    "label": "Action Bar",
                    "id": "ACTION_BAR",
                    "type": "hxgn.api.dialog.Menu"
                },
                "type": "hxgn.api.dialog.Details",
                "rows": [[{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "online"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "online",
                        "hint": null,
                        "displayLength": 1,
                        "toolTip": "online",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "password"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "password",
                        "hint": null,
                        "displayLength": 255,
                        "toolTip": "password",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }]],
                "cancelButtonText": "Cancel"
            },
            "dialogAlias": "Briefcase_Briefcase_Details",
            "tenantId": "${tenantId}",
            "refreshNeeded": false,
            "id": "8",
            "selectedViewId": "AAABACcXAAAAAKIr"
        }, {
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": false,
                    "propertyName": "Creation_Date",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "format": "date-time",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Last_Update_Date",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "format": "date-time",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Disciplines",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Id",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Description",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Name",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }], "type": "hxgn.api.dialog.RecordDef"
            },
            "supportsColumnStatistics": true,
            "dialogAliasPath": {
                "DataObject": "Briefcase",
                "QuerySection": "Workpackages",
                "ToQuery": {"DataObject": "BriefcaseWorkpackage", "Query": "Workpackages", "DataSource": "SDALocal"},
                "Detail": "Briefcase",
                "DataSource": "SDALocal"
            },
            "dialogMode": "LIST",
            "description": "Briefcase Workpackages",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.QueryDialog",
            "viewMode": "READ",
            "supportsPositionalQueries": true,
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityQueryModel",
            "domainClassName": "cx.AAABACcSAAAAAKJo.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.BriefcaseWorkpackage",
            "view": {
                "fixedColumnCount": 3,
                "columns": [{
                    "propertyName": "Id",
                    "heading": "Id",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Description",
                    "heading": "Description",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Name",
                    "heading": "Name",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Disciplines",
                    "heading": "Disciplines",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Creation_Date",
                    "heading": "Creation_Date",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Last_Update_Date",
                    "heading": "Last_Update_Date",
                    "type": "hxgn.api.dialog.Column"
                }],
                "name": "Default",
                "alias": "Briefcase_Briefcase_Workpackages",
                "style": "DEFAULT",
                "id": "LIST_AAABACcZAAAAAKNu_0_671398670:4260:1017952399:6_null_1",
                "title": "Workpackages",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#refresh",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                            "label": "Refresh",
                            "id": "#refresh",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#search",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/find.png",
                            "label": "Search/Sort",
                            "id": "#search",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "export",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/export.png",
                            "label": "Export",
                            "id": "export",
                            "type": "hxgn.api.dialog.Menu"
                        }],
                        "label": "Top Menu",
                        "id": "CONTEXT_MENU",
                        "type": "hxgn.api.dialog.Menu"
                    }],
                    "label": "Action Bar",
                    "id": "ACTION_BAR",
                    "type": "hxgn.api.dialog.Menu"
                },
                "type": "hxgn.api.dialog.List"
            },
            "dialogAlias": "Briefcase_Briefcase_Workpackages",
            "tenantId": "${tenantId}",
            "refreshNeeded": false,
            "positionalQueryAbility": "FULL",
            "id": "9",
            "selectedViewId": "AAABACcTAAAAAKKF"
        }, {
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": false,
                    "propertyName": "Description",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "tag_id",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Id",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "doc_id",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "workpackage_id",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Name",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "status",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }], "type": "hxgn.api.dialog.RecordDef"
            },
            "supportsColumnStatistics": true,
            "dialogAliasPath": {
                "DataObject": "Briefcase",
                "QuerySection": "MobileComments",
                "ToQuery": {"DataObject": "BriefcaseMobileComment", "Query": "MobileComment", "DataSource": "SDALocal"},
                "Detail": "Briefcase",
                "DataSource": "SDALocal"
            },
            "dialogMode": "LIST",
            "description": "Briefcase Mobile Comments",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.QueryDialog",
            "viewMode": "READ",
            "supportsPositionalQueries": true,
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityQueryModel",
            "domainClassName": "cx.AAABACcSAAAAAKLV.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.BriefcaseMobileComment",
            "view": {
                "fixedColumnCount": 3,
                "columns": [{
                    "propertyName": "Id",
                    "heading": "Id",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "workpackage_id",
                    "heading": "workpackage_id",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "doc_id",
                    "heading": "doc_id",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "tag_id",
                    "heading": "tag_id",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Name",
                    "heading": "Name",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Description",
                    "heading": "Description",
                    "type": "hxgn.api.dialog.Column"
                }, {"propertyName": "status", "heading": "status", "type": "hxgn.api.dialog.Column"}],
                "name": "Default",
                "alias": "Briefcase_Briefcase_MobileComments",
                "style": "DEFAULT",
                "id": "LIST_AAABACcZAAAAAKN8_0_671398670:4260:1017952399:6_null_1",
                "title": "Mobile Comments",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#refresh",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                            "label": "Refresh",
                            "id": "#refresh",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#search",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/find.png",
                            "label": "Search/Sort",
                            "id": "#search",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "export",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/export.png",
                            "label": "Export",
                            "id": "export",
                            "type": "hxgn.api.dialog.Menu"
                        }],
                        "label": "Top Menu",
                        "id": "CONTEXT_MENU",
                        "type": "hxgn.api.dialog.Menu"
                    }],
                    "label": "Action Bar",
                    "id": "ACTION_BAR",
                    "type": "hxgn.api.dialog.Menu"
                },
                "type": "hxgn.api.dialog.List"
            },
            "dialogAlias": "Briefcase_Briefcase_MobileComments",
            "tenantId": "${tenantId}",
            "refreshNeeded": false,
            "positionalQueryAbility": "FULL",
            "id": "10",
            "selectedViewId": "AAABACcTAAAAAKL8"
        }],
        "dialogAlias": "Briefcase_Briefcase_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "6",
        "selectedViewId": "AAABACcXAAAAAKIr"
    };

    public static response(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
