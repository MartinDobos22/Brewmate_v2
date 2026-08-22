import type { JSX } from 'react';
import { View } from 'react-native';

import type { Grinder } from '@brewmate/shared';

import { ListItem, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { GRINDER_PRECISION_LABEL_KEYS, GRINDER_UNIT_LABEL_KEYS } from '../../constants';
import { formatGrinderSettings, resolveGrinderPrecision } from '../../services';

import { createGrinderListItemStyles } from './GrinderListItem.styles';
import { grinderDisplayName, precisionTone } from './grinderListItemContent';

export interface GrinderListItemProps {
  readonly grinder: Grinder;
  readonly onPress?: (grinder: Grinder) => void;
}

/**
 * One catalogue entry.
 *
 * The precision line is not decoration: a micron figure reads like a fact
 * whatever it says, so every entry carries where its numbers came from -
 * measured, estimated, or absent.
 */
export const GrinderListItem = ({ grinder, onPress }: GrinderListItemProps): JSX.Element => {
  const styles = useThemedStyles(createGrinderListItemStyles);
  const { t } = useTranslation();
  const precision = resolveGrinderPrecision(grinder);

  return (
    <View style={styles.wrapper}>
      <ListItem
        title={grinderDisplayName(grinder)}
        subtitle={formatGrinderSettings(grinder, {
          unit: t(GRINDER_UNIT_LABEL_KEYS[grinder.unitType]),
          step: t(TRANSLATION_KEYS.grinderStepLabel),
          stepless: t(TRANSLATION_KEYS.grinderStepless),
        })}
        onPress={
          onPress === undefined
            ? undefined
            : (): void => {
                onPress(grinder);
              }
        }
      />
      <View style={styles.notes}>
        <Text variant="labelSmall" tone={precisionTone(precision)}>
          {t(GRINDER_PRECISION_LABEL_KEYS[precision])}
        </Text>
        {grinder.isVerified ? null : (
          <Text variant="labelSmall" tone="muted">
            {t(TRANSLATION_KEYS.grinderOwnEntry)}
          </Text>
        )}
      </View>
    </View>
  );
};
