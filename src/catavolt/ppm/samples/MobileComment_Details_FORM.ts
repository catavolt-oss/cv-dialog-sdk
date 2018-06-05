/**
 */
export class MobileComment_Details_FORM {

    private static PATH = 'tenants/hexagonsdaop/sessions/9ad5dfd3e9224be3bdfaa5cf8840d88a_1819367476_6538_1632767848/dialogs/69';

    private static RESPONSE = {
        "dialogOrigin": {
            "DataObject": "MobileComment",
            "Form": "FORM",
            "Detail": "Details",
            "DataSource": "HexagonSDA"
        },
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
            "DataObject": "MobileComment",
            "Form": "FORM",
            "Detail": "Details",
            "DataSource": "HexagonSDA"
        },
        "dialogMode": "READ",
        "description": "Mobile Comment: Tad Doc name 29 0718",
        "referringObject": {
            "dialogType": "hxgn.api.dialog.QueryDialog",
            "dialogMode": "LIST",
            "dialogAlias": "Tag_Details_Documents",
            "dialogProperties": {
                "globalRefresh": "true",
                "dialogAliasPath": "{\"Action\":\"ShowLatest\",\"DataObject\":\"Documents\",\"DataSource\":\"HexagonSDA\",\"Form\":\"FORM\"}",
                "dialogAlias": "Documents_ShowLatest_FORM",
                "localRefresh": "true"
            },
            "actionId": "alias_ShowLatest",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "20",
            "dialogName": "Tag_Details_Documents"
        },
        "sessionId": "9ad5dfd3e9224be3bdfaa5cf8840d88a_1819367476_6538_1632767848",
        "type": "hxgn.api.dialog.EditorDialog",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
        "domainClassName": "cx.AAABACcSAAAAACfD.com.catavolt.odata.hexagonsdaopAAABACcRAAAAACdo.Intergraph.SPF.Server.API.Model.MobileComment",
        "recordId": "{\"C\":\"'6HK7000A'\",\"N\":\"MobileComments(Id='6HK7000A')\"}",
        "view": {
            "formLayout": "TABS",
            "name": "Default",
            "formStyle": "INDIVIDUAL_ROUNDED_RECTANGLES",
            "alias": "MobileComment_Details_FORM",
            "id": "FORM_AAABACcXAAAAAC0c_16_1819367476:6538:1632767848:69_null_1",
            "title": "Default",
            "menu": {
                "visible": false,
                "children": [{
                    "visible": true,
                    "modes": ["READ", "WRITE"],
                    "actionId": "alias_OpenLatestFile",
                    "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                    "label": "Open Latest File",
                    "id": "alias_OpenLatestFile",
                    "type": "hxgn.api.dialog.Menu"
                }, {
                    "visible": false,
                    "children": [{
                        "visible": false,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_OpenLatestFile",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Open Latest File",
                        "id": "alias_OpenLatestFile",
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
            "dialogOrigin": {
                "DataObject": "MobileComment",
                "PropertySection": "Properties",
                "Detail": "Details",
                "DataSource": "HexagonSDA"
            },
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
                "DataObject": "MobileComment",
                "PropertySection": "Properties",
                "Detail": "Details",
                "DataSource": "HexagonSDA"
            },
            "dialogMode": "READ",
            "description": "Mobile Comment: Tad Doc name 29 0718",
            "sessionId": "9ad5dfd3e9224be3bdfaa5cf8840d88a_1819367476_6538_1632767848",
            "type": "hxgn.api.dialog.EditorDialog",
            "viewMode": "READ",
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityEditorModel",
            "domainClassName": "cx.AAABACcSAAAAACfD.com.catavolt.odata.hexagonsdaopAAABACcRAAAAACdo.Intergraph.SPF.Server.API.Model.MobileComment",
            "view": {
                "commitButtonText": "Save",
                "gmlMarkup": "<gml>\r    <!--                                                                                                                  colors -->\r    <const colorHeading=\"#333333\"/>\r    <const colorSubHeading=\"#999999\"/>\r    <const colorP=\"#666666\"/>\r    <const colorGreen=\"#666666\"/>\r    <const colorDarkGreen=\"#333333\"/>\r    <const linkColor=\"#000000\"/>\r    <!--                                                                                                                  qualifiers -->\r    <const qualifiers=\"small\" h1=\"18\"/>\r    <const qualifiers=\"medium,large\" h1=\"24\"/>\r    <const qualifiers=\"small\" h2=\"14\"/>\r    <const qualifiers=\"medium,large\" h2=\"20\"/>\r    <const qualifiers=\"small\" h3=\"12\"/>\r    <const qualifiers=\"medium,large\" h3=\"16\"/>\r    <const qualifiers=\"small\" h4=\"13\"/>\r    <const qualifiers=\"medium,large\" h4=\"15\"/>\r    <const qualifiers=\"small\" h5=\"8\"/>\r    <const qualifiers=\"medium,large\" h5=\"15\"/>\r    <const qualifiers=\"small\" p=\"10\"/>\r    <const qualifiers=\"medium,large\" p=\"14\"/>\r    <const qualifiers=\"small\" margin2x=\"20\"/>\r    <const qualifiers=\"medium,large\" margin2x=\"30\"/>\r    <const qualifiers=\"small\" margin=\"5\"/>\r    <const qualifiers=\"medium,large\" margin=\"10\"/>\r    <const qualifiers=\"small\" margin2=\"5\"/>\r    <const qualifiers=\"medium,large\" margin2=\"10\"/>\r    <const qualifiers=\"small\" margin3=\"3\"/>\r    <const qualifiers=\"medium,large\" margin3=\"5\"/>\r    <const meta=\"*meta\"/>\r    <const Scan=\"Scan\"/>\r    <const lblSave=\"Register\"/>\r    <const lblCancel=\"Cancel\"/>\r    <const Sample=\"Sample Constant\"/>\r    <const heading=\"Smart Construction Onsite\"/>\r    <const update=\"Update Now\"/>\r    <const WorkPackage=\"Work Package\"/>\r    <const Name=\"Name\"/>\r    <const Description=\"Description\"/>\r    <const Docs=\"Documents\"/>\r    <const qualifiers=\"small\" h6=\"6\"/>\r    <const qualifiers=\"medium,large\" h6=\"10\"/>\r    <const Created=\"Created: \"/>\r    <const createdby=\"Check-In User\"/>\r    <const WrPackage=\"Details\"/>\r    <const Tags=\"Tags\"/>\r    <const Tags=\"Tags\"/>\r    <const LastMaintained=\"Updated: \"/>\r    <const ShowDocs=\"Docs\"/>\r    <const RevCreated=\"Rev-Crt Date\"/>\r    <const Revcreatedby=\"Rev-Crt User\"/>\r    <const VerCreated=\"Ver-Crt Date\"/>\r    <const Vercreatedby=\"Ver-Crt User\"/>\r    <const Version=\"Version\"/>\r    <const Revision=\"Revision\"/>\r    <const space=\"  \"/>\r    <const Fav=\"Favorites\"/>\r    <const Search=\"Search\"/>\r    <const SessionProp=\"SDA Mobile Test Package\"/>\r    <const SessionCreated=\"2017-10-11\"/>\r    <const SessionUpdated=\"2017-10-11\"/>\r    <const SessionDesc=\"SDA Mobile Test Package\"/>\r    <const WorkPkg=\"Work Package: \"/>\r    <!--                                                                                        Styles -->\r    <style name=\"Buttons\" textColor=\"#ffffff\" backgroundColor=\"#b02067\" textStyle=\"bold\" cornerRadius=\"7\" height=\"50\" orientation=\"horizontal\" margin=\"0,5,0,5\" textSize=\"20\"/>\r    <detail>\r        <div orientation=\"vertical\" qualifiers=\"header\" textSize=\"@const/h2\" backgroundColor=\"#01577d\" textColor=\"#ffffff\" width=\"100%\" margin=\"0,0,5,0\">\r            <plist marginTop=\"5\" marginLeft=\"3\" marginBottom=\"5\" orientation=\"horizontal\" imageSize=\"150,40\">*filler, res:Hexagon_PPM_WHITE_REVERSED.PNG</plist>\r        </div>\r        <!--                                                Header Section End-->\r        <div backgroundColor=\"#cdcfd0\" margin=\"0,3,0,3\" width=\"100%\">\r            <div orientation=\"horizontal\" backgroundColor=\"#ffffff\" width=\"100%\" margin=\"3,3,3,3\">\r                <div orientation=\"vertical\" marginTop=\"@const/margin\" marginLeft=\"@const/margin\" marginRight=\"@const/margin\" marginBottom=\"@const/margin\" backgroundColor=\"#FFFFFF\" width=\"100%\">\r                    <div orientation=\"horizontal\" width=\"100%\">\r                        <div orientation=\"vertical\" backgroundColor=\"#FFFFFF\" width=\"100%\" textSize=\"@const/h3\">\r                            <div orientation=\"horizontal\" textColor=\"#333333\" width=\"100%\">\r                                <div orientation=\"vertical\">\r                                    <plist textStyle=\"bold\" margin=\"5,0,5,0\" textColor=\"#2f8ffa\">Name</plist>\r                                    <plist textSize=\"@const/h5\" labelStyle=\"bold\" margin=\"5,0,5,0\">Description</plist>\r                                </div>\r                                <div orientation=\"horizontal\" labelPlacement=\"none\" imageSize=\"30,30\" actionID=\"alias_OpenLatestFile\">\r                                    <plist margin=\"0,30,0,0\">*filler,res:File.png</plist>\r                                </div>\r                            </div>\r                        </div>\r                    </div>\r                </div>\r            </div>\r        </div>\r    </detail>\r</gml>",
                "editable": false,
                "name": "Default",
                "alias": "MobileComment_Details_Properties",
                "id": "DETAILS_AAABACcdAAAAAC0u_14_1819367476:6538:1632767848:69_null_1",
                "title": "Latest Comment",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "alias_OpenLatestFile",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                        "label": "Open Latest File",
                        "id": "alias_OpenLatestFile",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "children": [{
                            "visible": false,
                            "modes": ["READ", "WRITE"],
                            "actionId": "alias_OpenLatestFile",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/catavolt.png",
                            "label": "Open Latest File",
                            "id": "alias_OpenLatestFile",
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
                }]],
                "cancelButtonText": "Cancel"
            },
            "dialogAlias": "MobileComment_Details_Properties",
            "tenantId": "hexagonsdaop",
            "id": "71",
            "dialogName": "MobileComment_Details_Properties",
            "selectedViewId": "AAABACcXAAAAAC0c"
        }],
        "dialogAlias": "MobileComment_Details_FORM",
        "tenantId": "hexagonsdaop",
        "id": "69",
        "dialogName": "MobileComment_Details_FORM",
        "selectedViewId": "AAABACcXAAAAAC0c"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
