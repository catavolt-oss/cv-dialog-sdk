/**
 * *****************************************************
 */

export class TimeValue {
    public static fromString(timeString: string): TimeValue {
        /* expecting hh:mm:ss.lll */
        const [hours = '0', minutes = '0', secondsPart = '0.0'] = timeString.split(':');
        const [seconds = '0', millis = '0'] = secondsPart.split('.');

        return new TimeValue(Number(hours), Number(minutes), Number(seconds), Number(millis));
    }

    public static fromDateValue(dateValue: Date) {
        return new TimeValue(
            dateValue.getHours(),
            dateValue.getMinutes(),
            dateValue.getSeconds(),
            dateValue.getMilliseconds()
        );
    }

    constructor(public hours: number, public minutes: number, public seconds: number, public millis: number) {}

    public toString(): string {
        return `${this.pad(this.hours.toString())}:${this.pad(this.minutes.toString())}:${this.pad(
            this.seconds.toString()
        )}.${this.pad(this.millis.toString(), '000')}`;
    }

    public toDateValue(): Date {
        const d = new Date();
        d.setHours(this.hours, this.minutes, this.seconds, this.millis);
        return d;
    }

    private pad(s: string, pad: string = '00') {
        return (pad + s).substring(s.length);
    }
}
