import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Button, ChatBubble, Input, Text, CHAT_AUTHORS } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { CalibrationBrew } from '../../hooks/useCalibrationBrew';
import type { CalibrationReading } from '../../services/calibrationLexiconTypes';

import { createCalibrationChatStyles } from './CalibrationChat.styles';

export interface CalibrationChatProps {
  readonly calibration: CalibrationBrew;
}

const EMPTY = '';
const NOTHING = 0;

/**
 * "Aké to bolo?", answered in the drinker's own words.
 *
 * What the app understood is shown back before it is treated as a fact about
 * somebody's taste, because a lexicon reading a free sentence will sometimes
 * be wrong and the person who wrote the sentence is the only one who can say
 * so.
 */
export const CalibrationChat = ({ calibration }: CalibrationChatProps): JSX.Element => {
  const styles = useThemedStyles(createCalibrationChatStyles);
  const { t } = useTranslation();
  const [description, setDescription] = useState(EMPTY);
  const hasReadings = calibration.readings.length > NOTHING;

  return (
    <View style={styles.wrapper}>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.calibrationChatTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.calibrationChatBody)}
      </Text>
      {description.trim() === EMPTY ? null : (
        <ChatBubble message={description} author={CHAT_AUTHORS.user} />
      )}
      <Input
        label={t(TRANSLATION_KEYS.calibrationChatTitle)}
        placeholder={t(TRANSLATION_KEYS.calibrationChatPlaceholder)}
        helpText={t(TRANSLATION_KEYS.calibrationChatExample)}
        value={description}
        disabled={calibration.isPending}
        onChangeText={setDescription}
      />
      <Button
        label={t(TRANSLATION_KEYS.calibrationChatSend)}
        onPress={(): void => {
          calibration.describe(description);
        }}
        disabled={description.trim() === EMPTY}
        loading={calibration.isPending}
        fullWidth
      />
      {calibration.notUnderstood ? (
        <Text variant="bodyMedium" tone="tertiary">
          {t(TRANSLATION_KEYS.calibrationNotUnderstood)}
        </Text>
      ) : null}
      {hasReadings ? (
        <View style={styles.readings}>
          <Text variant="labelMedium" tone="muted">
            {t(TRANSLATION_KEYS.calibrationUnderstoodTitle)}
          </Text>
          {calibration.readings.map((reading: CalibrationReading): JSX.Element => (
            <Text key={reading.id} variant="bodyMedium">
              {t(reading.labelKey)}
            </Text>
          ))}
        </View>
      ) : null}
      {calibration.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.calibrationSaveError)}
        </Text>
      ) : null}
    </View>
  );
};
