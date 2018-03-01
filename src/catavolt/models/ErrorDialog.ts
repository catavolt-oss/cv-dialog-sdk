import { Dialog } from './Dialog';
import { LargeProperty } from './LargeProperty';
import { ReadLargePropertyParameters } from './ReadLargePropertyParameters';

export class ErrorDialog extends Dialog {
    protected getProperty(propertyName: string, params: ReadLargePropertyParameters): Promise<LargeProperty> {
        return Promise.resolve(null);
    }
}
