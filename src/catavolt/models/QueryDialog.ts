import { Column } from './Column';
import { Dialog } from './Dialog';
import { LargeProperty } from './LargeProperty';
import { Menu } from './Menu';
import { QueryParameters } from './QueryParameters';
import { QueryMarkerOption, QueryScroller } from './QueryScroller';
import { ReadLargePropertyParameters } from './ReadLargePropertyParameters';
import { RecordSet } from './RecordSet';
import { Redirection } from './Redirection';
import { TypeNames } from './types';
import { QueryDirection } from './types';
import { PositionalQueryAbilityType } from './types';

/**
 * Dialog Subtype that represents a 'Query Dialog'.
 * A 'Query' represents and is backed by a list of Records and a single Record definition.
 * See {@link Record} and {@link RecordDef}.
 */
export class QueryDialog extends Dialog {
    public positionalQueryAbility: PositionalQueryAbilityType;
    public supportsColumnStatistics: boolean;
    public supportsPositionalQueries: boolean;

    private _scroller: QueryScroller;
    private _defaultActionId: string;

    get defaultActionId(): string {
        return this._defaultActionId;
    }

    public initScroller(
        pageSize: number,
        firstRecordId: string = null,
        markerOptions: QueryMarkerOption[] = [QueryMarkerOption.None]
    ) {
        this._scroller = new QueryScroller(this, pageSize, firstRecordId, markerOptions);
    }

    public isBinary(column: Column): boolean {
        const propDef = this.propDefAtName(column.propertyName);
        return propDef && (propDef.isLargePropertyType || (propDef.isURLType && propDef.isInlineMediaStyle));
    }

    public performMenuActionWithId(actionId: string, targets: string[]): Promise<Redirection> {
        return this.invokeMenuActionWithId(actionId, {
            targets,
            type: TypeNames.ActionParametersTypeName
        }).then(result => {
            return result;
        });
    }

    /**
     * Perform this action associated with the given Menu on this dialog.
     * The targets array is expected to be an array of object ids.
     * @param {Menu} menu
     * @param {Array<string>} targets
     * @returns {Promise<{actionId: string} | Redirection>}
     */
    public performMenuAction(menu: Menu, targets: string[]): Promise<Redirection> {
        return this.invokeMenuAction(menu, {
            targets,
            type: TypeNames.ActionParametersTypeName
        }).then(result => {
            return result;
        });
    }

    /**
     * Perform a query
     *
     * @param {number} maxRows
     * @param {QueryDirection} direction
     * @param {string} fromRecordId
     * @returns {Promise<RecordSet>}
     */
    public query(maxRows: number, direction: QueryDirection, fromRecordId: string): Promise<RecordSet> {
        const queryParams: QueryParameters = fromRecordId
            ? {
                  fetchDirection: direction,
                  fetchMaxRecords: maxRows,
                  fromRecordId,
                  type: TypeNames.QueryParametersTypeName
              }
            : {
                  fetchDirection: direction,
                  fetchMaxRecords: maxRows,
                  type: TypeNames.QueryParametersTypeName
              };

        return this.catavolt.dialogApi
            .getRecords(this.catavolt.session.tenantId, this.catavolt.session.id, this.id, queryParams)
            .then((recordSet: RecordSet) => {
                this.lastRefreshTime = new Date();
                this._defaultActionId = recordSet.defaultActionId;
                return recordSet;
            });
    }

    /**
     * Get the associated QueryScroller
     * @returns {QueryScroller}
     */
    get scroller(): QueryScroller {
        if (!this._scroller) {
            this._scroller = this.defaultScroller();
        }
        return this._scroller;
    }

    protected getProperty(propertyName: string, params: ReadLargePropertyParameters): Promise<LargeProperty> {
        return this.catavolt.dialogApi.getQueryProperty(this.tenantId, this.sessionId, this.id, propertyName, params);
    }

    /**
     * Creates a new QueryScroller with default buffer size of 50
     * @returns {QueryScroller}
     */
    private defaultScroller(): QueryScroller {
        return new QueryScroller(this, 50, null, [QueryMarkerOption.None]);
    }
}
