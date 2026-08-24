import type { BrewConstraints } from '@brewmate/shared';
import { useState, type JSX } from 'react';
import { Pressable, View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BREW_CONSTRAINT_OPTIONS, type BrewConstraintOption } from '../../constants';
import { countConstraints } from '../../services/countConstraints';

import { BrewConstraintRow } from './BrewConstraintRow';
import { createBrewConstraintsSectionStyles } from './BrewConstraintsSection.styles';

export interface BrewConstraintsSectionProps {
  readonly constraints: BrewConstraints;
  /** Whether what is ticked came from the set rather than from this morning. */
  readonly fromSet: boolean;
  readonly onToggle: (name: keyof BrewConstraints, isSet: boolean) => void;
}

const NOTHING = 0;

/**
 * "Dnes nemám všetko", folded away until somebody opens it.
 *
 * Collapsed by default because most mornings nothing is missing, and nine
 * unticked boxes above the thing somebody came for is a screen they scroll
 * past. Open, it is the most consequential control here: what is ticked
 * changes the shape of the recipe rather than adding a footnote to it.
 *
 * The header counts what is set, so the state survives being folded away. A
 * collapsed section hiding three ticks nobody can see is worse than no section.
 */
export const BrewConstraintsSection = ({
  constraints,
  fromSet,
  onToggle,
}: BrewConstraintsSectionProps): JSX.Element => {
  const styles = useThemedStyles(createBrewConstraintsSectionStyles);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const count = countConstraints(constraints);

  return (
    <Card>
      <Pressable
        onPress={(): void => {
          setIsOpen(!isOpen);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={t(TRANSLATION_KEYS.preBrewConstraintsTitle)}
      >
        <View style={styles.header}>
          <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewConstraintsTitle)}</Text>
          <Text variant="bodySmall" tone={count === NOTHING ? 'muted' : 'secondary'}>
            {count === NOTHING
              ? t(TRANSLATION_KEYS.preBrewConstraintsClosed)
              : t(TRANSLATION_KEYS.preBrewConstraintsCount, { count })}
          </Text>
        </View>
      </Pressable>
      {isOpen ? (
        <View style={styles.list}>
          {fromSet ? (
            <Text variant="bodySmall" tone="muted">
              {t(TRANSLATION_KEYS.preBrewConstraintsFromSet)}
            </Text>
          ) : null}
          {BREW_CONSTRAINT_OPTIONS.map((option: BrewConstraintOption): JSX.Element => (
            <BrewConstraintRow
              key={option.name}
              option={option}
              isSet={constraints[option.name] === true}
              onToggle={onToggle}
            />
          ))}
        </View>
      ) : null}
    </Card>
  );
};
