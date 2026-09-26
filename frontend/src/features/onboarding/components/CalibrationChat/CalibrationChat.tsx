import { useState, type JSX } from 'react';
import { View } from 'react-native';

import {
  CHAT_AUTHORS,
  ChatBubble,
  Chip,
  InfoNote,
  Input,
  PillButton,
  SectionHeading,
  Text,
} from '../../../../components/ui';
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
      <SectionHeading
        title={t(TRANSLATION_KEYS.calibrationChatTitle)}
        caption={t(TRANSLATION_KEYS.calibrationChatBody)}
        placement="card"
      />
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
      <PillButton
        tone="espresso"
        label={t(TRANSLATION_KEYS.calibrationChatSend)}
        onPress={(): void => {
          calibration.describe(description);
        }}
        disabled={description.trim() === EMPTY}
        isPending={calibration.isPending}
        fullWidth
      />
      {calibration.notUnderstood ? (
        <InfoNote tone="caution" text={t(TRANSLATION_KEYS.calibrationNotUnderstood)} />
      ) : null}
      {hasReadings ? (
        <View style={styles.readings}>
          <SectionHeading title={t(TRANSLATION_KEYS.calibrationUnderstoodTitle)} placement="card" />
          <View style={styles.chips}>
            {calibration.readings.map((reading: CalibrationReading): JSX.Element => (
              <Chip key={reading.id} label={t(reading.labelKey)} />
            ))}
          </View>
        </View>
      ) : null}
      {calibration.hasFailed ? (
        <Text variant="captionSmall" tone="error">
          {t(TRANSLATION_KEYS.calibrationSaveError)}
        </Text>
      ) : null}
    </View>
  );
};
