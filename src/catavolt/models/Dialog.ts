import {Binary} from "./Binary";
import {CatavoltApi} from "../dialog/CatavoltApi";
import {ViewDescriptor} from "./ViewDescriptor";
import {View} from "./View";
import {RecordDef} from "./RecordDef";
import {ReferringObject} from "./ReferringObject";
import {Record} from "./Record";
import {Property} from "./Property";
import {InlineBinaryRef} from "./InlineBinaryRef";
import {EncodedBinary} from "./EncodedBinary";
import {ObjectBinaryRef} from "./ObjectBinaryRef";
import {UrlBinary} from "./UrlBinary";
import {DialogException} from "./DialogException";
import {ErrorMessage} from "./ErrorMessage";
import {Menu} from "./Menu";
import {PropertyDef} from "./PropertyDef";
import {Attachment} from "./Attachment";
import {ActionParameters} from "./ActionParameters";
import {Redirection} from "./Redirection";
import {RedirectionUtil} from "./RedirectionUtil";
import {ReferringDialog} from "./ReferringDialog";
import {ViewMode} from "./types";
import {DialogType} from "./types";
import {DialogMode, DialogModeEnum} from "./types";
import {PropertyFormatter} from "./PropertyFormatter";

/**
 * Top-level class, representing a Catavolt 'Dialog' definition.
 * All Dialogs have a composite {@link View} definition along with a single record
 * or a list of records.  See {@Record}
 */
export abstract class Dialog {

    //statics
    public static BINARY_CHUNK_SIZE = 256 * 1024; //size in  byes for 'read' operation
    private static CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation

    //private/protected
    private _binaryCache: { [index: string]: Binary[] } = {};
    private _lastRefreshTime: Date = new Date(0);
    private _catavolt: CatavoltApi;
    //protected _parentDialog;

    public readonly availableViews: ViewDescriptor[];
    public readonly businessClassName: string;
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

    /* public methods */

    get catavolt(): CatavoltApi {
        return this._catavolt;
    }

    /**
     * Load a Binary property from a record
     * @param propName
     * @param record
     * @returns {}
     */
    public binaryAt(propName: string, record: Record): Promise<Binary> {

        const prop: Property = record.propAtName(propName);
        if (prop) {
            if (prop.value instanceof InlineBinaryRef) {
                const binRef = prop.value as InlineBinaryRef;
                return Promise.resolve(new EncodedBinary(binRef.inlineData, binRef.settings["mime-type"]));
            } else if (prop.value instanceof ObjectBinaryRef) {
                const binRef = prop.value as ObjectBinaryRef;
                if (binRef.settings.webURL) {
                    return Promise.resolve(new UrlBinary(binRef.settings.webURL));
                } else {
                    return this.readBinary(propName, record);
                }
            } else if (typeof prop.value === "string") {
                return Promise.resolve(new UrlBinary(prop.value));
            } else if (prop.value instanceof EncodedBinary) {
                return Promise.resolve(prop.value);

            } else {
                return Promise.reject("No binary found at " + propName);
            }
        } else {
            return Promise.reject("No binary found at " + propName);
        }
    }

    public destroy() {
        //@TODO
        //destroy this dialog
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
        return this.catavolt.dialogApi.changeView(this.tenantId, this.sessionId, this.id, viewId)
            .then((dialog: Dialog) => {
                //any new dialog needs to be initialized with the Catavolt object
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
     * Read all the Binary values in this {@link Record}
     *
     * @param {Record} record
     * @returns {Promise<Binary[]>}
     */
    public readBinaries(record: Record): Promise<Binary[]> {
        return Promise.all(
            this.recordDef.propertyDefs.filter((propDef: PropertyDef) => {
                return propDef.isBinaryType;
            }).map((propDef: PropertyDef) => {
                return this.readBinary(propDef.propertyName, record);
            }),
        );
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

    /* @TODO */
    public writeAttachment(attachment: Attachment): Promise<void> {
        /*
       return DialogService.addAttachment(this.dialogRedirection.dialogHandle, attachment, this.session);
       */
        return Promise.resolve(null);
    }

    public writeAttachments(record: Record): Promise<void[]> {

        return Promise.all(
            record.properties.filter((prop: Property) => {
                return prop.value instanceof Attachment;
            }).map((prop: Property) => {
                const attachment: Attachment = prop.value as Attachment;
                return this.writeAttachment(attachment);
            }),
        );

    }

    /**
     * Write all Binary values in this {@link Record} back to the server
     *
     * @param {Record} record
     * @returns {Promise<void[]>}
     */

    /* @TODO */
    public writeBinaries(record: Record): Promise<void[]> {
        /*return Promise.all(
            record.properties.filter((prop: Property) => {
                return this.propDefAtName(prop.name).isBinaryType;
            }).map((prop: Property) => {
                let writePromise:Promise<XWritePropertyResult> = Promise.resolve({} as XWritePropertyResult);
                if (prop.value) {
                    let ptr: number = 0;
                    const encBin: EncodedBinary = prop.value as EncodedBinary;
                    const data = encBin.data;
                    while (ptr < data.length) {
                        const boundPtr = (ptr: number) => {
                            writePromise = writePromise.then((prevResult) => {
                                const encSegment: string = (ptr + Dialog.CHAR_CHUNK_SIZE) <= data.length ? data.substr(ptr, Dialog.CHAR_CHUNK_SIZE) : data.substring(ptr);
                                return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, ptr != 0, this.session);
                            });
                        }
                        boundPtr(ptr);
                        ptr += Dialog.CHAR_CHUNK_SIZE;
                    }
                } else {
                    // This is a delete
                    writePromise = writePromise.then((prevResult) => {
                        return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, null, false, this.sessionContext);
                    });
                }
                return writePromise;
            })
        );*/

        return Promise.resolve(null);
    }

    public initialize(catavolt: CatavoltApi) {
        this._catavolt = catavolt;
        if (this.children) {
            this.children.forEach((child: Dialog) => {
                //@TODO add this if needed
                //child._parentDialog = this;
                child.initialize(catavolt);
            });
        }
    }

    protected invokeMenuActionWithId(actionId: string, actionParams: ActionParameters): Promise<{ actionId: string } | Redirection> {
        return this.catavolt.dialogApi.performAction(this.catavolt.session.tenantId, this.catavolt.session.id,
            this.id, actionId, actionParams).then((result: { actionId: string } | Redirection) => {

            if (RedirectionUtil.isRedirection(result)) {

                //@TODO - update relevant referring dialog settings on 'this' dialog
                this.updateSettingsWithNewDialogProperties((result as Redirection).referringObject);

                //@TODO -use 'isLocalRefreshNeeded' instead of this - needs to be added to the Dialog API
                if ((result as Redirection).referringObject && (result as Redirection).referringObject['dialogProperties']) {
                    const dialogProps = (result as Redirection).referringObject['dialogProperties'];
                    if ((dialogProps.localRefresh && dialogProps.localRefresh === "true" ||
                            dialogProps.globalRefresh && dialogProps.globalRefresh === "true")) {
                        this.catavolt.dataLastChangedTime = new Date();
                    }
                    //@TODO - also, this check should go away - we will rely on 'isLocalRefreshNeeded' exclusively
                } else if (RedirectionUtil.isNullRedirection(result)) {
                    this.catavolt.dataLastChangedTime = new Date();
                }
            } else {
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
    protected invokeMenuAction(menu: Menu, actionParams: ActionParameters): Promise<{ actionId: string } | Redirection> {
        return this.invokeMenuActionWithId(menu.actionId, actionParams);
    }

    //@TODO
    /**
     *
     * @param {string} propName
     * @param {Record} record
     * @returns {Promise<Binary>}
     */
    protected readBinary(propName: string, record: Record): Promise<Binary> {

        /*
        let seq: number = 0;
        let encodedResult: string = '';
        let inProgress: string = '';
        let f: (XReadPropertyResult) => Promise<Binary> = (result: XReadPropertyResult) => {
            if (result.hasMore) {
                inProgress += atob(result.data);  // If data is in multiple loads, it must be decoded/built/encoded
                return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,
                    propName, ++seq, Dialog.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            } else {
                if (inProgress) {
                    inProgress += atob(result.data);
                    encodedResult = btoa(inProgress);
                } else {
                    encodedResult = result.data;
                }
                return Promise.resolve<Binary>(new EncodedBinary(encodedResult));
            }
        }
        return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,
            propName, seq, Dialog.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            */
        return Promise.resolve(null);
    }

    protected updateSettingsWithNewDialogProperties(referringObject: ReferringObject) {

        if (referringObject) {
            if (referringObject.isDialogReferrer()) {
                //@TODO - remove the uppercase conversion once all DialogModes come back from server as uppercase
                this.dialogMode = (referringObject as ReferringDialog).dialogMode.toUpperCase() as DialogMode;
            }
        }

    }

    /**
     * @private
     * @returns {boolean}
     */
    private get isAnyChildDestroyed(): boolean {
        return this.children && this.children.some((dialog: Dialog) => {
            return dialog.isDestroyed;
        });
    }

}
