import type { JSX } from 'react';
import { Circle, G, Line, Polygon } from 'react-native-svg';

import type { Theme } from '../../../../theme';
import { RADAR_CHART, UNKNOWN_AXIS_MARKER_OPACITY } from '../../constants';
import {
  radarPoint,
  radarRings,
  toPolygonPoints,
  type RadarFrame,
  type RadarPoint,
} from '../../services';
import type { TasteAxisReading } from '../../services';

/** The last ring drawn is the edge of the scale, and is allowed to say so. */
const OUTER_RING = RADAR_CHART.ringCount - 1;

export interface TasteRadarWebProps {
  readonly frame: RadarFrame;
  readonly readings: readonly TasteAxisReading[];
  readonly theme: Theme;
}

/**
 * The web, the shape and the vertices - everything drawn inside the square.
 *
 * Split out from the chart because the chart also owns the labels around it,
 * and one component holding both the polar arithmetic and five absolutely
 * positioned pieces of text was doing two things.
 */
export const TasteRadarWeb = ({ frame, readings, theme }: TasteRadarWebProps): JSX.Element => (
  <G>
    {radarRings(frame, RADAR_CHART.ringCount).map(
      (ring: readonly RadarPoint[], index: number): JSX.Element => (
        <Polygon
          key={toPolygonPoints(ring)}
          points={toPolygonPoints(ring)}
          fill="none"
          stroke={index === OUTER_RING ? theme.colors.outline : theme.colors.outlineVariant}
          strokeWidth={RADAR_CHART.ringStrokeWidth}
        />
      ),
    )}
    {readings.map((reading: TasteAxisReading, index: number): JSX.Element => {
      const outer = radarPoint(frame, index, frame.radius);

      return (
        <Line
          key={reading.axis}
          x1={frame.center}
          y1={frame.center}
          x2={outer.x}
          y2={outer.y}
          stroke={theme.colors.outlineVariant}
          strokeWidth={RADAR_CHART.spokeStrokeWidth}
          opacity={RADAR_CHART.spokeOpacity}
        />
      );
    })}
    <Polygon
      points={toPolygonPoints(
        readings.map((reading: TasteAxisReading, index: number): RadarPoint =>
          radarPoint(frame, index, frame.radius * reading.share),
        ),
      )}
      fill={theme.colors.primary}
      fillOpacity={RADAR_CHART.shapeFillOpacity}
      stroke={theme.colors.primary}
      strokeWidth={RADAR_CHART.shapeStrokeWidth}
      strokeLinejoin="round"
    />
    {readings.map((reading: TasteAxisReading, index: number): JSX.Element => {
      const point = radarPoint(frame, index, frame.radius * reading.share);

      /**
       * A vertex the profile has earned is solid; one it has heard nothing
       * about is an outline. The polygon has to pass through all five points
       * whatever happens - a shape cannot have a hole in it - so this is where
       * the chart says which of them are real. It is the same distinction the
       * reading underneath spells out in words, drawn rather than written,
       * because at a glance the shape is what gets read.
       */
      return reading.known ? (
        <Circle
          key={reading.axis}
          cx={point.x}
          cy={point.y}
          r={RADAR_CHART.vertexRadius}
          fill={theme.colors.primary}
        />
      ) : (
        <Circle
          key={reading.axis}
          cx={point.x}
          cy={point.y}
          r={RADAR_CHART.unknownVertexRadius}
          fill={theme.colors.surface}
          stroke={theme.colors.onSurfaceVariant}
          strokeWidth={RADAR_CHART.unknownVertexStrokeWidth}
          opacity={UNKNOWN_AXIS_MARKER_OPACITY}
        />
      );
    })}
  </G>
);
