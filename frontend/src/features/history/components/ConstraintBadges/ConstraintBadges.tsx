import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  readActiveConstraints,
  type BrewConstraintName,
  type BrewConstraints,
} from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_CONSTRAINT_OPTIONS } from '../../../brewing/constants';
import { CONSTRAINT_LEAD_ICON, OTHER_CONSTRAINT_ICON } from '../../constants';

import { createConstraintBadgesStyles } from './ConstraintBadges.styles';

const NOTHING = 0;

export interface ConstraintBadgesProps {
  readonly constraints: BrewConstraints;
}

/**
 * The Slovak word and the glyph for one constraint, taken from the same list
 * the pre-brew screen draws its checkboxes from - so a badge and the box that
 * set it can never say different things.
 */
const OPTIONS: ReadonlyMap<BrewConstraintName, { key: TranslationKey; icon: TileGlyph }> = new Map(
  BREW_CONSTRAINT_OPTIONS.map((option) => [
    option.name,
    { key: option.labelKey, icon: option.icon },
  ]),
);

/**
 * What was missing when this cup was made.
 *
 * The list comes from the contract's own helper, the same one the API uses to
 * decide how much that cup taught the profile - so a badge can never disagree
 * with the weight the brew was priced at. The free-text constraints are shown
 * as they were written, the way a coffee's variety is.
 *
 * Nothing at all is the common case and renders nothing: a badge saying "mal
 * si všetko" on nine cups out of ten would be noise that hides the tenth.
 */
export const ConstraintBadges = ({ constraints }: ConstraintBadgesProps): JSX.Element | null => {
  const styles = useThemedStyles(createConstraintBadgesStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  const named = readActiveConstraints(constraints);
  const other = constraints.other ?? [];

  if (named.length === NOTHING && other.length === NOTHING) {
    return null;
  }

  return (
    <View style={styles.row}>
      <View style={[styles.badge, styles.lead]}>
        <MaterialCommunityIcons
          name={CONSTRAINT_LEAD_ICON}
          size={theme.size.iconTiny}
          color={theme.colors.onCaution}
        />
        <Text variant="chipLabel" tone="caution">
          {t(TRANSLATION_KEYS.historyConstrainedBadge)}
        </Text>
      </View>
      {named.map((name: BrewConstraintName): JSX.Element => {
        const option = OPTIONS.get(name);

        return (
          <View key={name} style={styles.badge}>
            <MaterialCommunityIcons
              name={option?.icon ?? OTHER_CONSTRAINT_ICON}
              size={theme.size.iconTiny}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="chipLabel" tone="muted">
              {t(option?.key ?? TRANSLATION_KEYS.historyConstrainedBadge)}
            </Text>
          </View>
        );
      })}
      {other.map((label: string): JSX.Element => (
        <View key={label} style={styles.badge}>
          <MaterialCommunityIcons
            name={OTHER_CONSTRAINT_ICON}
            size={theme.size.iconTiny}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="chipLabel" tone="muted">
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
};
