import { ArrayUtil } from '../util';
import { DataAnnotation } from './DataAnnotation';
import { NullRecord } from './NullRecord';
import { Property } from './Property';
import { Record } from './Record';
import { RecordBuffer } from './RecordBuffer';
import { RecordImpl } from './RecordImpl';
import { TypeNames } from './types';

/**
 * Utility for working with Records
 */
export class RecordUtil {
    public static newRecord(id: string, properties: Property[], annotations: DataAnnotation[] = []): Record {
        return new RecordImpl(id, ArrayUtil.copy(properties), ArrayUtil.copy(annotations), TypeNames.RecordTypeName);
    }

    public static isRecord(o: any): boolean {
        return o instanceof RecordImpl || o instanceof RecordBuffer || o instanceof NullRecord;
    }

    public static unionRight(l1: Array<Property>, l2: Array<Property>): Array<Property> {
        const result: Array<Property> = ArrayUtil.copy(l1);
        l2.forEach((p2: Property) => {
            if (
                !l1.some((p1: Property, i) => {
                    if (p1.name === p2.name) {
                        result[i] = p2;
                        return true;
                    }
                    return false;
                })
            ) {
                result.push(p2);
            }
        });
        return result;
    }
}
