import type { JSX } from 'react';
import { View } from 'react-native';

import { ProgressBar, Text } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createUsageMeterStyles } from './UsageMeter.styles';

export interface UsageMeterProps {
  /** What is being counted - calls, or money. */
  readonly label: string;
  /** Already formatted: "12 / 40", or "0,84 / 2,00 €". */
  readonly figure: string;
  readonly used: number;
  readonly ceiling: number;
}

/**
 * One allowance, drawn the same way as the other.
 *
 * The card used to give the call count a bar and the money a sentence, which
 * made the two ceilings look like a measurement and a footnote - and the
 * screen exists precisely because they are two measurements that run out
 * independently. Somebody refused with room on the bar they can see has been
 * told the wrong thing by a card that drew only one of them.
 */
export const UsageMeter = ({ label, figure, used, ceiling }: UsageMeterProps): JSX.Element => {
  const styles = useThemedStyles(createUsageMeterStyles);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text variant="eyebrow" tone="muted">
          {label}
        </Text>
        <Text variant="numericRow" numeric>
          {figure}
        </Text>
      </View>
      {/* The bar carries the numbers as its accessibility value, so the label
          names the quantity and is never a sentence assembled here. */}
      <ProgressBar current={used} total={ceiling} label={label} />
    </View>
  );
};
