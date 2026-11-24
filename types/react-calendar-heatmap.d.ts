// types/react-calendar-heatmap.d.ts
declare module 'react-calendar-heatmap' {
    import * as React from 'react';

    export interface HeatmapValue {
        date: string;
        count?: number;
    }

    export interface Props {
        values: HeatmapValue[];
        classForValue?: (value: HeatmapValue | undefined) => string;
        titleForValue?: (value: HeatmapValue | undefined) => string;
        tooltipDataAttrs?:
        | ((value: HeatmapValue | undefined) => { [key: string]: string })
        | { [key: string]: string };
        showWeekdayLabels?: boolean;
        showMonthLabels?: boolean; // <-- ADD THIS LINE
        weekdayLabels?: string[];
        startDate?: string | Date;
        endDate?: string | Date;
        gutterSize?: number;
        horizontal?: boolean;
        onClick?: (value: HeatmapValue) => void;
        transformDayElement?: (
            element: JSX.Element,
            value: HeatmapValue,
            index: number
        ) => JSX.Element;
    }

    export default class ReactCalendarHeatmap extends React.Component<Props> { }
}
