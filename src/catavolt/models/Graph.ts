import { GraphDataPoint } from './GraphDataPoint';
import { View } from './View';

/**
 * A view describing how to display a collection of data as a line graph, pie chart, bar chart, etc.
 */
export class Graph extends View {
    public static GRAPH_TYPE_CARTESIAN = 'GRAPH_TYPE_BAR';
    public static GRAPH_TYPE_PIE = 'GRAPH_TYPE_PIE';
    public static PLOT_TYPE_BAR = 'BAR';
    public static PLOT_TYPE_BUBBLE = 'BUBBLE';
    public static PLOT_TYPE_LINE = 'LINE';
    public static PLOT_TYPE_SCATTER = 'SCATTER';
    public static PLOT_TYPE_STACKED = 'STACKED';

    public readonly graphType: string;
    public readonly displayQuadrantLines: boolean;
    public readonly identityDataPoint: GraphDataPoint;
    public readonly groupingDataPoint: GraphDataPoint;
    public readonly dataPoints: GraphDataPoint[];
    public readonly filterDataPoints: GraphDataPoint[];
    public readonly sampleModel: string;
    public readonly xAxisLabel: string;
    public readonly xAxisRangeFrom: number;
    public readonly xAxisRangeTo: number;
    public readonly yAxisLabel: string;
    public readonly yAxisRangeFrom: number;
    public readonly yAxisRangeTo: number;
}
