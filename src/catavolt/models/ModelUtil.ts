import { Log } from '../util/Log';
import { ObjUtil } from '../util/ObjUtil';
import { StringDictionary } from '../util/StringDictionary';
import { AttributeCellValue } from './AttributeCellValue';
import { BarcodeScan } from './BarcodeScan';
import { Calendar } from './Calendar';
import { CodeRef } from './CodeRef';
import { DataAnnotation } from './DataAnnotation';
import { Details } from './Details';
import { DialogException } from './DialogException';
import { EditorDialog } from './EditorDialog';
import { ForcedLineCellValue } from './ForcedLineCellValue';
import { Form } from './Form';
import { GpsReading } from './GpsReading';
import { GpsReadingProperty } from './GpsReadingProperty';
import { Graph } from './Graph';
import { InlineBinaryRef } from './InlineBinaryRef';
import { LabelCellValue } from './LabelCellValue';
import { List } from './List';
import { Map } from './Map';
import { MapLocation } from './MapLocation';
import { MapLocationProperty } from './MapLocationProperty';
import { Menu } from './Menu';
import { ObjectBinaryRef } from './ObjectBinaryRef';
import { ObjectRef } from './ObjectRef';
import { Property } from './Property';
import { PropertyDef } from './PropertyDef';
import { QueryDialog } from './QueryDialog';
import { RecordDef } from './RecordDef';
import { RecordImpl } from './RecordImpl';
import { ReferringDialog } from './ReferringDialog';
import { ReferringWorkbench } from './ReferringWorkbench';
import { Stream } from './Stream';
import { SubstitutionCellValue } from './SubstitutionCellValue';
import { TabCellValue } from './TabCellValue';
import { ViewDescriptor } from './ViewDescriptor';

export class ModelUtil {
    private static classTypes = {
        'hxgn.api.dialog.Annotation': DataAnnotation,
        'hxgn.api.dialog.AttributeCellValue': AttributeCellValue,
        'hxgn.api.dialog.TabCellValue': TabCellValue,
        'hxgn.api.dialog.BarcodeScan': BarcodeScan,
        'hxgn.api.dialog.Calendar': Calendar,
        'hxgn.api.dialog.CodeRef': CodeRef,
        'hxgn.api.dialog.Details': Details,
        'hxgn.api.dialog.DialogException': DialogException,
        'hxgn.api.dialog.EditorDialog': EditorDialog,
        'hxgn.api.dialog.ForcedLineCellValue': ForcedLineCellValue,
        'hxgn.api.dialog.Form': Form,
        'hxgn.api.dialog.GpsReading': GpsReading,
        'hxgn.api.dialog.GpsReadingProperty': GpsReadingProperty,
        'hxgn.api.dialog.MapLocation': MapLocation,
        'hxgn.api.dialog.MapLocationProperty': MapLocationProperty,
        'hxgn.api.dialog.Graph': Graph,
        'hxgn.api.dialog.InlineBinaryRef': InlineBinaryRef,
        'hxgn.api.dialog.LabelCellValue': LabelCellValue,
        'hxgn.api.dialog.List': List,
        'hxgn.api.dialog.Map': Map,
        'hxgn.api.dialog.Menu': Menu,
        'hxgn.api.dialog.ObjectBinaryRef': ObjectBinaryRef,
        'hxgn.api.dialog.ObjectRef': ObjectRef,
        'hxgn.api.dialog.Property': Property,
        'hxgn.api.dialog.PropertyDef': PropertyDef,
        'hxgn.api.dialog.QueryDialog': QueryDialog,
        'hxgn.api.dialog.Record': RecordImpl,
        'hxgn.api.dialog.RecordDef': RecordDef,
        'hxgn.api.dialog.ReferringDialog': ReferringDialog,
        'hxgn.api.dialog.ReferringWorkbench': ReferringWorkbench,
        'hxgn.api.dialog.Stream': Stream,
        'hxgn.api.dialog.SubstitutionCellValue': SubstitutionCellValue,
        'hxgn.api.dialog.ViewDescriptor': ViewDescriptor
    };

    private static classType(name) {
        return ModelUtil.classTypes[name];
    }

    private static typeInstance(name) {
        const type = ModelUtil.classType(name);
        return type && new type();
    }

    public static jsonToModel<A>(obj, n = 0): Promise<A> {
        const indent = n * 4;

        if (Array.isArray(obj)) {
            // Log.debug(`${' '.repeat(indent)}=> Deserializing Array....`);
            return ModelUtil.deserializeArray(obj);
        } else {
            const objType = obj.type;
            // Log.debug(`${' '.repeat(indent)}=> Deserializing ${objType}`);
            return new Promise<A>((resolve, reject) => {
                // if the class has a fromJSON method, use it
                const classType = ModelUtil.classType(objType);
                if (classType && typeof classType.fromJSON === 'function') {
                    resolve(classType.fromJSON(obj));
                } else {
                    let newObj = ModelUtil.typeInstance(objType);
                    if (!newObj) {
                        // const message = `ModelUtil::jsonToModel: no type constructor found for ${objType}: assuming interface`;
                        // Log.debug(message);
                        newObj = {}; // assume it's an interface
                    }
                    // otherwise, copy field values
                    Promise.all(
                        Object.keys(obj).map(prop => {
                            const value = obj[prop];
                            // Log.debug(`${' '.repeat(indent)}prop: ${prop} is type ${typeof value}`);
                            if (value && typeof value === 'object') {
                                if (Array.isArray(value) || 'type' in value) {
                                    return ModelUtil.jsonToModel(value, ++n).then(model => {
                                        ModelUtil.assignProp(prop, model, newObj, objType, indent);
                                    });
                                } else {
                                    ModelUtil.assignProp(prop, value, newObj, objType, indent);
                                    return Promise.resolve();
                                }
                            } else {
                                ModelUtil.assignProp(prop, value, newObj, objType, indent);
                                return Promise.resolve();
                            }
                        })
                    )
                        .then(result => {
                            resolve(newObj);
                        })
                        .catch(error => reject(error));
                }
            });
        }
    }

    public static modelToJson(obj, filterFn?: (prop) => boolean): StringDictionary {
        return ObjUtil.copyNonNullFieldsOnly(obj, {}, prop => {
            return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
        });
    }

    private static deserializeArray(array: any[]): Promise<any> {
        return Promise.all(
            array.map(value => {
                if (value && typeof value === 'object') {
                    return ModelUtil.jsonToModel(value);
                } else {
                    return Promise.resolve(value);
                }
            })
        );
    }

    private static assignProp(prop, value, target, type, n) {
        try {
            if ('_' + prop in target) {
                target['_' + prop] = value;
                // Log.debug(`${' '.repeat(n)}Assigning private prop _${prop} = ${value}`);
            } else {
                // it may be public prop
                if (prop in target) {
                    // Log.debug(`${' '.repeat(n)}Assigning public prop ${prop} = ${value}`);
                } else {
                    // it's either a readonly prop or defined in an interface
                    // in which case it's will not already exist on the target object
                    // Log.debug(`${' '.repeat(n)}Defining ${prop} on target for ${type}`);
                }
                target[prop] = value;
            }
        } catch (error) {
            Log.error(`ModelUtil::assignProp: Failed to set prop: ${prop} on target: ${error}`);
        }
    }
}
