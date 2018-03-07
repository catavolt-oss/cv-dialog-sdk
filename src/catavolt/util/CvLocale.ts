export class CvLocale {
    constructor(readonly language: string, readonly country?: string) {}

    get langCountryString(): string {
        if(this.country) {
            return `${this.language.toLowerCase()}-${this.country.toLowerCase()}`;
        } else {
            return this.language.toLowerCase();
        }
    }
}
