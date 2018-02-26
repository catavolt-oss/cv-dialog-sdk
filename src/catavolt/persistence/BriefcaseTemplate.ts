export class BriefcaseTemplate {

    public static BRIEFCASE_REDIRECTION = {
        "dialogMode": "READ",
        "businessId": "1",
        "referringObject": {
            "actionId": "Briefcase",
            "type": "hxgn.api.dialog.ReferringWorkbench",
            "workbenchId": "AAABACffAAAAACe2"
        },
        "sessionId": "3657114326647701194_1883665468_634_-826264471",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "a1",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "businessClassName": "cx.AAABACcSAAAAAF8B.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.briefcase",
        "tenantId": "hexagonsdaop",
        "id": "a1",
        "selectedViewId": "AAABACcXAAAAAF8e",
        "dialogDescription": "Briefcase: 1"
    };

    public static BRIEFCASE_DIALOG = {
        "recordDef": {
            "propertyDefs": [
                {
                    "writeAllowed": false,
                    "propertyName": "briefcaseid",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 256,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                },
                {
                    "writeAllowed": false,
                    "propertyName": "online",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "boolean",
                    "semanticType": "",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                },
                {
                    "writeAllowed": false,
                    "propertyName": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "boolean",
                    "semanticType": "",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }
            ],
            "type": "hxgn.api.dialog.RecordDef"
        },
        "dialogMode": "READ",
        "businessId": "1",
        "description": "Briefcase: 1",
        "referringObject": {
            "actionId": "Briefcase",
            "type": "hxgn.api.dialog.ReferringWorkbench",
            "workbenchId": "AAABACffAAAAACe2"
        },
        "sessionId": "3657114326647701194_1883665468_634_-826264471",
        "type": "hxgn.api.dialog.EditorDialog",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "businessClassName": "cx.AAABACcSAAAAAF8B.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.briefcase",
        "view": {
            "formLayout": "TOP_DOWN",
            "name": "Default",
            "formStyle": "INDIVIDUAL_ROUNDED_RECTANGLES",
            "alias": "Briefcase_Briefcase",
            "id": "FORM_AAABACcXAAAAAF8e_5_1883665468:634:-826264471:2_null_1",
            "title": "Default",
            "menu": {
                "visible": false,
                "children": [
                    {
                        "visible": false,
                        "children": [
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "alias_EnterOfflineMode",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                                "id": "AAABACcaAAAAAGBT",
                                "label": "Enter Offline Mode",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "alias_ExitOfflineMode",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                                "id": "AAABACcaAAAAAGB2",
                                "label": "Exit Offline Mode",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "#refresh",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                                "id": "REFRESH",
                                "label": "Refresh",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "export",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/export.png",
                                "id": "EXPORT",
                                "label": "Export",
                                "type": "hxgn.api.dialog.Menu"
                            }
                        ],
                        "id": "CONTEXT_MENU",
                        "label": "Context Menu",
                        "type": "hxgn.api.dialog.Menu"
                    }
                ],
                "id": "ACTION_BAR",
                "label": "Action Bar",
                "type": "hxgn.api.dialog.Menu"
            },
            "type": "hxgn.api.dialog.Form"
        },
        "children": [
            {
                "businessClassName": "cx.AAABACcSAAAAAF8B.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.briefcase",
                "view": {
                    "commitButtonText": "Cancel",
                    "editable": true,
                    "name": "Default",
                    "alias": "Briefcase_Briefcase",
                    "id": "DETAILS_AAABACcdAAAAAF8v_1_1883665468:634:-826264471:2_null_1",
                    "menu": {
                        "visible": false,
                        "children": [
                            {
                                "visible": false,
                                "children": [
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "alias_EnterOfflineMode",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                                        "id": "AAABACcaAAAAAGBT",
                                        "label": "Enter Offline Mode",
                                        "type": "hxgn.api.dialog.Menu"
                                    },
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "alias_ExitOfflineMode",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                                        "id": "AAABACcaAAAAAGB2",
                                        "label": "Exit Offline Mode",
                                        "type": "hxgn.api.dialog.Menu"
                                    },
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "#refresh",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                                        "id": "REFRESH",
                                        "label": "Refresh",
                                        "type": "hxgn.api.dialog.Menu"
                                    }
                                ],
                                "id": "CONTEXT_MENU",
                                "label": "Context Menu",
                                "type": "hxgn.api.dialog.Menu"
                            }
                        ],
                        "id": "ACTION_BAR",
                        "label": "Action Bar",
                        "type": "hxgn.api.dialog.Menu"
                    },
                    "type": "hxgn.api.dialog.Details",
                    "rows": [
                        [
                            {
                                "values": [
                                    {
                                        "type": "hxgn.api.dialog.LabelCellValue",
                                        "value": "online"
                                    }
                                ],
                                "type": "hxgn.api.dialog.Cell"
                            },
                            {
                                "values": [
                                    {
                                        "autoFillCapable": false,
                                        "propertyName": "online",
                                        "hint": null,
                                        "displayLength": 1,
                                        "toolTip": "online",
                                        "type": "hxgn.api.dialog.AttributeCellValue",
                                        "entryMethod": null,
                                        "actions": []
                                    }
                                ],
                                "type": "hxgn.api.dialog.Cell"
                            }
                        ]
                    ],
                    "cancelButtonText": "Cancel"
                },
                "recordDef": {
                    "propertyDefs": [
                        {
                            "writeAllowed": false,
                            "propertyName": "briefcaseid",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 256,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "online",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "boolean",
                            "semanticType": "",
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "boolean",
                            "semanticType": "",
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        }
                    ],
                    "type": "hxgn.api.dialog.RecordDef"
                },
                "dialogMode": "READ",
                "tenantId": "hexagonsdaop",
                "description": "Briefcase: 1",
                "id": "a11",
                "sessionId": "3657114326647701194_1883665468_634_-826264471",
                "type": "hxgn.api.dialog.EditorDialog",
                "viewMode": "READ",
                "selectedViewId": "AAABACcXAAAAAF8e",
                "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel"
            },
            {
                "recordDef": {
                    "propertyDefs": [
                        {
                            "writeAllowed": false,
                            "propertyName": "name",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "workpackageid",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "description",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "creation_date",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "",
                            "format": "date",
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "disciplines",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "last_update_date",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "",
                            "format": "date",
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        }
                    ],
                    "type": "hxgn.api.dialog.RecordDef"
                },
                "supportsColumnStatistics": true,
                "dialogMode": "LIST",
                "description": "Workpackage",
                "sessionId": "3657114326647701194_1883665468_634_-826264471",
                "type": "hxgn.api.dialog.QueryDialog",
                "viewMode": "READ",
                "supportsPositionalQueries": true,
                "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityQueryModel",
                "businessClassName": "cx.AAABACcSAAAAAF9J.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.workpackage",
                "view": {
                    "fixedColumnCount": 3,
                    "columns": [
                        {
                            "propertyName": "workpackageid",
                            "heading": "workpackageid",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "description",
                            "heading": "description",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "name",
                            "heading": "name",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "disciplines",
                            "heading": "disciplines",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "creation_date",
                            "heading": "creation_date",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "last_update_date",
                            "heading": "last_update_date",
                            "type": "hxgn.api.dialog.Column"
                        }
                    ],
                    "name": "Default",
                    "style": "DEFAULT",
                    "id": "LIST_AAABACcZAAAAAF*2_0_1883665468:634:-826264471:2_null_1",
                    "title": "Workpackage",
                    "menu": {
                        "visible": false,
                        "children": [
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "#refresh",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                                "id": "REFRESH",
                                "label": "Refresh",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "#calculateStatistics",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/calculateStatistics.png",
                                "id": "CALCULATE_STATISTICS",
                                "label": "Calculate Column Statistics",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "export",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/export.png",
                                "id": "EXPORT",
                                "label": "Export",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": false,
                                "children": [
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "#refresh",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                                        "id": "REFRESH",
                                        "label": "Refresh",
                                        "type": "hxgn.api.dialog.Menu"
                                    },
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "#calculateStatistics",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/calculateStatistics.png",
                                        "id": "CALCULATE_STATISTICS",
                                        "label": "Calculate Column Statistics",
                                        "type": "hxgn.api.dialog.Menu"
                                    },
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "export",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/export.png",
                                        "id": "EXPORT",
                                        "label": "Export",
                                        "type": "hxgn.api.dialog.Menu"
                                    }
                                ],
                                "id": "CONTEXT_MENU",
                                "label": "Context Menu",
                                "type": "hxgn.api.dialog.Menu"
                            }
                        ],
                        "id": "ACTION_BAR",
                        "label": "Action Bar",
                        "type": "hxgn.api.dialog.Menu"
                    },
                    "type": "hxgn.api.dialog.List"
                },
                "tenantId": "hexagonsdaop",
                "positionalQueryAbility": "FULL",
                "id": "a12",
                "selectedViewId": "AAABACcTAAAAAF9m"
            },
            {
                "recordDef": {
                    "propertyDefs": [
                        {
                            "writeAllowed": false,
                            "propertyName": "workpackageid",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "tagid",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "name",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "description",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "documentid",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "mobilecommentid",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "picture",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "semanticType": "LARGE_BINARY",
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        },
                        {
                            "writeAllowed": false,
                            "propertyName": "status",
                            "canCauseSideEffects": false,
                            "upperCaseOnly": false,
                            "propertyType": "string",
                            "semanticType": "NAME",
                            "length": 255,
                            "type": "hxgn.api.dialog.PropertyDef",
                            "writeEnabled": false
                        }
                    ],
                    "type": "hxgn.api.dialog.RecordDef"
                },
                "supportsColumnStatistics": true,
                "dialogMode": "LIST",
                "description": "Mobile Comment",
                "sessionId": "3657114326647701194_1883665468_634_-826264471",
                "type": "hxgn.api.dialog.QueryDialog",
                "viewMode": "READ",
                "supportsPositionalQueries": true,
                "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityQueryModel",
                "businessClassName": "cx.AAABACcSAAAAAF-E.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAF7t.mobilecomment",
                "view": {
                    "fixedColumnCount": 3,
                    "columns": [
                        {
                            "propertyName": "mobilecommentid",
                            "heading": "mobilecommentid",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "workpackageid",
                            "heading": "workpackageid",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "documentid",
                            "heading": "documentid",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "tagid",
                            "heading": "tagid",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "name",
                            "heading": "name",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "description",
                            "heading": "description",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "picture",
                            "heading": "picture",
                            "type": "hxgn.api.dialog.Column"
                        },
                        {
                            "propertyName": "status",
                            "heading": "status",
                            "type": "hxgn.api.dialog.Column"
                        }
                    ],
                    "name": "Default",
                    "style": "DEFAULT",
                    "id": "LIST_AAABACcZAAAAAGBF_0_1883665468:634:-826264471:2_null_1",
                    "title": "Mobile Comment",
                    "menu": {
                        "visible": false,
                        "children": [
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "#refresh",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                                "id": "REFRESH",
                                "label": "Refresh",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "#calculateStatistics",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/calculateStatistics.png",
                                "id": "CALCULATE_STATISTICS",
                                "label": "Calculate Column Statistics",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": true,
                                "modes": [
                                    "READ",
                                    "WRITE"
                                ],
                                "actionId": "export",
                                "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/export.png",
                                "id": "EXPORT",
                                "label": "Export",
                                "type": "hxgn.api.dialog.Menu"
                            },
                            {
                                "visible": false,
                                "children": [
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "#refresh",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/refresh.png",
                                        "id": "REFRESH",
                                        "label": "Refresh",
                                        "type": "hxgn.api.dialog.Menu"
                                    },
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "#calculateStatistics",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/calculateStatistics.png",
                                        "id": "CALCULATE_STATISTICS",
                                        "label": "Calculate Column Statistics",
                                        "type": "hxgn.api.dialog.Menu"
                                    },
                                    {
                                        "visible": true,
                                        "modes": [
                                            "READ",
                                            "WRITE"
                                        ],
                                        "actionId": "export",
                                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/export.png",
                                        "id": "EXPORT",
                                        "label": "Export",
                                        "type": "hxgn.api.dialog.Menu"
                                    }
                                ],
                                "id": "CONTEXT_MENU",
                                "label": "Context Menu",
                                "type": "hxgn.api.dialog.Menu"
                            }
                        ],
                        "id": "ACTION_BAR",
                        "label": "Action Bar",
                        "type": "hxgn.api.dialog.Menu"
                    },
                    "type": "hxgn.api.dialog.List"
                },
                "tenantId": "hexagonsdaop",
                "positionalQueryAbility": "FULL",
                "id": "a13",
                "selectedViewId": "AAABACcTAAAAAF-h"
            }
        ],
        "tenantId": "hexagonsdaop",
        "id": "a1",
        "selectedViewId": "AAABACcXAAAAAF8e"
    };

    public static BRIEFCASE_RECORD = {
        "annotations": [],
        "id": "1",
        "type": "hxgn.api.dialog.Record",
        "properties": [
            {
                "name": "briefcaseid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "1"
            },
            {
                "name": "online",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": true
            },
            {
                "name": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": true
            }
        ]
    };

    public static BRIEFCASE_WORKPACKAGES_RECORDSET = {
        "defaultActionId": null,
        "records": [],
        "hasMore": false,
        "type": "hxgn.api.dialog.RecordSet"
    };

    public static BRIEFCASE_WORKPACKAGE_RECORD_EXAMPLE = {
        "annotations": [],
        "id": "6GW7000A",
        "type": "hxgn.api.dialog.Record",
        "properties": [
            {
                "name": "name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "SDA Mobile Test Package"
            },
            {
                "name": "workpackageid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "6GW7000A"
            },
            {
                "name": "description",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "SDA Mobile Test Package"
            },
            {
                "name": "creation_date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2017-10-11"
            },
            {
                "name": "disciplines",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            },
            {
                "name": "last_update_date",
                "format": "date",
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": "2017-10-11"
            }
        ]
    };
}
