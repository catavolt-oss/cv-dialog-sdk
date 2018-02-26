import { PropertyDef } from './PropertyDef';

/**
 * In the same way that a {@link PropertyDef} describes a {@link Property}, a RecordDef describes an {@link Record}.
 * It is composed of {@link PropertyDef}s while the {@link Record} is composed of {@link Property}s.
 * In other words it describes the structure or makeup of a row or record, but does not contain the data values themselves.
 * The corresponding {@link Record} contains the actual values.
 */
export class RecordDef {
    public readonly propertyDefs: PropertyDef[];

    get propCount(): number {
        return this.propertyDefs.length;
    }

    public propDefAtName(name: string): PropertyDef {
        let propDef: PropertyDef = null;
        this.propertyDefs.some(p => {
            if (p.propertyName === name) {
                propDef = p;
                return true;
            }
            return false;
        });
        return propDef;
    }

    get propNames(): string[] {
        return this.propertyDefs.map(p => {
            return p.propertyName;
        });
    }
}
