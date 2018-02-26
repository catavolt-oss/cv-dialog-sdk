import { FilterOperator } from './types';

/**
 * *********************************
 */

export interface Filter {
    readonly not: boolean;
    readonly operand1: any;
    readonly operator: FilterOperator;
    readonly operand2: any;
}
