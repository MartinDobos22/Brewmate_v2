import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export interface ChatQuickChip {
  readonly labelKey: TranslationKey;
  /** The sentence the chip actually sends. */
  readonly messageKey: TranslationKey;
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
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipLessAcidic,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageLessAcidic,
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipStronger,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageStronger,
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipWeaker,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageWeaker,
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipLessBitter,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageLessBitter,
  },
  {
    labelKey: TRANSLATION_KEYS.recipeChatChipFaster,
    messageKey: TRANSLATION_KEYS.recipeChatChipMessageFaster,
  },
];
