import {Dialog} from "./Dialog";
import {Column} from "./Column";
import {Redirection} from "./Redirection";
import {Menu} from "./Menu";
import {RecordSet} from "./RecordSet";
import {QueryParameters} from "./QueryParameters";
import {TypeNames} from "./types";
import {QueryMarkerOption, QueryScroller} from "./QueryScroller";
import {QueryDirection} from "./types";
import {PositionalQueryAbilityType} from "./types";

/**
 * Dialog Subtype that represents a 'Query Dialog'.
 * A 'Query' represents and is backed by a list of Records and a single Record definition.
 * See {@link Record} and {@link RecordDef}.
 */
export class QueryDialog extends Dialog {

    private _scroller: QueryScroller;
    private _defaultActionId: string;

    public positionalQueryAbility: PositionalQueryAbilityType;
    public supportsColumnStatistics: boolean;
    public supportsPositionalQueries: boolean;

    get defaultActionId(): string {
        return this._defaultActionId;
    }

    public initScroller(pageSize: number, firstObjectId: string = null, markerOptions: QueryMarkerOption[] = [QueryMarkerOption.None]) {
        this._scroller = new QueryScroller(this, pageSize, firstObjectId, markerOptions);
    }

    public isBinary(column: Column): boolean {
        const propDef = this.propDefAtName(column.propertyName);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && propDef.isInlineMediaStyle));
    }

    public performMenuActionWithId(actionId: string, targets: string[]): Promise<{ actionId: string } | Redirection> {
        return this.invokeMenuActionWithId(actionId, {
            targets,
            type: TypeNames.ActionParametersTypeName,
        }).then((result) => {
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
    public performMenuAction(menu: Menu, targets: string[]): Promise<{ actionId: string } | Redirection> {
        return this.invokeMenuAction(menu, {
            targets,
            type: TypeNames.ActionParametersTypeName,
        }).then((result) => {
            return result;
        });

    }

    /**
     * Perform a query
     *
     * @param {number} maxRows
     * @param {QueryDirection} direction
     * @param {string} fromObjectId
     * @returns {Promise<RecordSet>}
     */
    public query(maxRows: number, direction: QueryDirection, fromObjectId: string): Promise<RecordSet> {

        const queryParams: QueryParameters = fromObjectId ?
            {
                fetchDirection: direction,
                fetchMaxRecords: maxRows,
                fromBusinessId: fromObjectId,
                type: TypeNames.QueryParametersTypeName,
            } :
            {fetchDirection: direction, fetchMaxRecords: maxRows, type: TypeNames.QueryParametersTypeName};

        return this.catavolt.dialogApi.getRecords(this.catavolt.session.tenantId, this.catavolt.session.id, this.id, queryParams)
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

    /**
     * Creates a new QueryScroller with default buffer size of 50
     * @returns {QueryScroller}
     */
    private defaultScroller(): QueryScroller {
        return new QueryScroller(this, 50, null, [QueryMarkerOption.None]);
    }

}
