import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Input, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { DialInSession } from '../../hooks';

import { createShotFormStyles } from './ShotForm.styles';

export interface ShotFormProps {
  readonly session: DialInSession;
}

/** Decimal amounts, on a keyboard that opens with the digits showing. */
const NUMERIC = 'numeric';

/**
 * What came out of the machine, in the three numbers a person can read off
 * without putting the cup down - and one box for how it tasted.
 *
 * The dose sits alone underneath the two that matter, because it usually has
 * not changed since the last shot and being asked to retype it every time is
 * how a dial-in gets abandoned halfway through. Left empty, the recipe's own
 * dose stands.
 */
export const ShotForm = ({ session }: ShotFormProps): JSX.Element => {
  const styles = useThemedStyles(createShotFormStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.dialInShotSection)}</Text>
      <View style={styles.row}>
        <View style={styles.field}>
          <Input
            label={t(TRANSLATION_KEYS.dialInShotTime)}
            value={session.form.timeSeconds}
            keyboardType={NUMERIC}
            disabled={session.isSending}
            onChangeText={(timeSeconds: string): void => {
              session.edit({ timeSeconds });
            }}
          />
        </View>
        <View style={styles.field}>
          <Input
            label={t(TRANSLATION_KEYS.dialInShotYield)}
            value={session.form.yieldGrams}
            keyboardType={NUMERIC}
            disabled={session.isSending}
            onChangeText={(yieldGrams: string): void => {
              session.edit({ yieldGrams });
            }}
          />
        </View>
      </View>
      <Input
        label={t(TRANSLATION_KEYS.dialInShotDose)}
        value={session.form.doseGrams}
        keyboardType={NUMERIC}
        disabled={session.isSending}
        onChangeText={(doseGrams: string): void => {
          session.edit({ doseGrams });
        }}
      />
      <Input
        label={t(TRANSLATION_KEYS.dialInShotTaste)}
        value={session.form.taste}
        placeholder={t(TRANSLATION_KEYS.dialInShotTastePlaceholder)}
        disabled={session.isSending}
        onChangeText={(taste: string): void => {
          session.edit({ taste });
        }}
      />
      <View style={styles.actions}>
        {session.sendFailed ? (
          <Text variant="bodySmall" tone="error">
            {t(TRANSLATION_KEYS.dialInError)}
          </Text>
        ) : null}
        {session.canSend ? null : (
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.dialInMissingShot)}
          </Text>
        )}
        <Button
          label={t(
            session.isSending ? TRANSLATION_KEYS.dialInSending : TRANSLATION_KEYS.dialInSend,
          )}
          fullWidth
          loading={session.isSending}
          disabled={!session.canSend || session.isSending}
          onPress={session.send}
        />
      </View>
    </Card>
  );
};
