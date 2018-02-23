export interface WorkbenchAction {

    /**
     * An alternative unique identifier. An alias is typically used to identify an action that is used in offline mode.
     * An alias should be more descriptive than the id, therefore an alias makes offline logic more descriptive. descriptive.
     */
    readonly actionId?: string;
    readonly alias: string;
    readonly id: string;
    readonly iconBase: string;
    readonly name: string;
    readonly workbenchId: string;

}
