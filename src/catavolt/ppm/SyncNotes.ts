export class SyncNotes {

    /*

    The record id in the list of Work Packages is: {"C":"'6GW7000A'","N":"Workpackages(Id='6GW7000A')"}
    Selecting the work package generates this action:

    tenants/.../sessions/.../dialogs/Workpackage_General/actions/alias_Open

    {"targets":["{\"C\":\"'6GW7000A'\",\"N\":\"Workpackages(Id='6GW7000A')\"}"],"type":"hxgn.api.dialog.ActionParameters"}

    The associated redirection key is:

    Workpackage_General.alias_Open@eyJDIjoiJzZHVzcwMDBBJyIsIk4iOiJXb3JrcGFja2FnZXMoSWQ9JzZHVzcwMDBBJykifQ==.redirection
    {"C":"'6GW7000A'","N":"Workpackages(Id='6GW7000A')"}

    This presents a list of documents for: {"C":"'6GW7000A'","N":"Workpackages(Id='6GW7000A')"}

    */

    /*

    Tapping the create comment icon on document: {"C":"'6GRT04PA'","N":"FusionDocuments(Id='6GRT04PA')"}

    Workpackage_Documents_Documents@eyJDIjoiJzZHVzcwMDBBJyIsIk4iOiJXb3JrcGFja2FnZXMoSWQ9JzZHVzcwMDBBJykifQ==.alias_CreateComment@eyJDIjoiJzZHUlQwNFBBJyIsIk4iOiJGdXNpb25Eb2N1bWVudHMoSWQ9JzZHUlQwNFBBJykifQ==.redirection
    {"C":"'6GW7000A'","N":"Workpackages(Id='6GW7000A')"}                                                                         {"C":"'6GRT04PA'","N":"FusionDocuments(Id='6GRT04PA')"}

    The following redirection is the resulting content.
    Notice that the referring dialog id is linked back to the action: {"C":"'6GW7000A'","N":"Workpackages(Id='6GW7000A')"}
    And that the record id is the document id: {"C":"'6GRT04PA'","N":"FusionDocuments(Id='6GRT04PA')"}
    */

    private redirection = {
        "dialogMode": "CREATE",
        "referringObject": {
            "dialogMode": "LIST",
            "dialogAlias": "Workpackage_Documents_Documents",
            "dialogProperties": {
                "dialogAliasPath": "{\"DataObject\":\"Workpackage\",\"DataSource\":\"HexagonSDA\",\"Detail\":\"Documents\",\"QuerySection\":\"Documents\",\"ToQuery\":{\"DataObject\":\"Documents\",\"DataSource\":\"HexagonSDA\",\"Query\":\"WorkPackage\"}}",
                "dialogAlias": "Workpackage_Documents_Documents"
            },
            "actionId": "alias_CreateComment",
            "type": "hxgn.api.dialog.ReferringDialog",
            "dialogId": "Workpackage_Documents_Documents@eyJDIjoiJzZHVzcwMDBBJyIsIk4iOiJXb3JrcGFja2FnZXMoSWQ9JzZHVzcwMDBBJykifQ==",
            "dialogName": "Workpackage_Documents_Documents"
        },
        "sessionId": "6562119136c2458fbce7dd90b3bf48f3_989697235_1731_416924230",
        "type": "hxgn.api.dialog.DialogRedirection",
        "dialogId": "Documents_CreateComment_FORM$1526375458365",
        "viewMode": "READ",
        "dialogClassName": "com.catavolt.app.extender.dialog.ZZRunCatavoltSatelliteActionEditorModel",
        "domainClassName": "com.catavolt.app.extender.domain.ZZRunCatavoltSatelliteAction",
        "dialogType": "hxgn.api.dialog.EditorDialog",
        "recordId": "{\"C\":\"'6GRT04PA'\",\"N\":\"FusionDocuments(Id='6GRT04PA')\"}",
        "dialogAlias": "Documents_CreateComment_FORM",
        "tenantId": "hexagonsdaop",
        "refreshNeeded": false,
        "id": "Documents_CreateComment_FORM$1526375458365",
        "dialogName": "Documents_CreateComment_FORM",
        "selectedViewId": "AAABACcaAAAAACfn351699060:1257:331442876:10",
        "dialogDescription": "New Run Action"
    };

}
