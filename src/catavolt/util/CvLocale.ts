export class CvLocale {

    constructor(readonly language: string,
                readonly country: string) {
    }

    get langCountryString(): string {
        return `${this.language}-${this.country.toLowerCase()}`;
    }

}
