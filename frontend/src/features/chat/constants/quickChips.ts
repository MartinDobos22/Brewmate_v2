import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface ChatQuickChip {
  readonly labelKey: TranslationKey;
  /** The sentence the chip actually sends. */
  readonly messageKey: TranslationKey;
  /**
   * The complaint, drawn.
   *
   * Six chips in a row that scrolls sideways are read at a glance rather than
   * word by word, and half of them are one word apart from each other -
   * "silnejšie" and "slabšie" differ by two letters at this size. The glyph is
   * what tells them apart before anybody focuses on the label.
   */
  readonly icon: MaterialIconName;
}

/**
 * Shortcuts to writing a message, and nothing more than that.
 *
 * Each chip sends an ordinary sentence, in the first person, exactly as
 * somebody might have typed it. That is deliberate: the model reads one kind
 * of input, the conversation records one kind of message, and a chip that sent
 * a code instead would be a second, invisible protocol nobody could read back.
 *
 * The set is the complaints people actually have about a cup, plus the one
 * excuse - "mal som menej času" - because a brew that was rushed is a
 * different fact from a brew that was wrong.
 */
export const CHAT_QUICK_CHIPS: readonly ChatQuickChip[] = [
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipSweeter,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageSweeter,
    icon: 'candy-outline',
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipLessAcidic,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageLessAcidic,
    icon: 'fruit-citrus',
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipStronger,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageStronger,
    icon: 'flash-outline',
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipWeaker,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageWeaker,
    icon: 'water-outline',
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipLessBitter,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageLessBitter,
    icon: 'leaf',
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipFaster,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageFaster,
    icon: 'timer-sand',
  },
];
