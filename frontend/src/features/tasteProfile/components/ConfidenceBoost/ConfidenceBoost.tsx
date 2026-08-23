import type { TasteProfile } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
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
 * that actually moves it: brewing a cup and saying what it was like. A
 * confidence figure with no way to raise it is a score, and nobody asked to be
 * scored.
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
      <Text variant="titleSmall">{t(TRANSLATION_KEYS.profileConfidenceBoostTitle)}</Text>
      <View style={styles.points}>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.profileConfidenceBoostBrew)}
        </Text>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.profileConfidenceBoostDescribe)}
        </Text>
      </View>
      <Button
        label={t(TRANSLATION_KEYS.profileConfidenceBoostAction)}
        variant="secondary"
        fullWidth
        onPress={(): void => {
          router.push(ROUTES.quickBrew);
        }}
      />
    </View>
  );
};
