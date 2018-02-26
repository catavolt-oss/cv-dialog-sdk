import { DialogMessageMessageType } from './types';

export interface DialogMessage {
    /**
     * A short language-independent identifier
     */
    readonly code: string;

    readonly messageType: DialogMessageMessageType;
    /**
     * A human-readable informative description. If a code is provided, then this message explains the meaning of the code.
     */
    readonly message: string;
    /**
     * An object typically provided to help programmers diagnose an error.
     * For example, a cause can be the name of a host programming exception.
     */
    readonly cause: any;
    /**
     * This property is provided when the message pertains to one or more properties in a user interface view.
     */
    readonly propertyNames: string[];
    /**
     * If this message is a generalization or aggregation, then children messages can be used to explain the individual facets.
     */
    readonly children: DialogMessage[];
    /**
     * If the case of a host programming error, this property contains a stack trace of the host programming language.
     */
    readonly stackTrace: string;

    readonly type: string;
}
