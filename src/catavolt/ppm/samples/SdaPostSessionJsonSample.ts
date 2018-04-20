/**
 * This JSON example is the top EditorDialog returned in response to launching
 * "Work Packages" from the SDA Workbench.
 */
export class SdaPostSessionJsonSample {

    private static PATH = 'tenants/${tenantId}/sessions';

    private static BODY = {
        "userId": "${userId}",
        "password": "${password}",
        "clientType": "MOBILE",
        "deviceProperties": {
            "catavoltSdkVersion": "4.5.2",
            "platform": "browser",
            "deviceTime": "2018-04-18T10:26:21-04:00",
            "deviceTimeZone": "America/New_York"
        },
        "type": "hxgn.api.dialog.Login"
    };

    private static RESPONSE = {
        "appVersion": null,
        "serverVersion": "3.515.0",
        "secretKey": "aa879f8ad3114e9ebf41acb57c637bcb",
        "currentDivision": "AAABAABiAAAAAACg:Hexagon SDA",
        "tenantId": "${tenantid}",
        "serverAssignment": "https://euw.catavolt.net/vs601",
        "id": "${sessionId}",
        "type": "hxgn.api.dialog.Session",
        "appVendors": ["Catavolt"],
        "tenantProperties": {
            "noSaveRequiredActions": "launchDataObjectNSR launchGMLEditorNSR launchActionNSR launchDiagnosticsNSR",
            "ExternalSessionToken": "",
            "browserLocale": "{}",
            "GMLAssetsURL": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/gml/",
            "currencySymbol": "",
            "savePassword": "true",
            "clientTimeoutMinutes": "60",
            "useThirdPartyApps": "true",
            "brandingLoginJSON": "{\"backgroundColor\":\"#c0c0c0\",\"backgroundPlacement\":\"stretch\",\"backgroundURL\":\"https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/branding/intergraph_background.jpg\",\"bottomLogoPlacement\":\"bottom\",\"bottomLogoSize\":15,\"bottomLogoURL\":\"https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/branding/powered-by-catavolt.png\",\"fontColor\":\"#1C5590\",\"topLogoMaxUpScale\":250,\"topLogoSize\":35,\"topLogoURL\":\"https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/branding/Hexagon_Logo_PPM.png\",\"version\":\"1511187624979\"}",
            "logoURL": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/logo/logo.png",
            "GMLDefaults": "",
            "suppressDiagnosticInfo": "false",
            "brandingLauncherJSON": "{\"backgroundColor\":\"#c0c0c0\",\"backgroundPlacement\":\"stretch\",\"backgroundURL\":\"https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/branding/intergraph_background.jpg\",\"bottomLogoPlacement\":\"right\",\"bottomLogoSize\":5,\"bottomLogoURL\":\"https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/branding/powered-by-catavolt.png\",\"fontColor\":\"#FFFFFF\",\"imageIsTile\":\"false\",\"tileColor\":\"#01577D\",\"tileSizeL\":160,\"tileSizeM\":140,\"tileSizeS\":120,\"topLogoMaxUpScale\":150,\"topLogoPlacement\":\"center\",\"topLogoSize\":15,\"topLogoURL\":\"https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/branding/Hexagon_Logo_PPM.png\",\"version\":\"1511187728186\"}",
            "FormAssetsURL": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/forms/",
            "refreshLocalImages": "1",
            "forbidJailbrokenDevices": "false",
            "crittercismIdAndroid": "53e0d1cd466eda4741000005",
            "crittercismIdIOS": "53e3a0d183fb7942d6000005"
        },
        "appWindow": {
            "windowHeight": 0,
            "windowTitle": "Hexagon SDA Web Portal",
            "workbenches": [{
                "offlineCapable": false,
                "name": "Smart Digital Asset (LOCAL)",
                "id": "SDAWorkbenchLOCAL",
                "type": "hxgn.api.dialog.Workbench",
                "actions": [{
                    "iconBase": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/images/sitemap.png",
                    "name": "Work Packages (Local)",
                    "actionId": "WorkPackages",
                    "id": "WorkPackages",
                    "type": "hxgn.api.dialog.WorkbenchAction",
                    "workbenchId": "SDAWorkbenchLOCAL"
                }, {
                    "iconBase": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/images/briefcase-icon.png",
                    "name": "Briefcase",
                    "actionId": "Briefcase",
                    "id": "Briefcase",
                    "type": "hxgn.api.dialog.WorkbenchAction",
                    "workbenchId": "SDAWorkbenchLOCAL"
                }, {
                    "iconBase": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/images/Scan2.png",
                    "name": "Files",
                    "actionId": "Files",
                    "id": "Files",
                    "type": "hxgn.api.dialog.WorkbenchAction",
                    "workbenchId": "SDAWorkbenchLOCAL"
                }]
            }, {
                "offlineCapable": false,
                "name": "Smart Digital Asset",
                "id": "SDAWorkbench",
                "type": "hxgn.api.dialog.Workbench",
                "actions": [{
                    "iconBase": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/images/WorkOrder2.png",
                    "name": "Work Packages",
                    "actionId": "WorkPackages",
                    "id": "WorkPackages",
                    "type": "hxgn.api.dialog.WorkbenchAction",
                    "workbenchId": "SDAWorkbench"
                }, {
                    "iconBase": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/${tenantid}/images/briefcase.jpg",
                    "name": "Briefcase",
                    "actionId": "AAABACfaAAAAAF9I",
                    "id": "AAABACfaAAAAAF9I",
                    "type": "hxgn.api.dialog.WorkbenchAction",
                    "workbenchId": "SDAWorkbench"
                }, {
                    "iconBase": "https://s3-eu-west-1.amazonaws.com/res-euw.catavolt.net/catavoltres/images/object/catavolt.png",
                    "name": "Files",
                    "actionId": "Files",
                    "id": "Files",
                    "type": "hxgn.api.dialog.WorkbenchAction",
                    "workbenchId": "SDAWorkbench"
                }]
            }],
            "type": "hxgn.api.dialog.AppWindow",
            "windowWidth": 0
        },
        "userId": "${userId}"
    };

    public static copyOfResponse(): object {
        return JSON.parse(JSON.stringify(this.RESPONSE));
    }

}
