import { DataUrl } from '../util/DataUrl';
import { Attachment } from './Attachment';
import { AttributeCellValue } from './AttributeCellValue';
import { Dialog } from './Dialog';
import { LargeProperty } from './LargeProperty';
import { Menu } from './Menu';
import { NullRecord } from './NullRecord';
import { Property } from './Property';
import { PropertyDef } from './PropertyDef';
import { ReadLargePropertyParameters } from './ReadLargePropertyParameters';
import { Record } from './Record';
import { RecordBuffer } from './RecordBuffer';
import { RecordUtil } from './RecordUtil';
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
    public readonly recordId: string;

    private _buffer: RecordBuffer;

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
        return this.catavolt.dialogApi.getAvailableValues(this.tenantId, this.sessionId, this.id, propName);
    }

    /**
     * Returns whether or not this cell definition contains a binary value
     *
     * @param {AttributeCellValue} cellValue
     * @returns {boolean}
     */
    public isBinary(cellValue: AttributeCellValue): boolean {
        const propDef = this.propDefAtName(cellValue.propertyName);
        return propDef && (propDef.isLargePropertyType || (propDef.isURLType && cellValue.isInlineMediaStyle));
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
        return propDef.isSignatureType;
    }

    /**
     * Returns whether or not this property is 'writable'
     * @returns {boolean}
     */
    get isWriteMode(): boolean {
        return this.viewMode === ViewModeEnum.WRITE;
    }

    public performMenuActionWithId(actionId: string, pendingWrites: Record): Promise<Redirection> {
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
    public performMenuAction(menu: Menu, pendingWrites: Record): Promise<Redirection> {
        return this.invokeMenuAction(menu, {
            pendingWrites,
            type: TypeNames.ActionParametersTypeName
        }).then(result => {
            return result;
        });
    }

    /**
     * Properties whose {@link PropertyDef.canCauseSideEffects} value is true, may change other underlying values in the model.
     * This method will update those underlying values, given the property name that is changing, and the new value.
     * This is frequently used with {@link EditorDialog.getAvailableValues}.  When a value is selected, other properties'
     * available values may change. (i.e. Country, State, City dropdowns)
     */
    public processSideEffects(propertyName: string, value: any): Promise<void> {
        return this.catavolt.dialogApi
            .propertyChange(this.tenantId, this.sessionId, this.id, propertyName, value, this.buffer.afterEffects())
            .then((sideEffectsRecord: Record) => {
                const originalProperties = this.buffer.before.properties;
                const userModifiedProperties = this.buffer.afterEffects().properties;
                const sideEffectsProperties = sideEffectsRecord.properties.filter((prop: Property) => {
                    return prop.name !== propertyName;
                });
                this._buffer = RecordBuffer.createRecordBuffer(
                    this.buffer.id,
                    RecordUtil.unionRight(originalProperties, sideEffectsProperties),
                    RecordUtil.unionRight(
                        originalProperties,
                        RecordUtil.unionRight(userModifiedProperties, sideEffectsProperties)
                    ),
                    this.record.annotations
                );
                return Promise.resolve();
            });
    }

    /**
     * Read (load) the {@link Record} assocated with this Editor
     * The record must be read at least once to initialize the Context
     * @returns {Future<Record>}
     */
    public read(): Promise<Record> {
        return this.catavolt.dialogApi.getRecord(this.tenantId, this.sessionId, this.id).then((record: Record) => {
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
            parsedValue = value !== null && value !== undefined ? this.parseValue(value, propDef.propertyName) : null;
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
    public setBinaryPropWithEncodedData(name: string, encodedData: string, mimeType?: string) {
        const propDef: PropertyDef = this.propDefAtName(name);
        if (propDef) {
            const value = new LargeProperty(encodedData, mimeType);
            this.buffer.setValue(propDef.propertyName, value);
        }
    }

    /**
     * Write this record (i.e. {@link Record}} back to the server
     * @returns {Promise<Record | Redirection>}
     */
    public write(): Promise<Record | Redirection> {
        const deltaRec: Record = this.buffer.afterEffects();
        /* Write the 'special' props first */
        return this.writeLargeProperties(deltaRec).then((binResult: void[]) => {
            return this.writeAttachments(deltaRec).then((atResult: void[]) => {
                /* Remove special property types before writing the actual record */
                const writableRecord: Record = this.getWriteableRecord(deltaRec);
                return this.catavolt.dialogApi
                    .putRecord(this.tenantId, this.sessionId, this.id, writableRecord)
                    .then((result: Record | Redirection) => {
                        const now = new Date();
                        this.catavolt.dataLastChangedTime = now;
                        this.lastRefreshTime = now;
                        if (RedirectionUtil.isRedirection(result)) {
                            this.updateSettingsWithNewDialogProperties((result as Redirection).referringObject);
                            return result;
                        } else {
                            this.initBuffer(result as Record);
                            return this.record;
                        }
                    });
            });
        });
    }

    // protected methods

    protected getProperty(propertyName: string, params: ReadLargePropertyParameters): Promise<LargeProperty> {
        return this.catavolt.dialogApi.getEditorProperty(this.tenantId, this.sessionId, this.id, propertyName, params);
    }

    // Private methods

    /**
     * Get the current buffered record
     * @returns {RecordBuffer}
     */
    private get buffer(): RecordBuffer {
        if (!this._buffer) {
            this._buffer = new RecordBuffer(NullRecord.singleton);
        }
        return this._buffer;
    }

    // We have to remove LargeProperties and replace Attachments
    // As they are written separately
    private getWriteableRecord(record: Record): Record {
        const properties = record.properties
            .filter((prop: Property) => {
                /* Remove the Binary(s) as they have been written separately */
                return !this.propDefAtName(prop.name).isLargePropertyType;
            })
            .map((prop: Property) => {
                /*
             Remove the Attachment(s) (as they have been written separately) but replace
             the property value with the file name of the attachment prior to writing
             */
                if (prop.value instanceof Attachment) {
                    const attachment = prop.value as Attachment;
                    return new Property(prop.name, attachment.name, prop.propertyType, prop.format, prop.annotations);
                } else {
                    return prop;
                }
            });

        return RecordUtil.newRecord(record.id, properties, record.annotations);
    }

    private initBuffer(record: Record) {
        this._buffer = record ? new RecordBuffer(record) : new RecordBuffer(NullRecord.singleton);
    }
}
