/**
 */
export class Documents_CreateComment_FORM {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/10';

    private static RESPONSE = {
        "dialogOrigin": {
            "Action": "CreateComment",
            "DataObject": "Documents",
            "Form": "FORM",
            "DataSource": "HexagonSDA"
        },
        "recordDef": {
            "propertyDefs": [{
                "writeAllowed": true,
                "propertyName": "P_NAME",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "DESCRIPTION",
                "length": 80,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": true
            }, {
                "writeAllowed": true,
                "propertyName": "P_DESCRIPTION",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "TEXT_BLOCK",
                "length": 4096,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": true
            }, {
                "writeAllowed": true,
                "propertyName": "P_IMAGE",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "LARGE_PROPERTY",
                "format": "byte",
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
            "Action": "CreateComment",
            "DataObject": "Documents",
            "Form": "FORM",
            "DataSource": "HexagonSDA"
        },
        "dialogMode": "CREATE",
        "description": "Create Comment",
        "referringObject": {
            "dialogMode": "LIST",
            "dialogAlias": "Workpackage_Documents_Documents",
            "dialogProperties": {
                "dialogAliasPath": "{\"DataObject\":\"Workpackage\",\"DataSource\":\"HexagonSDA\",\"Detail\":\"Documents\",\"QuerySection\":\"Documents\",\"ToQuery\":{\"DataObject\":\"Documents\",\"DataSource\":\"HexagonSDA\",\"Query\":\"WorkPackage\"}}",
                "dialogAlias": "Workpackage_Documents_Documents"
            },
            "actionId": "alias_CreateComment",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "9",
            "dialogName": "Workpackage_Documents_Documents"
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
            "alias": "Documents_CreateComment_FORM",
            "id": "AAABACcaAAAAACfn351699060:1257:331442876:10_FORM",
            "title": "Default",
            "menu": {
                "visible": false,
                "children": [{
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_Scan",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/hexagonsdaop/images/Scan2.png",
                        "label": "Scan",
                        "id": "alias_Scan",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_CreateComment",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Create Comment",
                        "id": "alias_CreateComment",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ShowTags",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Tags",
                        "id": "alias_ShowTags",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ShowLatest",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Show Last Comment",
                        "id": "alias_ShowLatest",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "dynamic_AAABACcaAAAAACfl",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Add Image to Comment",
                        "id": "dynamic_AAABACcaAAAAACfl",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_OpenLatestFile",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Open Latest File",
                        "id": "alias_OpenLatestFile",
                        "type": "hxgn.api.dialog.Menu"
                    }, {"visible": false, "id": "SEPARATOR", "type": "hxgn.api.dialog.Menu"}, {
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
            "type": "hxgn.api.dialog.Form"
        },
        "children": [{
            "dialogOrigin": {
                "Action": "CreateComment",
                "DataObject": "Documents",
                "DataSource": "HexagonSDA"
            },
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": true,
                    "propertyName": "P_NAME",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "DESCRIPTION",
                    "length": 80,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": true
                }, {
                    "writeAllowed": true,
                    "propertyName": "P_DESCRIPTION",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "TEXT_BLOCK",
                    "length": 4096,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": true
                }, {
                    "writeAllowed": true,
                    "propertyName": "P_IMAGE",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "LARGE_PROPERTY",
                    "format": "byte",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": true
                }], "type": "hxgn.api.dialog.RecordDef"
            },
            "dialogAliasPath": {"Action": "CreateComment", "DataObject": "Documents", "DataSource": "HexagonSDA"},
            "dialogMode": "CREATE",
            "description": "New Create Comment",
            "sessionId": "6562119136c2458fbce7dd90b3bf48f3_351699060_1257_331442876",
            "type": "hxgn.api.dialog.EditorDialog",
            "viewMode": "WRITE",
            "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
            "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
            "view": {
                "commitButtonText": "Continue",
                "gmlMarkup": "<gml labelColor=\"#ffffff\">\r    <!--                                                                                                                    colors -->\r    <const colorHeading=\"#333333\"/>\r    <const colorSubHeading=\"#999999\"/>\r    <const colorP=\"#666666\"/>\r    <const colorGreen=\"#666666\"/>\r    <const colorDarkGreen=\"#333333\"/>\r    <const linkColor=\"#000000\"/>\r    <!--                                                                                                                    qualifiers -->\r    <const qualifiers=\"small\" h1=\"18\"/>\r    <const qualifiers=\"medium,large\" h1=\"24\"/>\r    <const qualifiers=\"small\" h2=\"14\"/>\r    <const qualifiers=\"medium,large\" h2=\"20\"/>\r    <const qualifiers=\"small\" h3=\"12\"/>\r    <const qualifiers=\"medium,large\" h3=\"16\"/>\r    <const qualifiers=\"small\" h4=\"13\"/>\r    <const qualifiers=\"medium,large\" h4=\"15\"/>\r    <const qualifiers=\"small\" h5=\"8\"/>\r    <const qualifiers=\"medium,large\" h5=\"15\"/>\r    <const qualifiers=\"small\" p=\"10\"/>\r    <const qualifiers=\"medium,large\" p=\"14\"/>\r    <const qualifiers=\"small\" margin2x=\"20\"/>\r    <const qualifiers=\"medium,large\" margin2x=\"30\"/>\r    <const qualifiers=\"small\" margin=\"5\"/>\r    <const qualifiers=\"medium,large\" margin=\"10\"/>\r    <const qualifiers=\"small\" margin2=\"5\"/>\r    <const qualifiers=\"medium,large\" margin2=\"10\"/>\r    <const qualifiers=\"small\" margin3=\"3\"/>\r    <const qualifiers=\"medium,large\" margin3=\"5\"/>\r    <const meta=\"*meta\"/>\r    <const Scan=\"Scan\"/>\r    <const lblSave=\"Register\"/>\r    <const lblCancel=\"Cancel\"/>\r    <const Sample=\"Sample Constant\"/>\r    <const heading=\"Smart Construction Onsite\"/>\r    <const update=\"Update Now\"/>\r    <const WorkPackage=\"Work Package\"/>\r    <const Name=\"Name: \"/>\r    <const Description=\"Description: \"/>\r    <const Docs=\"Documents\"/>\r    <const qualifiers=\"small\" h6=\"6\"/>\r    <const qualifiers=\"medium,large\" h6=\"10\"/>\r    <const Created=\"Created: \"/>\r    <const createdby=\"Check-In User\"/>\r    <const WrPackage=\"Details\"/>\r    <const Tags=\"Tags\"/>\r    <const Tags=\"Tags\"/>\r    <const LastMaintained=\"Updated: \"/>\r    <const ShowDocs=\"Docs\"/>\r    <const RevCreated=\"Rev-Crt Date\"/>\r    <const Revcreatedby=\"Rev-Crt User\"/>\r    <const VerCreated=\"Ver-Crt Date\"/>\r    <const Vercreatedby=\"Ver-Crt User\"/>\r    <const Version=\"Version\"/>\r    <const Revision=\"Revision\"/>\r    <const space=\"  \"/>\r    <const Fav=\"Favorites\"/>\r    <const Search=\"Search\"/>\r    <const SessionProp=\"SDA Mobile Test Package\"/>\r    <const SessionCreated=\"2017-10-11\"/>\r    <const SessionUpdated=\"2017-10-11\"/>\r    <const SessionDesc=\"SDA Mobile Test Package\"/>\r    <const WorkPkg=\"Work Package: \"/>\r    <!--                                                                                          Styles -->\r    <style name=\"Buttons\" textColor=\"#ffffff\" backgroundColor=\"#b02067\" textStyle=\"bold\" cornerRadius=\"7\" height=\"50\" orientation=\"horizontal\" margin=\"0,5,0,5\" textSize=\"20\" />\r    <detail>\r        <div orientation=\"vertical\" qualifiers=\"header\" textSize=\"@const/h2\" backgroundColor=\"#01577d\" textColor=\"#ffffff\" width=\"100%\" margin=\"0,0,5,0\">\r            <!--              <plist orientation=\"horizontal\" imageSize=\"150,50\" marginLeft=\"3\">@const/WorkPkg, @const/SessionProp, *filler</plist> -->\r            <plist marginTop=\"5\" marginLeft=\"3\" marginBottom=\"5\" orientation=\"horizontal\" imageSize=\"150,40\">*filler, res:Hexagon_PPM_WHITE_REVERSED.PNG</plist>\r        </div>\r        <!--                                                  Header Section End-->\r        <div backgroundColor=\"#cdcfd0\" margin=\"0,1,0,1\" width=\"100%\" labelPlacement=\"none\">\r            <div orientation=\"horizontal\" backgroundColor=\"#ffffff\" width=\"100%\" margin=\"3,3,3,3\">\r                <div orientation=\"vertical\" marginTop=\"@const/margin\" marginLeft=\"@const/margin\" marginRight=\"@const/margin\" marginBottom=\"@const/margin\" backgroundColor=\"#FFFFFF\" width=\"100%\">\r                    <div orientation=\"horizontal\" width=\"100%\">\r                        <div orientation=\"vertical\" backgroundColor=\"#FFFFFF\" width=\"100%\" textSize=\"@const/h3\">\r                            <div orientation=\"horizontal\" textColor=\"#333333\" width=\"100%\" marginBottom=\"5\">\r                                <div labelPlacement=\"none\" orientation=\"vertical\" height=\"500\" editValueWidth=\"@const/meta\">\r                                    <div orientation=\"horizontal\">\r                                        <plist padding=\"5\" constWidth=\"100\">@const/Name</plist>\r                                        <plist>P_NAME</plist>\r                                    </div>\r                                    <div orientation=\"horizontal\" marginTop=\"5\">\r                                        <plist padding=\"5\" constWidth=\"100\">@const/Description</plist>\r                                        <plist>P_DESCRIPTION</plist>\r                                    </div>\r                                    <plist imageAnnotate=\"true\" padding=\"5,5,5,5\" imageSize=\"200,200\" orientation=\"horizontal\" marginTop=\"20\" constWidth=\"100\">@const/space, *filler, P_IMAGE, *filler</plist>\r                                </div>\r                            </div>\r                        </div>\r                    </div>\r                </div>\r            </div>\r        </div>\r    </detail>\r</gml>",
                "editable": true,
                "name": "Default",
                "alias": "Documents_CreateComment",
                "id": "AAABACcaAAAAACfn351699060:1257:331442876:10",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_Scan",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/hexagonsdaop/images/Scan2.png",
                            "label": "Scan",
                            "id": "alias_Scan",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_CreateComment",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Create Comment",
                            "id": "alias_CreateComment",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ShowTags",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Tags",
                            "id": "alias_ShowTags",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ShowLatest",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Show Last Comment",
                            "id": "alias_ShowLatest",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "dynamic_AAABACcaAAAAACfl",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Add Image to Comment",
                            "id": "dynamic_AAABACcaAAAAACfl",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_OpenLatestFile",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Open Latest File",
                            "id": "alias_OpenLatestFile",
                            "type": "hxgn.api.dialog.Menu"
                        }, {"visible": false, "id": "SEPARATOR", "type": "hxgn.api.dialog.Menu"}, {
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
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Name"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "P_NAME",
                        "hint": null,
                        "displayLength": 80,
                        "toolTip": "Name",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Description"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "P_DESCRIPTION",
                        "hint": null,
                        "displayLength": 4096,
                        "toolTip": "Description",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Picture"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "P_IMAGE",
                        "hint": null,
                        "displayLength": 1024000,
                        "toolTip": "Picture",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }]],
                "cancelButtonText": "Cancel"
            },
            "dialogAlias": "Documents_CreateComment",
            "tenantId": "hexagonsdaop",
            "id": "12",
            "dialogName": "Documents_CreateComment",
            "selectedViewId": "AAABACcaAAAAACfn351699060:1257:331442876:10"
        }],
        "dialogAlias": "Documents_CreateComment_FORM",
        "tenantId": "${tenantId}",
        "id": "10",
        "dialogName": "Documents_CreateComment_FORM",
        "selectedViewId": "AAABACcaAAAAACfn351699060:1257:331442876:10"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
