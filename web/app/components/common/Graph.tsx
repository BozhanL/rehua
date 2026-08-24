import {
  OBSERVATION_GRAPH_CONFIG,
  type GraphableObservationType,
} from './observation-graph.config';
import type { JSX } from 'react';

export interface GraphDataPoint {
  hour: number; // hour of day (0-23) the reading was taken, used for x-axis placement
  value: number; // observation reading, used for y-axis placement
  dateTime: Date; // full timestamp of the reading, kept for consumers (e.g. tooltips)
}
export interface GraphProps {
  type: GraphableObservationType; // observation type, looked up in OBSERVATION_GRAPH_CONFIG for axis range/label/unit
  data: GraphDataPoint[]; // readings to plot, sorted by hour before rendering
  // don't stray too far off the default size settings otherwise graph will become squashed
  width?: number;
  height?: number;
  padding?: { top?: number; right?: number; bottom?: number; left?: number }; // per-side overrides, merged with DEFAULT_PADDING
  yTickCount?: number; // y axis tick marks - responsive
}

const DEFAULT_PADDING = { top: 30, right: 20, bottom: 30, left: 100 };

function formatHourLabel(hour: number): string {
  if (hour === 23) {
    return '23:59';
  }
  const padded = hour.toString().padStart(2, '0');
  return `${padded}:00`;
}

// y-axis: always show the unit, since this is the only place unit appears for
//  the whole chart (except percentage unit)
function formatAxisValue(value: number, unit: string): string {
  if (unit === '%') {
    return `${String(value)}%`;
  }
  if (unit.startsWith('°')) {
    return `${String(value)}${unit}`;
  }
  return `${String(value)} ${unit}`;
}

// append percentage unit to data points that require it
function formatPointValue(value: number, unit: string): string {
  if (unit === '%') {
    return `${String(value)}%`;
  }
  return String(value);
}

// React component that renders an observation as a line graph over 24 hours
function Graph({
  type,
  data,
  width = 900,
  height = 320,
  padding,
  yTickCount = 7,
}: Readonly<GraphProps>): JSX.Element {
  const resolvedPadding = { ...DEFAULT_PADDING, ...padding };
  const config = OBSERVATION_GRAPH_CONFIG[type];

  const plotWidth = width - resolvedPadding.left - resolvedPadding.right;
  const plotHeight = height - resolvedPadding.top - resolvedPadding.bottom;
  const range = config.max - config.min;

  function xScale(hour: number): number {
    return resolvedPadding.left + (hour / 24) * plotWidth;
  }

  function yScale(value: number): number {
    if (range === 0) {
      return resolvedPadding.top + plotHeight / 2;
    }
    return (
      resolvedPadding.top +
      plotHeight -
      ((value - config.min) / range) * plotHeight
    );
  }

  const sortedData = [...data].sort((a, b) => a.hour - b.hour);

  const linePath = sortedData
    .map(
      (point, i) =>
        `${i === 0 ? 'M' : 'L'} ${String(xScale(point.hour))} ${String(yScale(point.value))}`,
    )
    .join(' ');

  const hourTicks = Array.from({ length: 24 }, (_, i) => i);

  const yTicks = Array.from({ length: yTickCount }, (_, i) => ({
    index: i,
    value: Math.round(config.min + (range / (yTickCount - 1)) * i),
  }));

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label={`${config.label} over 24 hours`}
    >
      {/* Gridlines - horizontal */}
      {yTicks.map(({ index, value }) => (
        <line
          key={`grid-y-${String(index)}`}
          x1={resolvedPadding.left}
          y1={yScale(value)}
          x2={width - resolvedPadding.right}
          y2={yScale(value)}
          stroke="var(--dark-gray)"
          strokeDasharray="2 2"
        />
      ))}

      {/* Gridlines - vertical */}
      {hourTicks.map((hour) => (
        <line
          key={`grid-x-${String(hour)}`}
          x1={xScale(hour)}
          y1={resolvedPadding.top}
          x2={xScale(hour)}
          y2={height - resolvedPadding.bottom}
          stroke="var(--dark-gray)"
          strokeDasharray="2 2"
        />
      ))}

      {/* Y axis labels, with unit */}
      {yTicks.map(({ index, value }) => (
        <text
          key={`label-y-${String(index)}`}
          x={resolvedPadding.left - 8}
          y={yScale(value)}
          fontSize={11}
          fill="var(--rehua-navy)"
          textAnchor="end"
          dominantBaseline="middle"
        >
          {formatAxisValue(value, config.unit)}
        </text>
      ))}

      {/* X axis labels */}
      {hourTicks.map((hour) => (
        <text
          key={`label-x-${String(hour)}`}
          x={xScale(hour)}
          y={height - resolvedPadding.bottom + 16}
          fontSize={10}
          fill="var(--rehua-navy)"
          textAnchor="middle"
        >
          {formatHourLabel(hour)}
        </text>
      ))}

      {/* Data line */}
      {sortedData.length > 0 && (
        <path
          d={linePath}
          fill="none"
          stroke="var(--rehua-navy)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )}

      {/* Data points + value labels */}
      {sortedData.map((point, i) => {
        const key = `point-${String(i)}`;
        return (
          <g key={key}>
            <circle
              cx={xScale(point.hour)}
              cy={yScale(point.value)}
              r={5}
              fill="#4F9AFF"
              stroke="var(--rehua-white)"
              strokeWidth={2}
            />
            <text
              x={xScale(point.hour)}
              y={yScale(point.value) - 12}
              fontSize={11}
              fontWeight={600}
              fill="var(--rehua-navy)"
              textAnchor="middle"
            >
              {formatPointValue(point.value, config.unit)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default Graph;
