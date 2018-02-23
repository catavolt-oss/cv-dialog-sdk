import {AppWindow} from "./AppWindow";
import {StringDictionary} from "../util/StringDictionary";

export interface Session {

    readonly appVendors: ReadonlyArray<string>;
    /**
     * Current version of the underlying application (business) logic. This is not the middleware version.
     */
    readonly appVersion: string;
    readonly appWindow: AppWindow;
    /**
     * Current division is analagous to a \"sub-tenant\" and it's possible for users to tailor different desktops based
     * on their division.
     */
    readonly currentDivision: string;
    readonly id: string;
    readonly tenantId: string;
    /**
     * The dialog layer interacts with an application endpoint, transparent to the user interface. The serverAssignment
     * is not used by the user interface directly, but this value can be useful when diagnosing problems.
     */
    readonly serverAssignment: string;
    /**
     * Current version of the underlying middleware (not the application logic)
     */
    readonly serverVersion: string;
    /**
     * The tenantProperties object is arbitrary, its values are dynamically defined and it is used to return
     * tenant-specific values to the requesting client.
     */
    readonly tenantProperties: StringDictionary;

    readonly type: string;

    readonly userId: string;

}
