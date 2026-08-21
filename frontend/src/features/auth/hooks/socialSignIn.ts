import type { TranslationKey } from '../../../i18n';

/** What a screen needs from Google and from Apple alike. */
export interface SocialSignIn {
  readonly signIn: () => void;
  readonly isPending: boolean;
  readonly errorKey: TranslationKey | null;
  /** False while the provider is unavailable on this device or build. */
  readonly ready: boolean;
}
