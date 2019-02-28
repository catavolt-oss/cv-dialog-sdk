import {EditorDialog} from './EditorDialog';
import {Property} from "./Property";
import {PropertyDef} from "./PropertyDef";
import {Redirection} from "./Redirection";
import {FilterOperator, SortDirection, SortDirectionEnum, ViewModeEnum} from "./types";

export const FILTER_VALUE_SUFFIX:string = '_FILTER_VALUE';
export const FILTER_OPERATOR_SUFFIX:string = '_FILTER_OPER';
export const SORT_DIRECTION_SUFFIX:string = '_SORT_DIRECTION';
export const SORT_SEQUENCE_SUFFIX:string = '_SORT_SEQUENCE';
export const KEYWORD_PROPERTY_NAME:string = 'keyword';

export class SearchDialog extends EditorDialog {

    /**
     * Clear the search values currently in the buffer.  Does not submit search.
     */
    public clearSearchValues():void {
        this.record.propNames.filter((propName:string)=>{
            return propName.endsWith(FILTER_OPERATOR_SUFFIX)  ||
                propName.endsWith(FILTER_VALUE_SUFFIX) || propName === KEYWORD_PROPERTY_NAME;
    }).forEach((propName:string)=>{
        this.setPropertyValue(propName, null)});
    }

    /**
     * Clear the sort values currently in the buffer. Does not submit search.
     */
    public clearSortValues():void {
        this.record.propNames.filter((propName:string)=>{
            return propName.endsWith(SORT_DIRECTION_SUFFIX)  ||
                propName.endsWith(SORT_SEQUENCE_SUFFIX);
        }).forEach((propName:string)=>{
            this.setPropertyValue(propName, null)});
    }

    /**
     * Get the current search value for a property name, as a Property
     * @param propName
     */
    public getSearchValuePropertyForName(propName:string):Property {
        return this.record.propAtName(propName + FILTER_VALUE_SUFFIX);
    }

    /**
     * Get the PropertyDef associated with the search value Property
     * @param propName
     */
    public getSearchValuePropertyDefForName(propName:string):PropertyDef {
        return this.propDefAtName(propName + FILTER_VALUE_SUFFIX);
    }

    public getSearchablePropertyNames(): string[] {
        return this.recordDef.propertyDefs.filter((propertyDef:PropertyDef) => {
            return propertyDef.propertyName.endsWith(FILTER_VALUE_SUFFIX);
        }).map(propertyDef => this.getPropertyNameForSearchPropertyName(propertyDef.propertyName));
    }

    public getSortablePropertyNames(): string[] {
        return this.recordDef.propertyDefs.filter((propertyDef:PropertyDef) => {
            return propertyDef.propertyName.endsWith(SORT_DIRECTION_SUFFIX);
        }).map(propertyDef => this.getPropertyNameForSearchPropertyName(propertyDef.propertyName));
    }

    public getPropertyNameForSearchPropertyName(searchPropertyName: string): string {

        if(searchPropertyName.endsWith(FILTER_VALUE_SUFFIX)) {
            return searchPropertyName.substring(0, searchPropertyName.indexOf(FILTER_VALUE_SUFFIX));
        } else if(searchPropertyName.endsWith(FILTER_OPERATOR_SUFFIX)) {
            return searchPropertyName.substring(0, searchPropertyName.indexOf(FILTER_OPERATOR_SUFFIX));
        } else if (searchPropertyName.endsWith(SORT_DIRECTION_SUFFIX)) {
            return searchPropertyName.substring(0, searchPropertyName.indexOf(SORT_DIRECTION_SUFFIX));
        } else if (searchPropertyName.endsWith(SORT_SEQUENCE_SUFFIX)) {
            return searchPropertyName.substring(0, searchPropertyName.indexOf(SORT_SEQUENCE_SUFFIX));
        }
        return null;
    }

    /**
     * Get the current keyword search value.  This is a global substring search
     * across all properties
     */
    public getKeywordSearchValue():Property {
        return this.record.propAtName(KEYWORD_PROPERTY_NAME);
    }

    /**
     * Get the current search operator for a property name, as a Property
     * @param propName
     */
    public getSearchOpPropertyForName(propName:string):Property {
        return this.record.propAtName(propName + FILTER_OPERATOR_SUFFIX);
    }

    /**
     * Get the PropertyDef associated with the search operator Property
     * @param propName
     */
    public getSearchOpPropertyDefForName(propName:string):PropertyDef {
        return this.propDefAtName(propName + FILTER_OPERATOR_SUFFIX);
    }

    /**
     * Get the current sort direction for a property name, as a Property
     * @param propName
     */
    public getSortDirectionPropertyForName(propName:string):Property {
        return this.record.propAtName(propName + SORT_DIRECTION_SUFFIX);
    }

    /**
     * Get the PropertyDef associated with the sort direction
     * @param propName
     */
    public getSortDirectionPropertyDefForName(propName:string):PropertyDef {
        return this.propDefAtName(propName + SORT_DIRECTION_SUFFIX);
    }

    /**
     * Get the current sort priority for a property name, as a Property
     * @param propName
     */
    public getSortPriorityPropertyForName(propName:string):Property {
        return this.record.propAtName(propName + SORT_SEQUENCE_SUFFIX);
    }

    /**
     * Get the PropertyDef associated with the sort priority
     * @param propName
     */
    public getSortPriorityPropertyDefForName(propName:string):PropertyDef {
        return this.propDefAtName(propName + SORT_SEQUENCE_SUFFIX);
    }

    /**
     * Returns whether or not the sort direction for a property is set to ascending
     * @param propName
     */
    public isAscending(propName:string): boolean {
        const dirProp = this.getSortDirectionPropertyForName(propName);
        const dirValue = dirProp ? dirProp.value : null;
        // server may return ASCENDING or ASC and DSC or DESCENDING
        return dirValue && dirValue.indexOf('A') === 0;
    }

    /**
     * Returns whether or not the sort direction for a property is set to descending
     * @param propName
     */
    public isDescending(propName:string): boolean {
        const dirProp = this.getSortDirectionPropertyForName(propName);
        const dirValue = dirProp ? dirProp.value : null;
        // server may return ASCENDING or ASC and DSC or DESCENDING
        return dirValue && dirValue.indexOf('D') === 0;
    }

    /**
     * Reopen the search dialog for writing
     */
    public reopenSearch():Promise<EditorDialog | Redirection> {
       return this.changeViewMode(ViewModeEnum.WRITE);
    }

    /**
     * Set the sort direction for a property to ascending
     * @param propName
     * @param sortFieldPriority
     */
    public setAscending(propName:string, sortFieldPriority:number=0):void {
        this.setSortValue(propName, SortDirectionEnum.ASC, sortFieldPriority);
    }

    /**
     * Set the sort direction for a property to descending
     * @param propName
     * @param sortFieldPriority
     */
    public setDescending(propName:string, sortFieldPriority:number=0):void {
        this.setSortValue(propName, SortDirectionEnum.DESC, sortFieldPriority);
    }

    /**
     * Set the search value for a property
     * @param propName
     * @param searchValue
     */
     public setSearchValue(propName:string, searchValue:string):void {
        this.setPropertyValue(propName + FILTER_VALUE_SUFFIX, searchValue);
     }

    /**
     * Set the search value for the keyword search.  This is a global substring search
     * across all properties
     * @param keyword
     */
     public setKeywordSearchValue(keyword:string):void {
         this.setPropertyValue(KEYWORD_PROPERTY_NAME, keyword);
     }

    /**
     * Set the filter operator type for a property to one of [[FilterOperatorEnum]]
     * @param propName
     * @param operator
     */
     public setSearchValueOperation(propName:string, operator:FilterOperator):void {
        this.setPropertyValue(propName + FILTER_OPERATOR_SUFFIX, operator);
     }

    /**
     * Set the sort direction for a property to one of [[SortDirectionEnum]]
     * @param propName
     * @param sortDirection
     * @param sortFieldPriority
     */
     public setSortValue(propName:string, sortDirection:SortDirection=SortDirectionEnum.ASC, sortFieldPriority:number=0):void {
        this.setPropertyValue(propName + SORT_DIRECTION_SUFFIX, sortDirection);
        this.setPropertyValue(propName + SORT_SEQUENCE_SUFFIX, sortFieldPriority);
     }

    /**
     * Submit the search dialog (write)
     */
    public submitSearch():Promise<EditorDialog | Redirection> {
        return this.write();
     }


}
