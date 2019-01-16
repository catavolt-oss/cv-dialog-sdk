/**
 * *****************************************************
 */

export class DateTimeValue {
    constructor(public dateObj: Date) {}

    public toString() {
        this.dateObj.toISOString();
    }
}
