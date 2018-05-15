import {RecordSetVisitor} from "../proxy/RecordSetVisitor";
import {RecordVisitor} from "../proxy/RecordVisitor";

/**
 *
 */
export class MobileCommentsRecordSetVisitor extends RecordSetVisitor {

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static emptyRecordSetVisitor(): MobileCommentsRecordSetVisitor {
        return new MobileCommentsRecordSetVisitor(super.emptyRecordSetVisitor().enclosedJsonObject());
    }

    // --- State Management --- //

    public acceptCreateComment(mobileCommentId, recordVisitor: RecordVisitor) {

        const recordDef = {
            "propertyDefs": [{
                "writeAllowed": false,
                "propertyName": "workpackageid",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "tagid",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "name",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "description",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "documentid",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "mobilecommentid",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "picture",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "LARGE_PROPERTY",
                "format": "byte",
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }, {
                "writeAllowed": false,
                "propertyName": "status",
                "canCauseSideEffects": false,
                "upperCaseOnly": false,
                "propertyType": "string",
                "semanticType": "NAME",
                "length": 255,
                "type": "hxgn.api.dialog.PropertyDef",
                "writeEnabled": false
            }], "type": "hxgn.api.dialog.RecordDef"
        };


        // Property names:
        // mobilecommentid, workpackageid, tagid, documentid, name, description, picture, status

        const record = {
            "dialogAlias": "Briefcase_Briefcase_MobileComments",
            "dialogName": "Briefcase_Briefcase_MobileComments",
            "annotations": [],
            "id": mobileCommentId,
            "type": "hxgn.api.dialog.Record",
            "properties": [{
                "name": "mobilecommentid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": mobileCommentId
            },{
                "name": "workpackageid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "tagid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "documentid",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "name",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": recordVisitor.visitPropertyValueAt('P_NAME')
            }, {
                "name": "description",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": recordVisitor.visitPropertyValueAt('P_DESCRIPTION')
            }, {
                "name": "picture",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }, {
                "name": "status",
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": null
            }]
        };

        this.addOrUpdateRecord(new RecordVisitor(record));
    }

}
