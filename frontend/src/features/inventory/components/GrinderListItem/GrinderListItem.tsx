import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { Grinder } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, ListItem, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  GRINDER_PRECISION_ICON_COLORS,
  GRINDER_PRECISION_ICONS,
  GRINDER_PRECISION_LABEL_KEYS,
  GRINDER_PRECISION_TONES,
  GRINDER_UNIT_LABEL_KEYS,
} from '../../constants';
import { formatGrinderSettings, resolveGrinderPrecision } from '../../services';

import { createGrinderListItemStyles } from './GrinderListItem.styles';
import { grinderDisplayName } from './grinderListItemContent';

export interface GrinderListItemProps {
  readonly grinder: Grinder;
  readonly onPress?: (grinder: Grinder) => void;
  /** Off on the last entry, which closes the sheet rather than continuing it. */
  readonly showDivider?: boolean;
}

/**
 * One catalogue entry.
 *
 * The precision line is not decoration: a micron figure reads like a fact
 * whatever it says, so every entry carries where its numbers came from -
 * measured, estimated, or absent. It is drawn the way the cupboard draws a
 * bag's state, with a glyph as well as a colour, because a line that relies
 * on the difference between a green and an ochre is a line somebody cannot
 * read - and this is the one line on the screen that disagrees with the
 * numbers above it.
 *
 * Whose entry it is, is a fact about the row rather than a caveat about the
 * numbers, so it is a chip rather than a second quiet sentence under the
 * first. Two stacked captions read as one hedge in two parts.
 */
export const GrinderListItem = ({
  grinder,
  onPress,
  showDivider = false,
}: GrinderListItemProps): JSX.Element => {
  const styles = useThemedStyles(createGrinderListItemStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const precision = resolveGrinderPrecision(grinder);

  return (
    <View style={showDivider ? styles.divided : undefined}>
      <ListItem
        title={grinderDisplayName(grinder)}
        subtitle={formatGrinderSettings(grinder, {
          unit: t(GRINDER_UNIT_LABEL_KEYS[grinder.unitType]),
          step: t(TRANSLATION_KEYS.grinderStepLabel),
          stepless: t(TRANSLATION_KEYS.grinderStepless),
        })}
        numericSubtitle
        onPress={
          onPress === undefined
            ? undefined
            : (): void => {
                onPress(grinder);
              }
        }
      />
      <View style={styles.notes}>
        <View style={styles.precision}>
          <MaterialCommunityIcons
            name={GRINDER_PRECISION_ICONS[precision]}
            size={theme.size.iconTiny}
            color={theme.colors[GRINDER_PRECISION_ICON_COLORS[precision]]}
          />
          <Text variant="captionSmall" tone={GRINDER_PRECISION_TONES[precision]}>
            {t(GRINDER_PRECISION_LABEL_KEYS[precision])}
          </Text>
        </View>
        {grinder.isVerified ? null : (
          <Chip label={t(TRANSLATION_KEYS.grinderOwnEntry)} size="small" />
        )}
      </View>
    </View>
  );
};
