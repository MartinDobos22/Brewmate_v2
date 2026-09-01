import type { JSX } from 'react';

import { OptionCard, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import {
  TASTE_EXPERIENCE_LABEL_KEYS,
  TASTE_EXPERIENCE_LEVEL_ORDER,
  TASTE_EXPERIENCE_NOTE_KEYS,
  type TasteExperienceLevel,
} from '../../constants/tasteExperienceLevels';

export interface TasteLevelPickerProps {
  readonly onChoose: (level: TasteExperienceLevel) => void;
}

/**
 * Question zero: how much coffee vocabulary the person answering has.
 *
 * It is asked rather than guessed because there is nothing to guess from - a
 * brand new account has no brews, no cupboard and no equipment written down
 * yet, and this is the screen that comes before all of it. Guessing wrong is
 * expensive in both directions: an expert handed ten questions about chocolate
 * learns that this app is not for them, and a beginner asked which processing
 * method they prefer picks one at random and is recommended coffee on the
 * strength of it.
 *
 * The three options are described by what the person drinks rather than by a
 * rank. "Začiatočník" is a label somebody has to accept about themselves
 * before they can get past this screen, and enough people will overclaim to
 * avoid it that the question would stop working.
 */
export const TasteLevelPicker = ({ onChoose }: TasteLevelPickerProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.tqLevelPrompt)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.tqLevelHelp)}
      </Text>
      {TASTE_EXPERIENCE_LEVEL_ORDER.map((level: TasteExperienceLevel): JSX.Element => (
        <OptionCard
          key={level}
          label={t(TASTE_EXPERIENCE_LABEL_KEYS[level])}
          note={t(TASTE_EXPERIENCE_NOTE_KEYS[level])}
          selected={false}
          onPress={(): void => {
            onChoose(level);
          }}
        />
      ))}
    </>
  );
};
