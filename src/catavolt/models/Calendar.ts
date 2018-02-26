import { View } from './View';

/**
 * An abstract visual Calendar
 */
export class Calendar extends View {
    public readonly descriptionPropertyName: string;
    public readonly initialStyle: string;
    public readonly endDatePropertyName: string;
    public readonly endTimePropertyName: string;
    public readonly occurDatePropertyName: string;
    public readonly occurTimePropertyName: string;
    public readonly startDatePropertyName: string;
    public readonly startTimePropertyName: string;
}
