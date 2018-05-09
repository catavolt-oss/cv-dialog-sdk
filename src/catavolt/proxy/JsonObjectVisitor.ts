/**
 *
 */
export interface JsonObjectVisitor {
    // --- State Import/Export --- //

    copyAsJsonObject(): object;

    copyAsJsonString(): string;

    enclosedJsonObject();
}
