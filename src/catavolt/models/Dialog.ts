import { DialogService } from '../dialog';
import { CatavoltApi } from '../dialog/CatavoltApi';
import { StreamConsumer } from '../io/StreamConsumer';
import { Base64 } from '../util/Base64';
import { Log } from '../util/Log';
import { ActionParameters } from './ActionParameters';
import { Attachment } from './Attachment';
import { DialogException } from './DialogException';
import { ErrorMessage } from './ErrorMessage';
import { LargeProperty } from './LargeProperty';
import { Menu } from './Menu';
import { Property } from './Property';
import { PropertyDef } from './PropertyDef';
import { PropertyFormatter } from './PropertyFormatter';
import { ReadLargePropertyParameters } from './ReadLargePropertyParameters';
import { Record } from './Record';
import { RecordDef } from './RecordDef';
import { Redirection } from './Redirection';
import { RedirectionUtil } from './RedirectionUtil';
import { ReferringDialog } from './ReferringDialog';
import { ReferringObject } from './ReferringObject';
import { DialogType } from './types';
import { DialogMode, DialogModeEnum } from './types';
import { TypeNames, ViewMode } from './types';
import { View } from './View';
import { ViewDescriptor } from './ViewDescriptor';
import { WriteLargePropertyParameters } from './WriteLargePropertyParams';

/**
 * Top-level class, representing a Catavolt 'Dialog' definition.
 * All Dialogs have a composite {@link View} definition along with a single record
 * or a list of records.  See {@Record}
 */
export abstract class Dialog {
    // statics
    public static BINARY_CHUNK_SIZE = 256 * 1024; // size in  byes for 'read' operation
    private static CHAR_CHUNK_SIZE = 128 * 1000; // size in chars for encoded 'write' operation

    public readonly availableViews: ViewDescriptor[];
    public readonly domainClassName: string;
    public readonly children: Dialog[] = [];
    public readonly description: string;
    public readonly dialogClassName: string;
    public dialogMode: DialogMode;
    public readonly header: View;
    public readonly id: string;
    public readonly recordDef: RecordDef;
    public readonly referringObject: ReferringObject;
    public readonly selectedViewId: string;
    public readonly sessionId: string;
    public readonly tenantId: string;
    public readonly type: DialogType;
    public readonly view: View;
    public readonly viewMode: ViewMode;

    // private/protected
    private _lastRefreshTime: Date = new Date(0);
    private _catavolt: CatavoltApi;
    // protected _parentDialog;

    /* public methods */

    get catavolt(): CatavoltApi {
        return this._catavolt;
    }

    public destroy(): Promise<void> {
        return this.catavolt.dialogApi.deleteDialog(this.tenantId, this.sessionId, this.id).then(() => {
            this.dialogMode = DialogModeEnum.DESTROYED;
        });
    }

    /**
     * Return the error associated with this dialog, if any
     * @returns {}
     */
    get error(): DialogException {
        if (this.hasError) {
            return (this.view as ErrorMessage).exception;
        } else {
            return null;
        }
    }

    /**
     * Find a menu def on this dialog with the given actionId
     * @param actionId
     * @returns {Menu}
     */
    public findMenuAt(actionId: string) {
        return this.view.findMenuAt(actionId);
    }

    /**
     * Get a string representation of this property suitable for 'reading'
     *
     * @param {Property} prop
     * @param {string} propName
     * @returns {string}
     */

    public formatForRead(prop: Property, propName: string): string {
        return PropertyFormatter.singleton(this._catavolt).formatForRead(prop, this.propDefAtName(propName));
    }

    /**
     * Get a string representation of this property suitable for 'writing'
     *
     * @param {Property} prop
     * @param {string} propName
     * @returns {string}
     */
    public formatForWrite(prop: Property, propName: string): string {
        return PropertyFormatter.singleton(this.catavolt).formatForWrite(prop, this.propDefAtName(propName));
    }

    /**
     * Returns whether or not this dialog loaded properly
     * @returns {boolean}
     */
    get hasError(): boolean {
        return this.view instanceof ErrorMessage;
    }

    /**
     * Returns whether or not this Form is destroyed
     * @returns {boolean}
     */
    get isDestroyed(): boolean {
        return this.dialogMode === DialogModeEnum.DESTROYED || this.isAnyChildDestroyed;
    }

    /**
     * Returns whether or not the data in this dialog is out of date
     * @returns {boolean}
     */
    get isRefreshNeeded(): boolean {
        return this._lastRefreshTime.getTime() < this.catavolt.dataLastChangedTime.getTime();
    }

    /**
     * Get the last time this dialog's data was refreshed
     * @returns {Date}
     */
    get lastRefreshTime(): Date {
        return this._lastRefreshTime;
    }

    /**
     * @param time
     */
    set lastRefreshTime(time: Date) {
        this._lastRefreshTime = time;
    }

    /**
     * Get the all {@link Menu}'s associated with this dialog
     * @returns {Array<Menu>}
     */
    get menu(): Menu {
        return this.view.menu;
    }

    public openViewWithId(viewId: string): Promise<Dialog> {
        return this.catavolt.dialogApi
            .changeView(this.tenantId, this.sessionId, this.id, viewId)
            .then((dialog: Dialog) => {
                // any new dialog needs to be initialized with the Catavolt object
                dialog.initialize(this.catavolt);
                this.updateSettingsWithNewDialogProperties(dialog.referringObject);
                return dialog;
            });
    }

    public openView(targetViewDescriptor: ViewDescriptor): Promise<Dialog> {
        return this.openViewWithId(targetViewDescriptor.id);
    }

    /**
     * Get the title of this dialog
     * @returns {string}
     */
    get paneTitle(): string {
        let title = this.view.findTitle();
        if (!title) {
            title = this.description;
        }
        return title;
    }

    /**
     * Parses a value to prepare for 'writing' back to the server
     * @param formattedValue
     * @param propName
     * @returns {}
     */
    public parseValue(formattedValue: any, propName: string): any {
        return PropertyFormatter.singleton(this._catavolt).parse(formattedValue, this.propDefAtName(propName));
    }

    /**
     * Get the property definition for a property name
     * @param propName
     * @returns {PropertyDef}
     */
    public propDefAtName(propName: string): PropertyDef {
        return this.recordDef.propDefAtName(propName);
    }

    /**
     * Read all the large property values into memory in this {@link Record}
     *
     * @param {string} recordId
     * @returns {Promise<LargeProperty[]>}
     */
    public readLargeProperties(recordId: string): Promise<LargeProperty[]> {
        return Promise.all(
            this.recordDef.propertyDefs
                .filter((propDef: PropertyDef) => {
                    return propDef.isLargePropertyType;
                })
                .map((propDef: PropertyDef) => {
                    return this.readLargeProperty(propDef.propertyName, recordId);
                })
        );
    }

    /**
     * Read a large property into memory
     *
     * @param {string} propertyName
     * @param {string} recordId
     * @returns {Promise<LargeProperty>}
     */
    public readLargeProperty(propertyName: string, recordId?: string): Promise<LargeProperty> {
        return this.loadLargeProperty(propertyName, recordId);
    }

    /**
     * Stream the encoded chunks of a large property without retaining them
     * The streamConsumer will receive Base64 encoded chunks with callbacks. hasMore will
     * be false with the final chunk.
     * @param {StreamConsumer} streamConsumer
     * @param {string} propertyName
     * @param {string} recordId
     * @returns {Promise<LargeProperty>}
     */

    public streamLargeProperty(
        streamConsumer: StreamConsumer,
        propertyName: string,
        recordId?: string
    ): Promise<LargeProperty> {
        return this.loadLargeProperty(propertyName, recordId, streamConsumer);
    }

    /*
    get parentDialog():Dialog {
        return this._parentDialog;
    }
    */

    /**
     * Get the all {@link ViewDescriptor}'s associated with this Form
     * @returns {Array<ViewDescriptor>}
     */
    get viewDescs(): ViewDescriptor[] {
        return this.availableViews;
    }

    public initialize(catavolt: CatavoltApi) {
        this._catavolt = catavolt;
        if (this.children) {
            this.children.forEach((child: Dialog) => {
                // @TODO add this if needed
                // child._parentDialog = this;
                child.initialize(catavolt);
            });
        }
    }

    protected invokeMenuActionWithId(actionId: string, actionParams: ActionParameters): Promise<Redirection> {
        return this.catavolt.dialogApi
            .performAction(this.tenantId, this.sessionId, this.id, actionId, actionParams)
            .then((result: Redirection) => {
                // Redirection.refreshNeeded
                // @TODO - update relevant referring dialog settings on 'this' dialog
                this.updateSettingsWithNewDialogProperties(result.referringObject);
                if (result.refreshNeeded) {
                    this.catavolt.dataLastChangedTime = new Date();
                }
                return result;
            });
    }

    /**
     * Perform this action associated with the given Menu on this dialog.
     * The targets array is expected to be an array of object ids.
     * @param {Menu} menu
     * @param {ActionParameters} actionParams
     * @returns {Promise<{actionId: string} | Redirection>}
     */
    protected invokeMenuAction(menu: Menu, actionParams: ActionParameters): Promise<Redirection> {
        return this.invokeMenuActionWithId(menu.actionId, actionParams);
    }

    protected updateSettingsWithNewDialogProperties(referringObject: ReferringObject) {
        if (referringObject) {
            if (referringObject.isDialogReferrer()) {
                // @TODO - remove the uppercase conversion once all DialogModes come back from server as uppercase
                this.dialogMode = (referringObject as ReferringDialog).dialogMode.toUpperCase() as DialogMode;
            }
        }
    }

    // protected abstract

    protected abstract getProperty(params: ReadLargePropertyParameters, propertyName?: string): Promise<LargeProperty>;

    /* @TODO */
    protected writeAttachment(attachment: Attachment): Promise<void> {
        /*
         return DialogService.addAttachment(this.dialogRedirection.dialogHandle, attachment, this.session);
         */
        return Promise.resolve(null);
    }

    protected writeAttachments(record: Record): Promise<void[]> {
        return Promise.all(
            record.properties
                .filter((prop: Property) => {
                    return prop.value instanceof Attachment;
                })
                .map((prop: Property) => {
                    const attachment: Attachment = prop.value as Attachment;
                    return this.writeAttachment(attachment);
                })
        );
    }

    /**
     * Write all Binary values in this {@link Record} back to the server
     *
     * @param {Record} record
     * @returns {Promise<void[]>}
     */
    protected writeLargeProperties(record: Record): Promise<void[]> {
        return Promise.all(
            record.properties
                .filter((prop: Property) => {
                    return this.propDefAtName(prop.name).isLargePropertyType;
                })
                .map((prop: Property) => {
                    return this.writeLargeProperty(prop.name, prop.value as LargeProperty);
                })
        );
    }

    protected writeLargeProperty(propertyName: string, largeProperty: LargeProperty): Promise<void> {
        const data = Base64.decodeString(largeProperty.encodedData);
        const f: (prt: number) => Promise<void> = (ptr: number) => {
            if (ptr < data.length) {
                const segment: string =
                    ptr + Dialog.CHAR_CHUNK_SIZE <= data.length
                        ? data.substr(ptr, Dialog.CHAR_CHUNK_SIZE)
                        : data.substring(ptr);
                const params: WriteLargePropertyParameters = {
                    append: ptr !== 0,
                    encodedData: Base64.encodeString(segment),
                    type: TypeNames.WriteLargePropertyParameters
                };
                return this.catavolt.dialogApi
                    .writeProperty(this.tenantId, this.sessionId, this.id, propertyName, params)
                    .then(() => {
                        f(ptr + Dialog.CHAR_CHUNK_SIZE);
                    });
            } else {
                return Promise.resolve();
            }
        };

        // This is a delete
        if (!largeProperty || !largeProperty.encodedData) {
            return this.catavolt.dialogApi
                .writeProperty(this.tenantId, this.sessionId, this.id, propertyName, {
                    append: false,
                    encodedData: null,
                    type: TypeNames.WriteLargePropertyParameters
                })
                .then(() => Promise.resolve());
        }

        return f(0);
    }

    /**
     * @private
     * @returns {boolean}
     */
    private get isAnyChildDestroyed(): boolean {
        return (
            this.children &&
            this.children.some((dialog: Dialog) => {
                return dialog.isDestroyed;
            })
        );
    }

    /**
     * Read a large property into memory or stream it, if a streamConsumer is provided
     * @param {string} propertyName
     * @param {string} recordId
     * @param {StreamConsumer} streamConsumer
     * @returns {Promise<LargeProperty>}
     */
    private loadLargeProperty(
        propertyName: string,
        recordId: string,
        streamConsumer?: StreamConsumer
    ): Promise<LargeProperty> {
        return Dialog.loadLargeProperty(this.getProperty.bind(this), streamConsumer, propertyName, recordId);
    }

    /**
     * Read a large property into memory or stream it, if a streamConsumer is provided
     * The actual service call that retrieves the result is delegate to the 'getPropertyFn'
     * @param {(params: ReadLargePropertyParameters, propertyName?: string) => Promise<LargeProperty>} getPropertyFn
     * @param {StreamConsumer} streamConsumer
     * @param {string} propertyName
     * @param {string} recordId
     * @returns {Promise<LargeProperty>}
     */
    public static async loadLargeProperty(
        getPropertyFn: (params: ReadLargePropertyParameters, propertyName?: string) => Promise<LargeProperty>,
        streamConsumer?: StreamConsumer,
        propertyName?: string,
        recordId?: string
    ): Promise<LargeProperty> {
        let sequence: number = 0;
        let resultBuffer: string = '';
        const initParams: ReadLargePropertyParameters = {
            maxBytes: Dialog.BINARY_CHUNK_SIZE,
            sequence,
            recordId,
            type: TypeNames.ReadLargePropertyParameters
        };
        let largeProperty = await getPropertyFn(initParams, propertyName);
        streamConsumer && streamConsumer({ done: !largeProperty.hasMore, value: largeProperty.encodedData });
        if (largeProperty.hasMore) {
            do {
                if (!streamConsumer) {
                    resultBuffer += Base64.decodeString(largeProperty.encodedData);
                }
                const params: ReadLargePropertyParameters = {
                    maxBytes: Dialog.BINARY_CHUNK_SIZE,
                    sequence: ++sequence,
                    recordId,
                    type: TypeNames.ReadLargePropertyParameters
                };
                largeProperty = await getPropertyFn(params, propertyName);
                streamConsumer && streamConsumer({ done: !largeProperty.hasMore, value: largeProperty.encodedData });
            } while(largeProperty.hasMore)
        }
        if (resultBuffer) {
            resultBuffer += Base64.decodeString(largeProperty.encodedData);
            return largeProperty.asNewLargeProperty(Base64.encodeString(resultBuffer));
        } else {
            if (streamConsumer) {
                return largeProperty.asNewLargeProperty(null);
            }
            return largeProperty.asNewLargeProperty(largeProperty.encodedData);
        }
    }
}
