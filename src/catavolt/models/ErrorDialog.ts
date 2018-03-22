import { Dialog } from './Dialog';
import { LargeProperty } from './LargeProperty';
import { ReadLargePropertyParameters } from './ReadLargePropertyParameters';

export class ErrorDialog extends Dialog {
    protected getProperty(params: ReadLargePropertyParameters, propertyName: string): Promise<LargeProperty> {
        return Promise.resolve(null);
    }
}
