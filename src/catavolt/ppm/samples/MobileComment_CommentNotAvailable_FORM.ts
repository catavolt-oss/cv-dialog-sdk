/**
 */
export class MobileComment_CommentNotAvailable_FORM {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/14';

    private static RESPONSE = {
        "dialogOrigin": {
            "Action": "CommentNotAvailable",
            "DataObject": "MobileComment",
            "Form": "FORM",
            "DataSource": "HexagonSDA"
        },
        "recordDef": {
            "propertyDefs": [{
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
            "Action": "CommentNotAvailable",
            "DataObject": "MobileComment",
            "Form": "FORM",
            "DataSource": "HexagonSDA"
        },
        "dialogMode": "CREATE",
        "description": "Field Observation Not Available",
        "referringObject": {
            "dialogType": "hxgn.api.dialog.QueryDialog",
            "dialogMode": "LIST",
            "dialogAlias": "Workpackage_Documents_Documents",
            "dialogProperties": {
                "globalRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"ShowLatest\",\"DataObject\":\"Documents\",\"DataSource\":\"HexagonSDA\",\"Form\":\"FORM\"}",
                "dialogAlias": "Documents_ShowLatest_FORM",
                "localRefresh": "true"
            },
            "actionId": "alias_ShowLatest",
            "rootDialogName": "Workpackage_Documents_FORM",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "9",
            "dialogName": "Workpackage_Documents_Documents",
            "rootDialogId": "6"
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
            "alias": "MobileComment_CommentNotAvailable_FORM",
            "id": "AAABACcaAAAAA-nm404746552:17388:533459633:14_FORM",
            "title": "Default",
            "menu": {
                "visible": false,
                "children": [{
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_OpenLatestFile",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                        "label": "Open Latest File",
                        "id": "alias_OpenLatestFile",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_CommentNotAvailable",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                        "label": "Field Observation Not Available",
                        "id": "alias_CommentNotAvailable",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ImageNotAvailable",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                        "label": "Image Not Available",
                        "id": "alias_ImageNotAvailable",
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
                "Action": "CommentNotAvailable",
                "DataObject": "MobileComment",
                "DataSource": "HexagonSDA"
            },
            "recordDef": {"propertyDefs": [], "type": "hxgn.api.dialog.RecordDef"},
            "dialogAliasPath": {
                "Action": "CommentNotAvailable",
                "DataObject": "MobileComment",
                "DataSource": "HexagonSDA"
            },
            "dialogMode": "CREATE",
            "description": "",
            "rootDialogName": "MobileComment_CommentNotAvailable_FORM",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.EditorDialog",
            "viewMode": "WRITE",
            "rootDialogId": "14",
            "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
            "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
            "view": {
                "commitButtonText": "Continue",
                "editable": true,
                "name": "Default",
                "alias": "MobileComment_CommentNotAvailable",
                "id": "AAABACcaAAAAA-nm404746552:17388:533459633:14",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_OpenLatestFile",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                            "label": "Open Latest File",
                            "id": "alias_OpenLatestFile",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_CommentNotAvailable",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                            "label": "Field Observation Not Available",
                            "id": "alias_CommentNotAvailable",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ImageNotAvailable",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/xaltres/images/action/catavolt.png",
                            "label": "Image Not Available",
                            "id": "alias_ImageNotAvailable",
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
                        "value": "A Field Observation does not exist for this object."
                    }], "type": "hxgn.api.dialog.Cell"
                }]],
                "cancelButtonText": "Cancel"
            },
            "dialogAlias": "MobileComment_CommentNotAvailable",
            "tenantId": "${tenantId}",
            "id": "16",
            "dialogName": "MobileComment_CommentNotAvailable",
            "selectedViewId": "AAABACcaAAAAA-nm404746552:17388:533459633:14"
        }],
        "dialogAlias": "MobileComment_CommentNotAvailable_FORM",
        "tenantId": "${tenantId}",
        "id": "14",
        "dialogName": "MobileComment_CommentNotAvailable_FORM",
        "selectedViewId": "AAABACcaAAAAA-nm404746552:17388:533459633:14"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
