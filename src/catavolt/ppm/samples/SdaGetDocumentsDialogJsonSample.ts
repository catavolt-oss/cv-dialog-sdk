/**
 */
export class SdaGetDocumentsDialogJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/6';

    private static RESPONSE = {
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
                "propertyName": "Last_Update_Date",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "format": "date",
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "Creation_Date",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "format": "date",
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
                "propertyName": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "boolean",
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
        "dialogAliasPath": {
            "DataObject": "Workpackage",
            "Form": "FORM",
            "Detail": "Documents",
            "DataSource": "SDALocal"
        },
        "dialogOrigin": {
            "DataObject": "Workpackage",
            "Form": "FORM",
            "Detail": "Documents",
            "DataSource": "SDALocal"
        },
        "dialogMode": "READ",
        "description": "Work Package: SDA Mobile Test Package",
        "referringObject": {
            "dialogMode": "LIST",
            "dialogAlias": "Workpackage_Open_FORM",
            "dialogName": "Workpackage_Open_FORM",
            "dialogProperties": {
                "globalRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"Open\",\"DataObject\":\"Workpackage\",\"DataSource\":\"SDALocal\",\"Form\":\"FORM\"}",
                "dialogAlias": "Workpackage_Open_FORM",
                "localRefresh": "true"
            },
            "actionId": "alias_Open",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "2"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.EditorDialog",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAAI59.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.Workpackage",
        "recordId": "6GW7000A",
        "view": {
            "formLayout": "TABS",
            "name": "Default",
            "formStyle": "INDIVIDUAL_ROUNDED_RECTANGLES",
            "alias": "Workpackage_Documents_FORM",
            "id": "FORM_AAABACcXAAAAAI9D_12_203148447:5197:1232256016:6_null_1",
            "title": "Default",
            "menu": {
                "visible": false,
                "children": [{
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_Open",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Set Session And Open",
                        "id": "alias_Open",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_Scan",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Scan",
                        "id": "alias_Scan",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_AddToBriefcase",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Add To Briefcase",
                        "id": "alias_AddToBriefcase",
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
                    "propertyName": "Last_Update_Date",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "format": "date",
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Creation_Date",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "format": "date",
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
                    "propertyName": "ZZREPEAT_ACTION_PROPERTY_NAMEZZ",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "boolean",
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
            "dialogAliasPath": {
                "DataObject": "Workpackage",
                "PropertySection": "Properties",
                "Detail": "Documents",
                "DataSource": "SDALocal"
            },
            "dialogOrigin": {
                "DataObject": "Workpackage",
                "PropertySection": "Properties",
                "Detail": "Documents",
                "DataSource": "SDALocal"
            },
            "dialogMode": "READ",
            "description": "Work Package: SDA Mobile Test Package",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.EditorDialog",
            "viewMode": "READ",
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
            "domainClassName": "cx.AAABACcSAAAAAI59.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.Workpackage",
            "view": {
                "commitButtonText": "Save",
                "editable": true,
                "name": "Default",
                "alias": "Workpackage_Documents_Properties",
                "id": "DETAILS_AAABACcdAAAAAI9U_9_203148447:5197:1232256016:6_null_1",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "children": [{
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_Open",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Set Session And Open",
                            "id": "alias_Open",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_Scan",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Scan",
                            "id": "alias_Scan",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_AddToBriefcase",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Add To Briefcase",
                            "id": "alias_AddToBriefcase",
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
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Id"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "Id",
                        "hint": null,
                        "displayLength": 255,
                        "toolTip": "Id",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Name"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "Name",
                        "hint": null,
                        "displayLength": 255,
                        "toolTip": "Name",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Creation Date"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "Creation_Date",
                        "hint": null,
                        "displayLength": 29,
                        "toolTip": "Creation_Date",
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
                        "propertyName": "Description",
                        "hint": null,
                        "displayLength": 255,
                        "toolTip": "Description",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }], [{
                    "values": [{"type": "hxgn.api.dialog.LabelCellValue", "value": "Last Update Date"}],
                    "type": "hxgn.api.dialog.Cell"
                }, {
                    "values": [{
                        "autoFillCapable": false,
                        "propertyName": "Last_Update_Date",
                        "hint": null,
                        "displayLength": 29,
                        "toolTip": "Last_Update_Date",
                        "type": "hxgn.api.dialog.AttributeCellValue",
                        "entryMethod": null,
                        "actions": []
                    }], "type": "hxgn.api.dialog.Cell"
                }]],
                "cancelButtonText": "Cancel"
            },
            "dialogAlias": "Workpackage_Documents_Properties",
            "dialogName": "Workpackage_Documents_Properties",
            "tenantId": "${tenantId}",
            "refreshNeeded": false,
            "id": "8",
            "selectedViewId": "AAABACcXAAAAAI9D"
        }, {
            "recordDef": {
                "propertyDefs": [{
                    "writeAllowed": false,
                    "propertyName": "Title",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "UID",
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
                    "propertyName": "Revision",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
                    "type": "hxgn.api.dialog.PropertyDef",
                    "writeEnabled": false
                }, {
                    "writeAllowed": false,
                    "propertyName": "Classification",
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
                "DataObject": "Workpackage",
                "QuerySection": "Documents",
                "ToQuery": {"DataObject": "Documents", "Query": "WorkPackage", "DataSource": "SDALocal"},
                "Detail": "Documents",
                "DataSource": "SDALocal"
            },
            "dialogOrigin": {
                "DataObject": "Workpackage",
                "QuerySection": "Documents",
                "ToQuery": {"DataObject": "Documents", "Query": "WorkPackage", "DataSource": "SDALocal"},
                "Detail": "Documents",
                "DataSource": "SDALocal"
            },
            "dialogMode": "LIST",
            "description": "Documents",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.QueryDialog",
            "viewMode": "READ",
            "supportsPositionalQueries": true,
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityQueryModel",
            "domainClassName": "cx.AAABACcSAAAAAI*6.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.FusionDocument",
            "view": {
                "fixedColumnCount": 3,
                "gmlMarkup": "<gml labelColor=\"#ffffff\">\r    <!--                                                                                                                  colors -->\r    <const colorHeading=\"#333333\"/>\r    <const colorSubHeading=\"#999999\"/>\r    <const colorP=\"#666666\"/>\r    <const colorGreen=\"#666666\"/>\r    <const colorDarkGreen=\"#333333\"/>\r    <const linkColor=\"#000000\"/>\r    <!--                                                                                                                  qualifiers -->\r    <const qualifiers=\"small\" h1=\"18\"/>\r    <const qualifiers=\"medium,large\" h1=\"24\"/>\r    <const qualifiers=\"small\" h2=\"14\"/>\r    <const qualifiers=\"medium,large\" h2=\"20\"/>\r    <const qualifiers=\"small\" h3=\"12\"/>\r    <const qualifiers=\"medium,large\" h3=\"16\"/>\r    <const qualifiers=\"small\" h4=\"13\"/>\r    <const qualifiers=\"medium,large\" h4=\"15\"/>\r    <const qualifiers=\"small\" h5=\"8\"/>\r    <const qualifiers=\"medium,large\" h5=\"15\"/>\r    <const qualifiers=\"small\" p=\"10\"/>\r    <const qualifiers=\"medium,large\" p=\"14\"/>\r    <const qualifiers=\"small\" margin2x=\"20\"/>\r    <const qualifiers=\"medium,large\" margin2x=\"30\"/>\r    <const qualifiers=\"small\" margin=\"5\"/>\r    <const qualifiers=\"medium,large\" margin=\"10\"/>\r    <const qualifiers=\"small\" margin2=\"5\"/>\r    <const qualifiers=\"medium,large\" margin2=\"10\"/>\r    <const qualifiers=\"small\" margin3=\"3\"/>\r    <const qualifiers=\"medium,large\" margin3=\"5\"/>\r    <const meta=\"*meta\"/>\r    <const Scan=\"Scan\"/>\r    <const lblSave=\"Register\"/>\r    <const lblCancel=\"Cancel\"/>\r    <const Sample=\"Sample Constant\"/>\r    <const heading=\"Smart Construction Onsite\"/>\r    <const update=\"Update Now\"/>\r    <const WorkPackage=\"Work Package\"/>\r    <const Docs=\"Documents\"/>\r    <const qualifiers=\"small\" h6=\"6\"/>\r    <const qualifiers=\"medium,large\" h6=\"10\"/>\r    <const Created=\"Created: \"/>\r    <const createdby=\"Check-In User\"/>\r    <const WrPackage=\"Details\"/>\r    <const Tags=\"Tags\"/>\r    <const Tags=\"Tags\"/>\r    <const LastMaintained=\"Updated: \"/>\r    <const ShowDocs=\"Docs\"/>\r    <const RevCreated=\"Rev-Crt Date\"/>\r    <const Revcreatedby=\"Rev-Crt User\"/>\r    <const VerCreated=\"Ver-Crt Date\"/>\r    <const Vercreatedby=\"Ver-Crt User\"/>\r    <const Version=\"Version\"/>\r    <const Revision=\"Revision\"/>\r    <const space=\"  \"/>\r    <const Fav=\"Favorites\"/>\r    <const Search=\"Search\"/>\r    <const SessionProp=\"SDA Mobile Test Package\"/>\r    <const SessionCreated=\"2017-10-11\"/>\r    <const SessionUpdated=\"2017-10-11\"/>\r    <const SessionDesc=\"SDA Mobile Test Package\"/>\r    <const WorkPkg=\"Work Package: \"/>\r    <!--                                                                                        Styles -->\r    <style name=\"Buttons\" textColor=\"#ffffff\" backgroundColor=\"#b02067\" textStyle=\"bold\" cornerRadius=\"7\" height=\"50\" orientation=\"horizontal\" margin=\"0,5,0,5\" textSize=\"20\"/>\r    <list>\r        <div orientation=\"vertical\" qualifiers=\"header\" textSize=\"@const/h2\" backgroundColor=\"#01577d\" textColor=\"#ffffff\" width=\"100%\" margin=\"0,0,5,0\">\r            <div orientation=\"horizontal\" width=\"100%\" distribute=\"even\" textSize=\"@const/h3\">\r                <div orientation=\"vertical\" width=\"50%\" textSize=\"@const/h3\">\r                    <div orientation=\"horizontal\" width=\"100%\">\r                      <plist textStyle=\"bold\">@const/SessionDesc</plist>\r                    </div>\r                    <div orientation=\"horizontal\" marginTop=\"5\" marginBottom=\"5\" width=\"100%\">\r                        <plist textColor=\"#2f8ffa\" textStyle=\"bold\">@const/Created</plist>\r                        <plist marginRight=\"10\" marginLeft=\"3\" textStyle=\"bold\">@const/SessionCreated</plist>\r                        <plist textStyle=\"bold\" textColor=\"#2f8ffa\">@const/LastMaintained</plist>\r                        <plist marginLeft=\"10\" textStyle=\"bold\">@const/SessionCreated</plist>\r                    </div>\r                </div>\r                <div orientation=\"horizontal\" width=\"20%\">\r                  <plist marginTop=\"5\" marginLeft=\"3\" marginBottom=\"5\" textSize=\"@const/h2\" textStyle=\"bold\" orientation=\"horizontal\">@const/Docs,*filler</plist>\r                </div>\r                <div orientation=\"horizontal\" width=\"30%\">\r                  <plist marginTop=\"5\" marginLeft=\"3\" marginBottom=\"5\" orientation=\"horizontal\" imageSize=\"150,40\">*filler, res:Hexagon_PPM_WHITE_REVERSED.PNG</plist>\r                </div>\r            </div>\r        </div>\r        <!--                                                Header Section End-->\r        <div backgroundColor=\"#cdcfd0\" margin=\"0,1,0,1\" width=\"100%\">\r            <div orientation=\"horizontal\" backgroundColor=\"#ffffff\" width=\"100%\" margin=\"3,3,3,3\">\r                <div orientation=\"vertical\" marginTop=\"@const/margin\" marginLeft=\"@const/margin\" marginRight=\"@const/margin\" marginBottom=\"@const/margin\" backgroundColor=\"#FFFFFF\" width=\"100%\">\r                    <div orientation=\"horizontal\" width=\"100%\">\r                        <div orientation=\"vertical\" backgroundColor=\"#FFFFFF\" width=\"100%\" textSize=\"@const/h3\">\r                            <div orientation=\"horizontal\" textColor=\"#333333\" width=\"100%\" marginBottom=\"5\">\r                                <div orientation=\"horizontal\" imageSize=\"30,30\">\r                                    <plist>res:Document.png</plist>\r                                </div>\r                                <div orientation=\"horizontal\" labelStyle=\"bold\" expandable=\"horizontal\" marginLeft=\"3\">\r                                    <plist textStyle=\"bold\" textColor=\"#2f8ffa\" margin=\"0,10,0,0\" labelPlacement=\"none\">Name</plist>\r                                    <plist textColor=\"#000000\" margin=\"0,10,0,0\" labelPlacement=\"none\">Title</plist>\r                                    <plist textColor=\"#000000\" margin=\"0,10,0,0\" labelPlacement=\"none\">Revision</plist>\r                                </div>\r                                <div orientation=\"horizontal\" labelPlacement=\"none\" imageSize=\"30,30\" actionID=\"alias_CreateComment\">\r                                    <plist margin=\"0,30,0,0\">res:comment.png</plist>\r                                </div>\r                                <div orientation=\"horizontal\" labelPlacement=\"none\" imageSize=\"30,30\" actionID=\"alias_ShowLatest\">\r                                    <plist>res:File.png</plist>\r                                </div>\r                            </div>\r                        </div>\r                    </div>\r                </div>\r            </div>\r        </div>\r        <div orientation=\"horizontal\" backgroundColor=\"#cdcfd0\" imageSize=\"20,20\" qualifiers=\"footer\" height=\"50\" width=\"100%\" textSize=\"@const/h5\">\r            <plist width=\"10%\"/>\r            <div width=\"20%\" orientation=\"vertical\" align=\"center\">\r                <plist orientation=\"horizontal\">res:Search.png</plist>\r                <plist orientation=\"horizontal\" textStyle=\"bold\">@const/Search</plist>\r            </div>\r            <div orientation=\"vertical\" width=\"20%\" align=\"center\" actionID=\"alias_Scan\">\r                <plist orientation=\"vertical\">res:Scan2.png</plist>\r                <plist textStyle=\"bold\">@const/Scan</plist>\r            </div>\r            <div orientation=\"vertical\" width=\"20%\" align=\"center\" actionID=\"alias_ShowTags\">\r                <plist orientation=\"vertical\">res:Tag.png</plist>\r                <plist textStyle=\"bold\">@const/Tags</plist>\r            </div>\r            <div orientation=\"vertical\" width=\"20%\" align=\"center\">\r                <plist orientation=\"vertical\">res:Favorites.png</plist>\r                <plist textStyle=\"bold\">@const/Fav</plist>\r            </div>\r            <plist width=\"10%\"/>\r        </div>\r    </list>\r</gml>",
                "columns": [{
                    "propertyName": "Classification",
                    "heading": "Classification",
                    "type": "hxgn.api.dialog.Column"
                }, {"propertyName": "Id", "heading": "Id", "type": "hxgn.api.dialog.Column"}, {
                    "propertyName": "Name",
                    "heading": "Name",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Revision",
                    "heading": "Revision",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Title",
                    "heading": "Title",
                    "type": "hxgn.api.dialog.Column"
                }, {"propertyName": "UID", "heading": "UID", "type": "hxgn.api.dialog.Column"}],
                "name": "Default",
                "alias": "Workpackage_Documents_Documents",
                "style": "DEFAULT",
                "id": "LIST_AAABACcZAAAAAJIq_1_203148447:5197:1232256016:6_null_1",
                "title": "Documents",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_CreateComment",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Create Comment",
                        "id": "alias_CreateComment",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_ShowLatest",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Show Last Comment",
                        "id": "alias_ShowLatest",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
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
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_ShowTags",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Tags",
                            "id": "alias_ShowTags",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "dynamic_AAABACcaAAAAAJTH",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Open Latest File",
                            "id": "dynamic_AAABACcaAAAAAJTH",
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
                            "actionId": "dynamic_AAABACcaAAAAAJpO",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Add Image to Comment",
                            "id": "dynamic_AAABACcaAAAAAJpO",
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
            "dialogAlias": "Workpackage_Documents_Documents",
            "dialogName": "Workpackage_Documents_Documents",
            "tenantId": "${tenantId}",
            "refreshNeeded": false,
            "positionalQueryAbility": "FULL",
            "id": "9",
            "selectedViewId": "AAABACcTAAAAAI-X"
        }],
        "dialogAlias": "Workpackage_Documents_FORM",
        "dialogName": "Workpackage_Documents_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "6",
        "selectedViewId": "AAABACcXAAAAAI9D"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
