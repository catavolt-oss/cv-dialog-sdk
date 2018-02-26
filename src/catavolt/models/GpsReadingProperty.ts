export class GpsReadingProperty {
    constructor(
        readonly accuracy: number,
        readonly latitude: number,
        readonly longitude: number,
        readonly source: string,
        readonly type: string
    ) {}
}
