import type { JSX } from 'react';
import { Circle, G, Line, Polygon } from 'react-native-svg';

import type { Theme } from '../../../../theme';
import {
  DEFAULT_RADAR_GROUND,
  RADAR_CHART,
  RADAR_EDGE_COLORS,
  RADAR_GUIDE_COLORS,
  RADAR_OVERLAY_COLORS,
  RADAR_SHAPE_COLORS,
  RADAR_UNKNOWN_FILL_COLORS,
  RADAR_UNKNOWN_RING_COLORS,
  RADAR_VERTEX_COLORS,
  UNKNOWN_AXIS_MARKER_OPACITY,
  type RadarGround,
} from '../../constants';
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
  /** A second shape to hold this one up against, drawn dashed and unfilled. */
  readonly overlay?: readonly TasteAxisReading[];
  readonly theme: Theme;
  readonly ground?: RadarGround;
}

const shapePoints = (frame: RadarFrame, readings: readonly TasteAxisReading[]): string =>
  toPolygonPoints(
    readings.map((reading: TasteAxisReading, index: number): RadarPoint =>
      radarPoint(frame, index, frame.radius * reading.share),
    ),
  );

/**
 * The web, the shape and the vertices - everything drawn inside the square.
 *
 * Split out from the chart because the chart also owns the labels around it,
 * and one component holding both the polar arithmetic and five absolutely
 * positioned pieces of text was doing two things.
 */
export const TasteRadarWeb = ({
  frame,
  readings,
  overlay,
  theme,
  ground = DEFAULT_RADAR_GROUND,
}: TasteRadarWebProps): JSX.Element => (
  <G>
    {radarRings(frame, RADAR_CHART.ringCount).map(
      (ring: readonly RadarPoint[], index: number): JSX.Element => (
        <Polygon
          key={toPolygonPoints(ring)}
          points={toPolygonPoints(ring)}
          fill="none"
          stroke={
            theme.colors[
              index === OUTER_RING ? RADAR_EDGE_COLORS[ground] : RADAR_GUIDE_COLORS[ground]
            ]
          }
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
          stroke={theme.colors[RADAR_GUIDE_COLORS[ground]]}
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
      fill={theme.colors[RADAR_SHAPE_COLORS[ground]]}
      fillOpacity={RADAR_CHART.shapeFillOpacity}
      stroke={theme.colors[RADAR_SHAPE_COLORS[ground]]}
      strokeWidth={RADAR_CHART.shapeStrokeWidth}
      strokeLinejoin="round"
    />
    {overlay === undefined ? null : (
      /**
       * Drawn after the filled shape and before the vertices, so it reads as
       * laid over the first rather than hidden behind it - and unfilled, so
       * where the two overlap the reader sees both instead of a third colour.
       */
      <Polygon
        points={shapePoints(frame, overlay)}
        fill="none"
        stroke={theme.colors[RADAR_OVERLAY_COLORS[ground]]}
        strokeWidth={RADAR_CHART.overlayStrokeWidth}
        strokeDasharray={RADAR_CHART.overlayDash}
        strokeLinejoin="round"
      />
    )}
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
          fill={theme.colors[RADAR_VERTEX_COLORS[ground]]}
        />
      ) : (
        <Circle
          key={reading.axis}
          cx={point.x}
          cy={point.y}
          r={RADAR_CHART.unknownVertexRadius}
          fill={theme.colors[RADAR_UNKNOWN_FILL_COLORS[ground]]}
          stroke={theme.colors[RADAR_UNKNOWN_RING_COLORS[ground]]}
          strokeWidth={RADAR_CHART.unknownVertexStrokeWidth}
          opacity={UNKNOWN_AXIS_MARKER_OPACITY}
        />
      );
    })}
  </G>
);
