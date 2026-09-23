import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createPreBrewGrindSectionStyles } from './PreBrewGrindSection.styles';

export interface PreBrewGrindRowProps {
  readonly label: string;
  readonly value: string;
  /** Collar numbers are read off a scale, so they get the tabular figures. */
  readonly numeric?: boolean;
}

/** One labelled fact about the grind, laid out the way the plan card lays out its own. */
export const PreBrewGrindRow = ({ label, value, numeric }: PreBrewGrindRowProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewGrindSectionStyles);

  return (
    <View style={styles.row}>
      <Text variant="captionSmall" tone="muted">
        {label}
      </Text>
      <Text variant="bodyText" numeric={numeric}>
        {value}
      </Text>
    </View>
  );
};
