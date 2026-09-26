import type { TasteProfile } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { resolveConfidenceNoticeKey } from '../../services';

import { createConfidenceBoostStyles } from './ConfidenceBoost.styles';

export interface ConfidenceBoostProps {
  readonly profile: TasteProfile;
}

/**
 * What would make the profile above worth more.
 *
 * Shown only while the confidence is still low, and it names the one thing
 * that actually moves it: rating the coffee somebody drinks. A confidence
 * figure with no way to raise it is a score, and nobody asked to be scored.
 *
 * It leads to the cupboard, because that is where the bags waiting to be
 * rated are.
 */
export const ConfidenceBoost = ({ profile }: ConfidenceBoostProps): JSX.Element | null => {
  const styles = useThemedStyles(createConfidenceBoostStyles);
  const { t } = useTranslation();
  const router = useRouter();

  if (resolveConfidenceNoticeKey(profile) === null) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text variant="rowTitle">{t(TRANSLATION_KEYS.profileConfidenceBoostTitle)}</Text>
      <View style={styles.points}>
        <Text variant="bodyText" tone="muted">
          {t(TRANSLATION_KEYS.profileConfidenceBoostRate)}
        </Text>
        <Text variant="caption" tone="muted">
          {t(TRANSLATION_KEYS.profileConfidenceBoostWhy)}
        </Text>
      </View>
      <PillButton
        tone="surface"
        label={t(TRANSLATION_KEYS.profileConfidenceBoostAction)}
        fullWidth
        onPress={(): void => {
          router.push(ROUTES.inventory);
        }}
      />
    </View>
  );
};
