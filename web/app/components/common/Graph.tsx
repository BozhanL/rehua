import {
  OBSERVATION_GRAPH_CONFIG,
  type GraphableObservationType,
} from './observation-graph.config';
import type { JSX } from 'react';

export interface GraphDataPoint {
  hour: number;
  value: number;
  dateTime: Date;
}

export interface GraphProps {
  type: GraphableObservationType;
  data: GraphDataPoint[];
  // don't stray too far off the default width and height, x and y tick marks will become squashed
  width?: number;
  height?: number;
}
const PADDING = { top: 30, right: 20, bottom: 30, left: 60 };
const Y_TICK_COUNT = 7; // y axis tick marks

function formatHourLabel(hour: number): string {
  if (hour === 23) {
    return '23:59';
  }
  const padded = hour.toString().padStart(2, '0');
  return `${padded}:00`;
}

// y-axis: always show the unit, since this is the only place unit
// context appears for the whole chart (for most observations)
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

export function Graph({
  type,
  data,
  width = 900,
  height = 320,
}: Readonly<GraphProps>): JSX.Element {
  const config = OBSERVATION_GRAPH_CONFIG[type];

  const plotWidth = width - PADDING.left - PADDING.right;
  const plotHeight = height - PADDING.top - PADDING.bottom;
  const range = config.max - config.min;

  function xScale(hour: number): number {
    return PADDING.left + (hour / 24) * plotWidth;
  }

  function yScale(value: number): number {
    if (range === 0) {
      return PADDING.top + plotHeight / 2;
    }
    return (
      PADDING.top + plotHeight - ((value - config.min) / range) * plotHeight
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

  const yTicks = Array.from({ length: Y_TICK_COUNT }, (_, i) => ({
    index: i,
    value: Math.round(config.min + (range / (Y_TICK_COUNT - 1)) * i),
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
          x1={PADDING.left}
          y1={yScale(value)}
          x2={width - PADDING.right}
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
          y1={PADDING.top}
          x2={xScale(hour)}
          y2={height - PADDING.bottom}
          stroke="var(--dark-gray)"

          strokeDasharray="2 2"
        />
      ))}

      {/* Y axis labels, with unit */}
      {yTicks.map(({ index, value }) => (
        <text
          key={`label-y-${String(index)}`}
          x={PADDING.left - 8}
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
          y={height - PADDING.bottom + 16}
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
