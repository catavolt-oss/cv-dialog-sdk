/**
 * Editor dialog: Briefcase_Briefcase_FORM
 *     Editor dialog: Briefcase_Briefcase_Details
 *     Query dialog: Briefcase_Briefcase_Workpackages
 *     Query dialog: Briefcase_Briefcase_MobileComments
 */
export class Briefcase_Briefcase_FORM {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/1';

    private static RESPONSE = {
        "dialogOrigin": {
            "DataObject": "Briefcase",
            "Form": "FORM",
            "Detail": "Briefcase",
            "DataSource": "BriefcaseMetadata"
        },
        "recordDef": {
            "propertyDefs": [{
                "writeAllowed": false,
                "propertyName": "password",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "PASSWORD",
                "format": "password",
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
                "length": 256,
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
            "Form": "FORM",
            "Detail": "Briefcase",
            "DataSource": "BriefcaseMetadata"
        },
        "dialogMode": "READ",
        "description": "Briefcase: 1",
        "referringObject": {
            "actionId": "Briefcase",
            "type": "hxgn.api.dialog.ReferringWorkbench",
            "workbenchId": "SDAWorkbench"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.EditorDialog",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAAF8B.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.briefcase",
        "recordId": "1",
        "view": {
            "formLayout": "TABS",
            "name": "Default",
            "formStyle": "INDIVIDUAL_ROUNDED_RECTANGLES",
            "alias": "Briefcase_Briefcase_FORM",
            "id": "FORM_AAABACcXAAAAAF8e_9_465204103:10487:-1613579321:1_null_1",
            "title": "Default",
            "menu": {
                "visible": false,
                "children": [{
                    "visible": false,
                    "children": [{
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_EnterOfflineMode",
                        "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/catavolt.png",
                        "label": "Go Offline",
                        "id": "alias_EnterOfflineMode",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ExitOfflineMode",
                        "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/catavolt.png",
                        "label": "Go Online",
                        "id": "alias_ExitOfflineMode",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ClearBriefcaseContents",
                        "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/catavolt.png",
                        "label": "Clear Briefcase Contents",
                        "id": "alias_ClearBriefcaseContents",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "#refresh",
                        "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/refresh.png",
                        "label": "Refresh",
                        "id": "#refresh",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "export",
                        "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/export.png",
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
            "dialogOrigin": {
                "DataObject": "Briefcase",
                "PropertySection": "Details",
                "Detail": "Briefcase",
                "DataSource": "BriefcaseMetadata"
            },
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": false,
                    "propertyName": "password",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "PASSWORD",
                    "format": "password",
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
                    "length": 256,
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
                "DataSource": "BriefcaseMetadata"
            },
            "dialogMode": "READ",
            "description": "Briefcase: 1",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.EditorDialog",
            "viewMode": "READ",
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
            "domainClassName": "cx.AAABACcSAAAAAF8B.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.briefcase",
            "view": {
                "commitButtonText": "Save",
                "editable": false,
                "name": "Default",
                "alias": "Briefcase_Briefcase_Details",
                "id": "DETAILS_AAABACcdAAAAAF8v_3_465204103:10487:-1613579321:1_null_1",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_EnterOfflineMode",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/catavolt.png",
                            "label": "Go Offline",
                            "id": "alias_EnterOfflineMode",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ExitOfflineMode",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/catavolt.png",
                            "label": "Go Online",
                            "id": "alias_ExitOfflineMode",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ClearBriefcaseContents",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/catavolt.png",
                            "label": "Clear Briefcase Contents",
                            "id": "alias_ClearBriefcaseContents",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#refresh",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/refresh.png",
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
            "id": "3",
            "dialogName": "Briefcase_Briefcase_Details",
            "selectedViewId": "AAABACcXAAAAAF8e"
        }, {
            "dialogOrigin": {
                "DataObject": "Briefcase",
                "QuerySection": "Workpackages",
                "ToQuery": {"DataObject": "Workpackage", "Query": "Workpackages", "DataSource": "BriefcaseMetadata"},
                "Detail": "Briefcase",
                "DataSource": "BriefcaseMetadata"
            },
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": false,
                    "propertyName": "name",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "workpackageid",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "description",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "creation_date",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "format": "date",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "disciplines",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "last_update_date",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "format": "date",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }], "type": "hxgn.api.dialog.RecordDef"
            },
            "supportsColumnStatistics": true,
            "dialogAliasPath": {
                "DataObject": "Briefcase",
                "QuerySection": "Workpackages",
                "ToQuery": {"DataObject": "Workpackage", "Query": "Workpackages", "DataSource": "BriefcaseMetadata"},
                "Detail": "Briefcase",
                "DataSource": "BriefcaseMetadata"
            },
            "dialogMode": "LIST",
            "description": "Workpackage",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.QueryDialog",
            "viewMode": "READ",
            "supportsPositionalQueries": true,
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityQueryModel",
            "domainClassName": "cx.AAABACcSAAAAAF9J.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.workpackage",
            "view": {
                "fixedColumnCount": 3,
                "columns": [{
                    "propertyName": "workpackageid",
                    "heading": "workpackageid",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "description",
                    "heading": "description",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "name",
                    "heading": "name",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "disciplines",
                    "heading": "disciplines",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "creation_date",
                    "heading": "creation_date",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "last_update_date",
                    "heading": "last_update_date",
                    "type": "hxgn.api.dialog.Column"
                }],
                "name": "Default",
                "alias": "Briefcase_Briefcase_Workpackages",
                "style": "DEFAULT",
                "id": "LIST_AAABACcZAAAAAF*2_1_465204103:10487:-1613579321:1_null_1",
                "title": "Workpackage",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#refresh",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/refresh.png",
                            "label": "Refresh",
                            "id": "#refresh",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#search",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/find.png",
                            "label": "Search\/Sort",
                            "id": "#search",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "export",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/export.png",
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
            "positionalQueryAbility": "FULL",
            "id": "4",
            "dialogName": "Briefcase_Briefcase_Workpackages",
            "selectedViewId": "AAABACcTAAAAAF9m"
        }, {
            "dialogOrigin": {
                "DataObject": "Briefcase",
                "QuerySection": "MobileComments",
                "ToQuery": {"DataObject": "MobileComment", "Query": "MobileComment", "DataSource": "BriefcaseMetadata"},
                "Detail": "Briefcase",
                "DataSource": "BriefcaseMetadata"
            },
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": false,
                    "propertyName": "workpackageid",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "tagid",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "name",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "description",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "documentid",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "mobilecommentid",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "picture",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "LARGE_PROPERTY",
                    "format": "byte",
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
                "ToQuery": {"DataObject": "MobileComment", "Query": "MobileComment", "DataSource": "BriefcaseMetadata"},
                "Detail": "Briefcase",
                "DataSource": "BriefcaseMetadata"
            },
            "dialogMode": "LIST",
            "description": "Mobile Comment",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.QueryDialog",
            "viewMode": "READ",
            "supportsPositionalQueries": true,
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityQueryModel",
            "domainClassName": "cx.AAABACcSAAAAAF-E.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.mobilecomment",
            "view": {
                "fixedColumnCount": 3,
                "columns": [{
                    "propertyName": "mobilecommentid",
                    "heading": "mobilecommentid",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "workpackageid",
                    "heading": "workpackageid",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "documentid",
                    "heading": "documentid",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "tagid",
                    "heading": "tagid",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "name",
                    "heading": "name",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "description",
                    "heading": "description",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "picture",
                    "heading": "picture",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "status",
                    "heading": "status",
                    "type": "hxgn.api.dialog.Column"
                }],
                "name": "Default",
                "alias": "Briefcase_Briefcase_MobileComments",
                "style": "DEFAULT",
                "id": "LIST_AAABACcZAAAAAGBF_1_465204103:10487:-1613579321:1_null_1",
                "title": "Mobile Comment",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "delete",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/delete.png",
                            "label": "Delete",
                            "id": "delete",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#refresh",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/refresh.png",
                            "label": "Refresh",
                            "id": "#refresh",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#search",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/find.png",
                            "label": "Search\/Sort",
                            "id": "#search",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "export",
                            "iconUrl": "https:\/\/s3-eu-west-1.amazonaws.com\/res-euw.catavolt.net\/catavoltres\/images\/action\/export.png",
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
            "positionalQueryAbility": "FULL",
            "id": "5",
            "dialogName": "Briefcase_Briefcase_MobileComments",
            "selectedViewId": "AAABACcTAAAAAF-h"
        }],
        "dialogAlias": "Briefcase_Briefcase_FORM",
        "tenantId": "${tenantId}",
        "id": "1",
        "dialogName": "Briefcase_Briefcase_FORM",
        "selectedViewId": "AAABACcXAAAAAF8e"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
