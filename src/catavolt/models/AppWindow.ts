import { Workbench } from './Workbench';
import { WorkbenchAction } from './WorkbenchAction';

export interface AppWindow {
    readonly initialAction: WorkbenchAction;
    readonly notificationsAction: WorkbenchAction;
    readonly windowHeight: number;
    readonly windowWidth: number;
    readonly windowTitle: string;
    readonly workbenches: ReadonlyArray<Workbench>;
}
