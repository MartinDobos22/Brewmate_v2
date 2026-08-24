import {
  readActiveConstraints,
  type BrewConstraintName,
  type BrewConstraints,
} from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BREW_CONSTRAINT_OPTIONS } from '../../../brewing/constants';

import { createConstraintBadgesStyles } from './ConstraintBadges.styles';

const NOTHING = 0;

export interface ConstraintBadgesProps {
  readonly constraints: BrewConstraints;
}

/**
 * The Slovak word for one constraint, taken from the same list the pre-brew
 * screen draws its checkboxes from - so a badge and the box that set it can
 * never say different things.
 */
const LABEL_KEYS: ReadonlyMap<BrewConstraintName, TranslationKey> = new Map(
  BREW_CONSTRAINT_OPTIONS.map((option): readonly [BrewConstraintName, TranslationKey] => [
    option.name,
    option.labelKey,
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
  const { t } = useTranslation();

  const named = readActiveConstraints(constraints);
  const other = constraints.other ?? [];

  if (named.length === NOTHING && other.length === NOTHING) {
    return null;
  }

  return (
    <View style={styles.row}>
      {named.map((name: BrewConstraintName): JSX.Element => (
        <View key={name} style={styles.badge}>
          <Text variant="labelSmall" tone="muted">
            {t(LABEL_KEYS.get(name) ?? TRANSLATION_KEYS.historyConstrainedBadge)}
          </Text>
        </View>
      ))}
      {other.map((label: string): JSX.Element => (
        <View key={label} style={styles.badge}>
          <Text variant="labelSmall" tone="muted">
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
};
