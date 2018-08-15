/**
 */
export class MobileComment_ImageNotAvailable_FORM {

    private static PATH = 'tenants/hexagonsdaop/sessions/904d23a3343b4805a4f2dd3f934e6fda_48191398_16492_311163987/dialogs/37';

    private static RESPONSE = {
        "dialogOrigin": {
            "Action": "ImageNotAvailable",
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
            "Action": "ImageNotAvailable",
            "DataObject": "MobileComment",
            "Form": "FORM",
            "DataSource": "HexagonSDA"
        },
        "dialogMode": "CREATE",
        "description": "Image Not Available",
        "referringObject": {
            "dialogType": "hxgn.api.dialog.EditorDialog",
            "dialogMode": "READ",
            "dialogAlias": "MobileComment_Details_Properties",
            "dialogProperties": {"globalRefresh": "true", "localRefresh": "true"},
            "actionId": "alias_OpenLatestFile",
            "rootDialogName": "MobileComment_Details_FORM",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "32",
            "dialogName": "MobileComment_Details_Properties",
            "rootDialogId": "30"
        },
        "sessionId": "904d23a3343b4805a4f2dd3f934e6fda_48191398_16492_311163987",
        "type": "hxgn.api.dialog.EditorDialog",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
        "recordId": "null",
        "view": {
            "formLayout": "FLOWING",
            "name": "Default",
            "formStyle": "INDIVIDUAL_ROUNDED_RECTANGLES",
            "alias": "MobileComment_ImageNotAvailable_FORM",
            "id": "AAABACcaAAAAA-oO48191398:16492:311163987:37_FORM",
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
                "Action": "ImageNotAvailable",
                "DataObject": "MobileComment",
                "DataSource": "HexagonSDA"
            },
            "recordDef": {"propertyDefs": [], "type": "hxgn.api.dialog.RecordDef"},
            "dialogAliasPath": {
                "Action": "ImageNotAvailable",
                "DataObject": "MobileComment",
                "DataSource": "HexagonSDA"
            },
            "dialogMode": "CREATE",
            "description": "",
            "rootDialogName": "MobileComment_ImageNotAvailable_FORM",
            "sessionId": "904d23a3343b4805a4f2dd3f934e6fda_48191398_16492_311163987",
            "type": "hxgn.api.dialog.EditorDialog",
            "viewMode": "WRITE",
            "rootDialogId": "37",
            "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
            "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
            "view": {
                "commitButtonText": "Continue",
                "editable": true,
                "name": "Default",
                "alias": "MobileComment_ImageNotAvailable",
                "id": "AAABACcaAAAAA-oO48191398:16492:311163987:37",
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
                        "value": "This Field Observation does not have an Image."
                    }], "type": "hxgn.api.dialog.Cell"
                }]],
                "cancelButtonText": "Cancel"
            },
            "dialogAlias": "MobileComment_ImageNotAvailable",
            "tenantId": "hexagonsdaop",
            "id": "39",
            "dialogName": "MobileComment_ImageNotAvailable",
            "selectedViewId": "AAABACcaAAAAA-oO48191398:16492:311163987:37"
        }],
        "dialogAlias": "MobileComment_ImageNotAvailable_FORM",
        "tenantId": "hexagonsdaop",
        "id": "37",
        "dialogName": "MobileComment_ImageNotAvailable_FORM",
        "selectedViewId": "AAABACcaAAAAA-oO48191398:16492:311163987:37"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
