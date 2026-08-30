import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';

const EMPTY = '';

export interface VerdictSubjectProps {
  readonly name: string;
  readonly roaster: string;
}

/**
 * Which coffee this is an opinion about.
 *
 * The card carried none: it opened straight on the verdict, which is fine in
 * the second after a scan and useless the moment somebody has put the bag down
 * and picked up another, or come back to the same screen a minute later. An
 * opinion whose subject is not written on it is an opinion that gets attached
 * to the wrong coffee.
 */
export const VerdictSubject = ({ name, roaster }: VerdictSubjectProps): JSX.Element => {
  const styles = useThemedStyles(createBagVerdictCardStyles);
  const { t } = useTranslation();
  const coffee = name.trim() === EMPTY ? t(TRANSLATION_KEYS.inventoryUnnamedCoffee) : name;

  return (
    <View style={styles.subject}>
      <Text variant="labelSmall" tone="muted">
        {t(TRANSLATION_KEYS.scanVerdictTitle)}
      </Text>
      <Text variant="titleMedium">{coffee}</Text>
      {roaster.trim() === EMPTY ? null : (
        <Text variant="bodySmall" tone="muted">
          {roaster}
        </Text>
      )}
    </View>
  );
};
