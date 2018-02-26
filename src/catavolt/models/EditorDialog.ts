import { DataUrl } from '../util/DataUrl';
import { Attachment } from './Attachment';
import { AttributeCellValue } from './AttributeCellValue';
import { Dialog } from './Dialog';
import { EncodedBinary } from './EncodedBinary';
import { Menu } from './Menu';
import { NullRecord } from './NullRecord';
import { Property } from './Property';
import { PropertyDef } from './PropertyDef';
import { Record } from './Record';
import { RecordBuffer } from './RecordBuffer';
import { Redirection } from './Redirection';
import { RedirectionUtil } from './RedirectionUtil';
import { TypeNames } from './types';
import { ViewMode } from './types';
import { ViewModeEnum } from './types';

/**
 * PanContext Subtype that represents an 'Editor Dialog'.
 * An 'Editor' represents and is backed by a single Record and Record definition.
 * See {@link Record} and {@link RecordDef}.
 */
export class EditorDialog extends Dialog {
    public readonly businessId: string;

    private _buffer: RecordBuffer;

    // @TODO - remove this
    private _isFirstReadComplete: boolean;

    /**
     * Get the current buffered record
     * @returns {RecordBuffer}
     */
    get buffer(): RecordBuffer {
        if (!this._buffer) {
            this._buffer = new RecordBuffer(NullRecord.singleton);
        }
        return this._buffer;
    }

    public changeViewMode(viewMode: ViewMode): Promise<EditorDialog> {
        if (this.viewMode !== viewMode) {
            return this.catavolt.dialogApi
                .changeMode(this.tenantId, this.sessionId, this.id, viewMode)
                .then((dialog: EditorDialog) => {
                    // any new dialog needs to be initialized with the Catavolt object
                    dialog.initialize(this.catavolt);
                    this.updateSettingsWithNewDialogProperties(dialog.referringObject);
                    return dialog;
                });
        }
    }

    /**
     * Get the associated entity record
     * @returns {Record}
     */
    get record(): Record {
        return this._buffer.toRecord();
    }

    /**
     * Get the current version of the entity record, with any pending changes present
     * @returns {Record}
     */
    get recordNow(): Record {
        return this.record;
    }

    public getAvailableValues(propName: string): Promise<any[]> {
        return this.catavolt.dialogApi.getAvailableValues(
            this.tenantId,
            this.sessionId,
            this.id,
            propName
        );
    }

    /**
     * Returns whether or not this cell definition contains a binary value
     *
     * @param {AttributeCellValue} cellValue
     * @returns {boolean}
     */
    public isBinary(cellValue: AttributeCellValue): boolean {
        const propDef = this.propDefAtName(cellValue.propertyName);
        return (
            propDef && (propDef.isBinaryType || (propDef.isURLType && cellValue.isInlineMediaStyle))
        );
    }

    /**
     * Returns whether or not the buffers contain valid data via a successful read operation.
     * @returns {boolean}
     */
    get isFirstReadComplete(): boolean {
        return this._isFirstReadComplete;
    }

    /**
     * Returns whether or not this Editor is in 'read' mode
     * @returns {boolean}
     */
    get isReadMode(): boolean {
        return this.viewMode === ViewModeEnum.READ;
    }

    /**
     * Returns whether or not this property is read-only
     * @param propName
     * @returns {boolean}
     */
    public isReadModeFor(propName: string): boolean {
        if (!this.isReadMode) {
            const propDef = this.propDefAtName(propName);
            return !propDef || !propDef.writeAllowed || !propDef.writeEnabled;
        }
        return true;
    }

    /**
     * Returns whether or not this cell definition contains a binary value that should be treated as a signature control
     * @param cellValueDef
     * @returns {PropertyDef|boolean}
     */
    public isSignature(cellValueDef: AttributeCellValue): boolean {
        const propDef = this.propDefAtName(cellValueDef.propertyName);
        return this.isBinary(cellValueDef) && propDef.isSignatureType;
    }

    /**
     * Returns whether or not this property is 'writable'
     * @returns {boolean}
     */
    get isWriteMode(): boolean {
        return this.viewMode === ViewModeEnum.WRITE;
    }

    public performMenuActionWithId(
        actionId: string,
        pendingWrites: Record
    ): Promise<{ actionId: string } | Redirection> {
        return this.invokeMenuActionWithId(actionId, {
            pendingWrites,
            type: TypeNames.ActionParametersTypeName
        }).then(result => {
            return result;
        });
    }

    /**
     * Perform the action associated with the given Menu on this EditorDialog
     * Given that the Editor could possibly be destroyed as a result of this action,
     * any provided pending writes will be saved if present.
     * @param {Menu} menu
     * @param {Record} pendingWrites
     * @returns {Promise<{actionId: string} | Redirection>}
     */
    public performMenuAction(
        menu: Menu,
        pendingWrites: Record
    ): Promise<{ actionId: string } | Redirection> {
        return this.invokeMenuAction(menu, {
            pendingWrites,
            type: TypeNames.ActionParametersTypeName
        }).then(result => {
            return result;
        });
    }

    /**
     * Properties whose {@link PropDef.canCauseSideEffects} value is true, may change other underlying values in the model.
     * This method will update those underlying values, given the property name that is changing, and the new value.
     * This is frequently used with {@link EditorContext.getAvailableValues}.  When a value is seleted, other properties
     * available values may change. (i.e. Country, State, City dropdowns)
     * @param propertyName
     * @param value
     * @returns {Future<null>}
     */
    // @TODO
    public processSideEffects(propertyName: string, value: any): Promise<void> {
        /*
        var sideEffectsFr: Future<Record> = DialogService.processSideEffects(this.paneDef.dialogHandle,
            this.sessionContext, propertyName, value, this.buffer.afterEffects()).map((changeResult: XPropertyChangeResult) => {
            return changeResult.sideEffects ? changeResult.sideEffects.record : new NullRecord();
        });

        return sideEffectsFr.map((sideEffectsRec: Record) => {
            var originalProps = this.buffer.before.props;
            var userEffects = this.buffer.afterEffects().props;
            var sideEffects = sideEffectsRec.props;
            sideEffects = sideEffects.filter((prop: Prop) => {
                return prop.name !== propertyName;
            });
            this._buffer = RecordBuffer.createRecordBuffer(this.buffer.objectId,
                RecordUtil.union(originalProps, sideEffects),
                RecordUtil.union(originalProps, RecordUtil.union(userEffects, sideEffects)));
            return null;
        });
        */

        return Promise.resolve(null);
    }

    /**
     * Read (load) the {@link Record} assocated with this Editor
     * The record must be read at least once to initialize the Context
     * @returns {Future<Record>}
     */
    public read(): Promise<Record> {
        return this.catavolt.dialogApi
            .getRecord(this.tenantId, this.sessionId, this.id)
            .then((record: Record) => {
                this._isFirstReadComplete = true;
                this.initBuffer(record);
                this.lastRefreshTime = new Date();
                return this.record;
            });
    }

    /**
     * Set the value of a property in this {@link Record}.
     * Values may be already constructed target types (CodeRef, TimeValue, Date, etc.)
     * or primitives, in which case the values will be parsed and objects constructed as necessary.
     * @param name
     * @param value
     * @returns {any}
     */
    public setPropValue(name: string, value: any): any {
        const propDef: PropertyDef = this.propDefAtName(name);
        let parsedValue: any = null;
        if (propDef) {
            parsedValue =
                value !== null && value !== undefined
                    ? this.parseValue(value, propDef.propertyName)
                    : null;
            this.buffer.setValue(propDef.propertyName, parsedValue);
        }
        return parsedValue;
    }

    /**
     * Set a binary property from a string formatted as a 'data url'
     * See {@link https://en.wikipedia.org/wiki/Data_URI_scheme}
     * @param name
     * @param dataUrl
     */
    public setBinaryPropWithDataUrl(name: string, dataUrl: string) {
        if (dataUrl) {
            const urlObj: DataUrl = new DataUrl(dataUrl);
            this.setBinaryPropWithEncodedData(name, urlObj.data, urlObj.mimeType);
        } else {
            this.setPropValue(name, null); // Property is being deleted/cleared
        }
    }

    /**
     * Set a binary property with base64 encoded data
     * @param name
     * @param encodedData
     * @param mimeType
     */
    public setBinaryPropWithEncodedData(name: string, encodedData: string, mimeType: string) {
        const propDef: PropertyDef = this.propDefAtName(name);
        if (propDef) {
            const value = new EncodedBinary(encodedData, mimeType);
            this.buffer.setValue(propDef.propertyName, value);
        }
    }

    /**
     * Write this record (i.e. {@link Record}} back to the server
     * @returns {Promise<Record | Redirection>}
     */
    public write(): Promise<Record | Redirection> {
        let deltaRec: Record = this.buffer.afterEffects();

        /* Write the 'special' props first */
        return this.writeBinaries(deltaRec).then((binResult: void[]) => {
            return this.writeAttachments(deltaRec).then((atResult: void[]) => {
                /* Remove special property types before writing the actual record */
                deltaRec = this.removeSpecialProps(deltaRec);
                return this.catavolt.dialogApi
                    .putRecord(this.tenantId, this.sessionId, this.id, deltaRec)
                    .then((result: Record | Redirection) => {
                        const now = new Date();
                        this.catavolt.dataLastChangedTime = now;
                        this.lastRefreshTime = now;
                        if (RedirectionUtil.isRedirection(result)) {
                            this.updateSettingsWithNewDialogProperties(
                                (result as Redirection).referringObject
                            );
                        } else {
                            this.initBuffer(result as Record);
                        }
                        return result as Record | Redirection;
                    });
            });
        });
    }

    // Private methods
    /*
        @TODO
        Consider clone and deep copy here, to avoid potential ui side-effects
     */
    private removeSpecialProps(record: Record): Record {
        record.properties = record.properties
            .filter((prop: Property) => {
                /* Remove the Binary(s) as they have been written seperately */
                return !this.propDefAtName(prop.name).isBinaryType;
            })
            .map((prop: Property) => {
                /*
             Remove the Attachment(s) (as they have been written seperately) but replace
             the property value with the file name of the attachment prior to writing
             */
                if (prop.value instanceof Attachment) {
                    const attachment = prop.value as Attachment;
                    return new Property(
                        prop.name,
                        attachment.name,
                        prop.propertyType,
                        prop.format,
                        prop.annotations
                    );
                } else {
                    return prop;
                }
            });
        return record;
    }

    private initBuffer(record: Record) {
        this._buffer = record ? new RecordBuffer(record) : new RecordBuffer(NullRecord.singleton);
    }
}
