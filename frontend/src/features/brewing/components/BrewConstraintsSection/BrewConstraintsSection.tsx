import type { BrewConstraints } from '@brewmate/shared';
import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Card, Chip, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BREW_CONSTRAINT_OPTIONS, type BrewConstraintOption } from '../../constants';
import { countConstraints } from '../../services/countConstraints';

import { BrewConstraintRow } from './BrewConstraintRow';
import { BrewConstraintsHeader } from './BrewConstraintsHeader';
import { createBrewConstraintsSectionStyles } from './BrewConstraintsSection.styles';

export interface BrewConstraintsSectionProps {
  readonly constraints: BrewConstraints;
  /** Whether what is ticked came from the set rather than from this morning. */
  readonly fromSet: boolean;
  readonly onToggle: (name: keyof BrewConstraints, isSet: boolean) => void;
}

const NOTHING = 0;

const isSet = (constraints: BrewConstraints, option: BrewConstraintOption): boolean =>
  constraints[option.name] === true;

/**
 * "Dnes nemám všetko", folded away until somebody opens it.
 *
 * Collapsed by default because most mornings nothing is missing, and nine
 * unticked boxes above the thing somebody came for is a screen they scroll
 * past. Open, it is the most consequential control here: what is ticked
 * changes the shape of the recipe rather than adding a footnote to it.
 *
 * What it was missing was any sign that it opened at all. A title over a grey
 * sentence is the shape of every explanatory line on this screen, so the one
 * row that was a control read as a caption and got found by accident. It now
 * carries a chevron, and - the part that matters more - when it is closed it
 * names what is ticked rather than only counting it. "chýba ti 2" is a number
 * somebody has to open the section to understand; "Nemám váhu · Nemám stopky"
 * is the answer itself, and most of the time seeing it is the whole reason
 * anybody was going to open it.
 */
export const BrewConstraintsSection = ({
  constraints,
  fromSet,
  onToggle,
}: BrewConstraintsSectionProps): JSX.Element => {
  const styles = useThemedStyles(createBrewConstraintsSectionStyles);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const missing = BREW_CONSTRAINT_OPTIONS.filter((option: BrewConstraintOption): boolean =>
    isSet(constraints, option),
  );

  return (
    <Card>
      <BrewConstraintsHeader
        isOpen={isOpen}
        count={countConstraints(constraints)}
        onToggle={(): void => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen || missing.length === NOTHING ? null : (
        <View style={styles.summary}>
          {missing.map((option: BrewConstraintOption): JSX.Element => (
            <Chip
              key={option.name}
              label={t(option.labelKey)}
              selected
              onPress={(): void => {
                setIsOpen(true);
              }}
            />
          ))}
        </View>
      )}
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
              isSet={isSet(constraints, option)}
              onToggle={onToggle}
            />
          ))}
        </View>
      ) : null}
    </Card>
  );
};
