import type { JSX, ReactNode } from 'react';
import { View, type ColorValue } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { CIRCLE } from '../../../constants';

import { DIAL_STYLES, dialBox } from './Dial.styles';

const EMPTY = 0;
const COMPLETE = 1;

export interface DialProps {
  /** How much of the ring is drawn, between nought and one. */
  readonly progress: number;
  readonly size: number;
  readonly strokeWidth: number;
  readonly color: ColorValue;
  readonly trackColor: ColorValue;
  /** The figure the ring is about, drawn in the hole it leaves. */
  readonly children: ReactNode;
  readonly accessibilityLabel: string;
}

/**
 * A ring with a figure inside it.
 *
 * The one shape this app uses for "how far through something are we", at two
 * sizes and in two places - a bag's freshness on the cupboard, the profile's
 * confidence on the profile. Deliberately one component: two rings drawn
 * separately would drift by a stroke or a cap within a release, and then the
 * two screens would look like they came from different applications.
 *
 * It is not a scale and carries no ticks. The number inside is what gets read;
 * the ring is how much of something it is, at a glance, before the number is.
 */
export const Dial = ({
  progress,
  size,
  strokeWidth,
  color,
  trackColor,
  children,
  accessibilityLabel,
}: DialProps): JSX.Element => {
  const center = size / CIRCLE.half;
  const radius = (size - strokeWidth) / CIRCLE.half;
  const circumference = CIRCLE.fullTurn * radius;
  const drawn = Math.min(Math.max(progress, EMPTY), COMPLETE);

  return (
    <View
      style={dialBox(size)}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: EMPTY, max: COMPLETE, now: drawn }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {drawn === EMPTY ? null : (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (COMPLETE - drawn)}
            transform={`rotate(${String(CIRCLE.startAngle)}, ${String(center)}, ${String(center)})`}
          />
        )}
      </Svg>
      <View style={DIAL_STYLES.center}>{children}</View>
    </View>
  );
};
