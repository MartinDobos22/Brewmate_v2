import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { SCAN_ICONS, VERDICT_REASON_ICONS } from '../../constants';
import { BAG_SCAN_FIELDS } from '../../constants/bagScan';

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
  const theme = useTheme();
  const { t } = useTranslation();
  const coffee = name.trim() === EMPTY ? t(TRANSLATION_KEYS.inventoryUnnamedCoffee) : name;

  return (
    <View style={styles.subject}>
      <View style={styles.badge}>
        <MaterialCommunityIcons
          name={SCAN_ICONS.shop}
          size={theme.size.iconMedium}
          color={theme.colors.accentOnEspresso}
        />
      </View>
      <View style={styles.subjectBody}>
        <Text variant="eyebrowEspresso" tone="accent">
          {t(TRANSLATION_KEYS.scanVerdictTitle)}
        </Text>
        <Text variant="rowTitle" tone="onEspresso">
          {coffee}
        </Text>
        {roaster.trim() === EMPTY ? null : (
          <View style={styles.roaster}>
            <MaterialCommunityIcons
              name={VERDICT_REASON_ICONS[BAG_SCAN_FIELDS.roastLevel]}
              size={theme.size.iconTiny}
              color={theme.colors.onEspressoVariant}
            />
            <Text variant="caption" tone="onEspressoMuted">
              {roaster}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
