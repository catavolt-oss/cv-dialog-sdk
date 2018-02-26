import { WorkbenchAction } from './WorkbenchAction';

export interface Workbench {
    readonly actions: ReadonlyArray<WorkbenchAction>;
    readonly id: string;
    readonly name: string;
    readonly offlineCapable: boolean;
}
