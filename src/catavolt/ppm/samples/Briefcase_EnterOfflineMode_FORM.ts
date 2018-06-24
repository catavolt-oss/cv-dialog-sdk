/**
 */
export class Briefcase_EnterOfflineMode_FORM {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/13';

    private static RESPONSE = {
        "dialogOrigin": {
            "Action": "EnterOfflineMode",
            "DataObject": "Briefcase",
            "Form": "FORM",
            "DataSource": "BriefcaseMetadata"
        },
        "recordDef": {
            "propertyDefs": [{
                "writeAllowed": true,
                "propertyName": "P_PASSWORD",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "PASSWORD",
                "format": "password",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": true
            }, {
                "writeAllowed": false,
                "propertyName": "P_USERID",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "DESCRIPTION",
                "length": 40,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "P_ONLINE",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "boolean",
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": true,
                "propertyName": "P_PASSWORD_CONFIRM",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "PASSWORD",
                "format": "password",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": true
            }, {
                "writeAllowed": true,
                "propertyName": "actionName",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 40,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": true
            }], "type": "hxgn.api.dialog.RecordDef"
        },
        "dialogAliasPath": {
            "Action": "EnterOfflineMode",
            "DataObject": "Briefcase",
            "Form": "FORM",
            "DataSource": "BriefcaseMetadata"
        },
        "dialogMode": "CREATE",
        "description": "Default",
        "referringObject": {
            "dialogType": "hxgn.api.dialog.EditorDialog",
            "dialogMode": "READ",
            "dialogAlias": "Briefcase_Briefcase_Details",
            "dialogProperties": {},
            "actionId": "alias_EnterOfflineMode",
            "rootDialogName": "Briefcase_Briefcase_FORM",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "10",
            "dialogName": "Briefcase_Briefcase_Details",
            "rootDialogId": "8"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.EditorDialog",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
        "recordId": "null",
        "view": {
            "formLayout": "FLOWING",
            "name": "Default",
            "formStyle": "INDIVIDUAL_ROUNDED_RECTANGLES",
            "alias": "Briefcase_EnterOfflineMode_FORM",
            "id": "AAABACcaAAAAAGBT1241836571:477:139058878:13_FORM",
            "title": "Default",
            "menu": {
                "visible": false,
                "children": [{
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_PromptOfflineInfo",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                        "label": "Go Offline",
                        "id": "alias_PromptOfflineInfo",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_EnterOfflineMode",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                        "label": "Go Offline",
                        "id": "alias_EnterOfflineMode",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ExitOfflineMode",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                        "label": "Go Online",
                        "id": "alias_ExitOfflineMode",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ClearBriefcaseContents",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                        "label": "Clear Briefcase Contents",
                        "id": "alias_ClearBriefcaseContents",
                        "type": "hxgn.api.dialog.Menu"
                    }, {"visible": false, "id": "SEPARATOR", "type": "hxgn.api.dialog.Menu"}, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "#refresh",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/refresh.png",
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
            "type": "hxgn.api.dialog.Form"
        },
        "children": [{
            "dialogOrigin": {
                "Action": "EnterOfflineMode",
                "DataObject": "Briefcase",
                "DataSource": "BriefcaseMetadata"
            },
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": true,
                    "propertyName": "P_PASSWORD",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "PASSWORD",
                    "format": "password",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": true
                }, {
                    "writeAllowed": false,
                    "propertyName": "P_USERID",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "DESCRIPTION",
                    "length": 40,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "P_ONLINE",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "boolean",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": true,
                    "propertyName": "P_PASSWORD_CONFIRM",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "PASSWORD",
                    "format": "password",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": true
                }], "type": "hxgn.api.dialog.RecordDef"
            },
            "dialogAliasPath": {
                "Action": "EnterOfflineMode",
                "DataObject": "Briefcase",
                "DataSource": "BriefcaseMetadata"
            },
            "dialogMode": "CREATE",
            "description": "New Go Offline",
            "rootDialogName": "Briefcase_EnterOfflineMode_FORM",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.EditorDialog",
            "viewMode": "WRITE",
            "rootDialogId": "13",
            "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
            "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
            "view": {
                "commitButtonText": "Continue",
                "editable": true,
                "name": "Default",
                "alias": "Briefcase_EnterOfflineMode",
                "id": "AAABACcaAAAAAGBT1241836571:477:139058878:13",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_PromptOfflineInfo",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                            "label": "Go Offline",
                            "id": "alias_PromptOfflineInfo",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_EnterOfflineMode",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                            "label": "Go Offline",
                            "id": "alias_EnterOfflineMode",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ExitOfflineMode",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                            "label": "Go Online",
                            "id": "alias_ExitOfflineMode",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ClearBriefcaseContents",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                            "label": "Clear Briefcase Contents",
                            "id": "alias_ClearBriefcaseContents",
                            "type": "hxgn.api.dialog.Menu"
                        }, {"visible": false, "id": "SEPARATOR", "type": "hxgn.api.dialog.Menu"}, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "#refresh",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/refresh.png",
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
                    "values": [{
                        "type": "hxgn.api.dialog.LabelCellValue",
                        "value": "Going offline will automatically download your selected Work Packages and disconnect."
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{
                        "type": "hxgn.api.dialog.LabelCellValue",
                        "value": "Please enter a password to use when logging on in offline mode"
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Offline User ID"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "P_USERID",
                        "hint": null,
                        "displayLength": 40,
                        "toolTip": "Offline User ID",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Offline Password"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "P_PASSWORD",
                        "hint": null,
                        "displayLength": 255,
                        "toolTip": "Offline Password",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Confirm Offline Password"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "P_PASSWORD_CONFIRM",
                        "hint": null,
                        "displayLength": 255,
                        "toolTip": "Confirm Offline Password",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Online Status"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "P_ONLINE",
                        "hint": null,
                        "displayLength": 5,
                        "toolTip": "Online Status",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }]],
                "cancelButtonText": "Cancel"
            },
            "dialogAlias": "Briefcase_EnterOfflineMode",
            "tenantId": "${tenantId}",
            "id": "15",
            "dialogName": "Briefcase_EnterOfflineMode",
            "selectedViewId": "AAABACcaAAAAAGBT1241836571:477:139058878:13"
        }],
        "dialogAlias": "Briefcase_EnterOfflineMode_FORM",
        "tenantId": "${tenantId}",
        "id": "13",
        "dialogName": "Briefcase_EnterOfflineMode_FORM",
        "selectedViewId": "AAABACcaAAAAAGBT1241836571:477:139058878:13"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
