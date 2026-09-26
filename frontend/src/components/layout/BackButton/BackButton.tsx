import type { JSX } from 'react';

import { TRANSLATION_KEYS, useTranslation } from '../../../i18n';
import { PillButton } from '../../ui';

import {
  BACK_BUTTON_GLYPH,
  BACK_BUTTON_GROUNDS,
  BACK_BUTTON_TONES,
  type BackButtonGround,
} from './backButtonGrounds';

export interface BackButtonProps {
  readonly onPress: () => void;
  readonly ground?: BackButtonGround;
}

/**
 * The way back to wherever somebody was a moment ago.
 *
 * A round pill holding one glyph, because it is one glyph: the same object
 * every other round control in this app is, rather than an arrow floating on
 * the ground. It says "späť" out loud, since a chevron is a thing people
 * recognise rather than a thing a screen reader can be told.
 */
export const BackButton = ({
  onPress,
  ground = BACK_BUTTON_GROUNDS.surface,
}: BackButtonProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <PillButton
      icon={BACK_BUTTON_GLYPH}
      tone={BACK_BUTTON_TONES[ground]}
      size="small"
      spokenLabel={t(TRANSLATION_KEYS.actionBack)}
      onPress={onPress}
    />
  );
};
