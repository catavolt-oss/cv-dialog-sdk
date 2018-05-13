/**
 */
export class Workpackage_General_FORM {

    private static PATH = 'tenants/${tenantId}/sessions/${sessionId}/dialogs/1';

    private static RESPONSE = {
        "recordDef": {"propertyDefs": [], "type": "hxgn.api.dialog.RecordDef"},
        "dialogAliasPath": {"DataObject": "Workpackage", "Query": "General", "Form": "FORM", "DataSource": "SDALocal"},
        "dialogOrigin": {"DataObject": "Workpackage", "Query": "General", "Form": "FORM", "DataSource": "SDALocal"},
        "dialogMode": "READ",
        "description": "Work Packages",
        "referringObject": {
            "actionId": "WorkPackages",
            "type": "hxgn.api.dialog.ReferringWorkbench",
            "workbenchId": "SDAWorkbenchLOCAL"
        },
        "sessionId": "${sessionId}",
        "type": "hxgn.api.dialog.EditorDialog",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZCatavoltSatelliteEntityDashboardEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZCatavoltSatelliteEntityDashboard",
        "recordId": "AAABACcSAAAAAI59",
        "view": {
            "formLayout": "TOP_DOWN",
            "name": "Default",
            "formStyle": "INDIVIDUAL_ROUNDED_RECTANGLES",
            "alias": "Workpackage_General_FORM",
            "id": "ROOT_FORM1524062186220",
            "type": "hxgn.api.dialog.Form"
        },
        "children": [{
            "recordDef": {
                "propertyDefs": [{
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
                    "propertyName": "Owning_Group",
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
                    "propertyName": "Config",
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
                    "propertyName": "Creation_User",
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
                    "propertyName": "Organizations",
                    "canCauseSideEffects": false,
                    "upperCaseOnly": false,
                    "propertyType": "string",
                    "semanticType": "NAME",
                    "length": 255,
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
                    "propertyName": "Last_Update_Date",
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
                    "propertyName": "Contract",
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
            "dialogAliasPath": {"DataObject": "Workpackage", "Query": "General", "DataSource": "SDALocal"},
            "dialogOrigin": {"DataObject": "Workpackage", "Query": "General", "DataSource": "SDALocal"},
            "dialogMode": "LIST",
            "description": "Work Packages",
            "sessionId": "${sessionId}",
            "type": "hxgn.api.dialog.QueryDialog",
            "viewMode": "READ",
            "supportsPositionalQueries": true,
            "dialogClassName": "com.catavolt.app.extender.dialog.CatavoltSatelliteEntityQueryModel",
            "domainClassName": "cx.AAABACcSAAAAAI59.com.catavolt.sql.hexagonsdaopAAABACcRAAAAAI5o.Workpackage",
            "view": {
                "fixedColumnCount": 3,
                "gmlMarkup": "<gml>\r    <!--                                                                                                    colors -->\r    <const colorHeading=\"#333333\"/>\r    <const colorSubHeading=\"#999999\"/>\r    <const colorP=\"#666666\"/>\r    <const colorGreen=\"#666666\"/>\r    <const colorDarkGreen=\"#333333\"/>\r    <const linkColor=\"#000000\"/>\r    <!--                                                                                                    qualifiers -->\r    <const qualifiers=\"small\" h1=\"18\"/>\r    <const qualifiers=\"medium,large\" h1=\"24\"/>\r    <const qualifiers=\"small\" h2=\"14\"/>\r    <const qualifiers=\"medium,large\" h2=\"20\"/>\r    <const qualifiers=\"small\" h3=\"10\"/>\r    <const qualifiers=\"medium,large\" h3=\"16\"/>\r    <const qualifiers=\"small\" h4=\"13\"/>\r    <const qualifiers=\"medium,large\" h4=\"15\"/>\r    <const qualifiers=\"small\" h5=\"8\"/>\r    <const qualifiers=\"medium,large\" h5=\"15\"/>\r    <const qualifiers=\"small\" p=\"10\"/>\r    <const qualifiers=\"medium,large\" p=\"14\"/>\r    <const qualifiers=\"small\" margin2x=\"20\"/>\r    <const qualifiers=\"medium,large\" margin2x=\"30\"/>\r    <const qualifiers=\"small\" margin=\"2\"/>\r    <const qualifiers=\"medium,large\" margin=\"3\"/>\r    <const qualifiers=\"small\" margin2=\"5\"/>\r    <const qualifiers=\"medium,large\" margin2=\"10\"/>\r    <const qualifiers=\"small\" margin3=\"3\"/>\r    <const qualifiers=\"medium,large\" margin3=\"5\"/>\r    <const meta=\"*meta\"/>\r    <const lblSave=\"Register\"/>\r    <const lblCancel=\"Cancel\"/>\r    <const Docs=\"Documents\"/>\r    <const Tags=\"Tags\"/>\r    <const Fav=\"Favorites\"/>\r    <const Search=\"Search\"/>\r    <const Scan=\"Scan\"/>\r    <const updated=\"Updated\"/>\r    <const Created=\"Created\"/>\r    <const session=\"\"/>\r    <const Space=\"  \"/>\r    <const WP=\"Work Package\"/>\r    <const Discipline=\"Discipline\"/>\r    <!--                                                                          Styles -->\r    <style name=\"Buttons\" textColor=\"#ffffff\" backgroundColor=\"#b02067\" textStyle=\"bold\" cornerRadius=\"7\" height=\"50\" orientation=\"horizontal\" margin=\"0,5,0,5\" textSize=\"20\" />\r    <list>\r        <div orientation=\"vertical\" width=\"100%\" qualifiers=\"header\">\r            <div orientation=\"vertical\" imageSize=\"150,50\" backgroundColor=\"#01577d\" width=\"100%\">\r                <plist orientation=\"horizontal\" marginBottom=\"5\">*filler, res:Hexagon_PPM_WHITE_REVERSED.PNG, @const/Space</plist>\r            </div>\r            <line lineColor=\"#cdcfd0\" lineThickness=\"1\"></line>\r            <div orientation=\"horizontal\" width=\"100%\" backgroundColor=\"#01577d\">\r                <div orientation=\"horizontal\" width=\"100%\" textColor=\"#ffffff\" textStyle=\"bold\" textSize=\"@const/h3\" padding=\"3,3,3,3\" height=\"20\">\r                    <div orientation=\"horizontal\" width=\"30%\">\r                        <plist>@const/WP</plist>\r                    </div>\r                    <div orientation=\"horizontal\" width=\"20%\">\r                        <plist>@const/Discipline</plist>\r                    </div>\r                    <div orientation=\"horizontal\" width=\"25%\">\r                        <plist>@const/Created</plist>\r                    </div>\r                    <div orientation=\"horizontal\" width=\"25%\">\r                        <plist>@const/updated</plist>\r                    </div>\r                </div>\r            </div>\r        </div>\r        <div orientation=\"vertical\" backgroundColor=\"#cdcfd0\" width=\"100%\" margin=\"0,1,0,1\" textColor=\"#000000\">\r            <div orientation=\"vertical\" width=\"100%\" backgroundColor=\"#ffffff\" margin=\"3,3,3,3\">\r                <div orientation=\"horizontal\" width=\"100%\" textSize=\"@const/h3\" backgroundColor=\"#ffffff\" marginBottom=\"@const/margin\" marginLeft=\"@const/margin\" marginRight=\"@const/margin\" marginTop=\"@const/margin\">\r                    <div orientation=\"horizontal\" width=\"30%\">\r                        <plist textStyle=\"bold\" textColor=\"#2f8ffa\" margin=\"3,0,3,0\" labelPlacement=\"none\">Name</plist>\r                    </div>\r                    <div orientation=\"vertical\" width=\"20%\">\r                        <plist margin=\"3,0,3,0\" labelPlacement=\"none\">Disciplines</plist>\r                    </div>\r                    <div orientation=\"horizontal\" width=\"25%\">\r                        <plist margin=\"3,0,3,0\" orientation=\"horizontal\" labelPlacement=\"none\">Creation_Date</plist>\r                    </div>\r                    <div orientation=\"horizontal\" labelStyle=\"bold\" width=\"25%\">\r                        <plist orientation=\"horizontal\" margin=\"3,0,3,0\" labelPlacement=\"none\">Last_Update_Date</plist>\r                        <conditional property=\"Id\" operator=\"EQ\" operandConstant=\"@const/session\">\r                            <plist imageSize=\"18,18\" orientation=\"horizontal\" marginLeft=\"5\">*filler, res:Favorites.png, *filler</plist>\r                        </conditional>\r                    </div>\r                </div>\r                <div orientation=\"vertical\" width=\"100%\" textSize=\"@const/h3\" marginBottom=\"@const/margin\" marginLeft=\"@const/margin\" marginRight=\"@const/margin\" marginTop=\"@const/margin\" backgroundColor=\"#ffffff\">\r                    <plist labelStyle=\"bold\" labelPlacement=\"none\">Description</plist>\r                </div>\r            </div>\r        </div>\r        <div orientation=\"horizontal\" backgroundColor=\"#cdcfd0\" imageSize=\"20,20\" qualifiers=\"footer\" height=\"50\" width=\"100%\" textSize=\"@const/h5\">\r            <div width=\"33%\" orientation=\"vertical\" align=\"center\" actionID=\"#search\">\r                <plist orientation=\"horizontal\">res:Search.png</plist>\r                <plist orientation=\"horizontal\" textStyle=\"bold\">@const/Search</plist>\r            </div>\r            <div orientation=\"vertical\" width=\"34%\" align=\"center\" actionID=\"alias_Scan\">\r                <plist orientation=\"vertical\">res:Scan2.png</plist>\r                <plist textStyle=\"bold\">@const/Scan</plist>\r            </div>\r            <div orientation=\"vertical\" width=\"33%\" align=\"center\">\r                <plist orientation=\"vertical\">res:Favorites.png</plist>\r                <plist textStyle=\"bold\">@const/Fav</plist>\r            </div>\r        </div>\r    </list>\r</gml>",
                "columns": [{
                    "propertyName": "Id",
                    "heading": "Id",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Classification",
                    "heading": "Classification",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Creation_User",
                    "heading": "Creation User",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Config",
                    "heading": "Config",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Contract",
                    "heading": "Contract",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Description",
                    "heading": "Description",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Creation_Date",
                    "heading": "Creation Date",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Disciplines",
                    "heading": "Disciplines",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Name",
                    "heading": "Name",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Organizations",
                    "heading": "Organizations",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Owning_Group",
                    "heading": "Owning Group",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "UID",
                    "heading": "UID",
                    "type": "hxgn.api.dialog.Column"
                }, {
                    "propertyName": "Last_Update_Date",
                    "heading": "Last Update Date",
                    "type": "hxgn.api.dialog.Column"
                }],
                "name": "Default",
                "alias": "Workpackage_General",
                "style": "DEFAULT",
                "id": "TABLE_DEF1524062186220",
                "menu": {
                    "visible": false,
                    "children": [{
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "open",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/open.png",
                        "label": "Open",
                        "id": "open",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": true,
                        "modes": ["READ", "WRITE"],
                        "actionId": "edit",
                        "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/update.png",
                        "label": "Edit",
                        "id": "edit",
                        "type": "hxgn.api.dialog.Menu"
                    }, {
                        "visible": false,
                        "children": [{
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "open",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/open.png",
                            "label": "Open",
                            "id": "open",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
                            "visible": true,
                            "modes": ["READ", "WRITE"],
                            "actionId": "edit",
                            "iconUrl": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/action/update.png",
                            "label": "Edit",
                            "id": "edit",
                            "type": "hxgn.api.dialog.Menu"
                        }, {
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
            "dialogAlias": "Workpackage_General",
            "dialogName": "Workpackage_General",
            "tenantId": "${tenantId}",
            "refreshNeeded": false,
            "positionalQueryAbility": "FULL",
            "id": "2",
            "selectedViewId": "AAABACcTAAAAAI6b"
        }],
        "dialogAlias": "Workpackage_General_FORM",
        "dialogName": "Workpackage_General_FORM",
        "tenantId": "${tenantId}",
        "refreshNeeded": false,
        "id": "1",
        "selectedViewId": "ZZCatavoltSatelliteEntityDashboard_EditorView_Default"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
