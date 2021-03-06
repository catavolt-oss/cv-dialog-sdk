import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";
import {RecordVisitor} from "./RecordVisitor";

/**
 *
 */
export class RecordSetVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (!value) {
            throw new Error('RecordSetVisitor -- null value exception')
        }
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isRecordSetModel(this._enclosedJsonObject)) {
            throw new Error("Object passed to RecordSetVisitor is not a RecordSet");
        }
        if (!this._enclosedJsonObject.records) {
            throw new Error('Invalid record set -- missing records field');
        }
        if (!Array.isArray(this._enclosedJsonObject.records)) {
            throw new Error('Invalid record set -- records field is not an array');
        }
    }

    // --- State Management Helpers --- //

    public static addOrUpdateRecord(jsonObject: object, recordState: RecordVisitor) {
        (new RecordSetVisitor(jsonObject)).addOrUpdateRecord(recordState);
    }

    public static emptyRecordSetVisitor(): RecordSetVisitor {
        return new RecordSetVisitor({
            defaultActionId: null,
            records: [],
            hasMore: false,
            type: "hxgn.api.dialog.RecordSet"
        });
    }

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.enclosedJsonObject());
    }

    public enclosedJsonObject() {
        return this._enclosedJsonObject;
    }

    // --- State Management --- //

    public addOrUpdateAllRecords(recordSetState: RecordSetVisitor) {
        for (const r of recordSetState.enclosedJsonObject().records) {
            this.addOrUpdateRecord(new RecordVisitor(r));
        }
    }

    public addOrUpdateRecord(recordState: RecordVisitor) {
        let found = false;
        const recordCopy = JSON.parse(JSON.stringify(recordState.enclosedJsonObject()));
        for (const r of this.enclosedJsonObject().records) {
            if (r.id === recordCopy.id) {
                for (const k of Object.keys(r)) {
                    r[k] = recordCopy[k];
                }
                found = true;
                break;
            }
        }
        if (!found) {
            this.enclosedJsonObject().records.push(recordCopy);
        }
    }

    public fromRecordId(recordId: string) {
        if (!recordId) {
            return;
        }
        const records = [];
        let found = false;
        for (const r of this.visitRecords()) {
            if (found) {
                records.push(r);
            } else {
                if (r.visitRecordId() === recordId) {
                    found = true;
                }
            }
        }
        return this.enclosedJsonObject().records = records;
    }

    public recordCount(): number {
        return this.enclosedJsonObject().records.length;
    }

    public visitAndClearRecords() {
        this.enclosedJsonObject().records = [];
    }

    public visitHasMore(): boolean {
        return this.enclosedJsonObject().hasMore;
    }

    public visitAndSetHasMore(hasMore: boolean) {
        this.enclosedJsonObject().hasMore = hasMore;
    }

    public visitRecordAtId(id: string): RecordVisitor {
        for (const r of this.visitRecords()) {
            if (r.visitRecordId() === id) {
                return r;
            }
        }
        return null;
    }

    public *visitRecords(): IterableIterator<RecordVisitor> {
        let index = 0;
        while (index < this.enclosedJsonObject().records.length) {
            yield new RecordVisitor(this.enclosedJsonObject().records[index++]);
        }
    }

}
