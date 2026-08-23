import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, LoadingState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BAG_PHOTO_SOURCES, type BagPhotoSource } from '../../services/pickBagPhoto';

import { createBagPhotoStepStyles } from './BagPhotoStep.styles';

export interface BagPhotoStepProps {
  readonly isWorking: boolean;
  readonly onCapture: (source: BagPhotoSource) => void;
  readonly onSkip: () => void;
}

/**
 * A photograph of the label, or not.
 *
 * "Zadám ručne" is as prominent as the camera on purpose. A photograph is the
 * fast path, not the required one: bad light, a matte bag, a shop that frowns
 * at cameras and a phone on one bar are all ordinary, and none of them is a
 * reason somebody cannot ask a question about their coffee.
 */
export const BagPhotoStep = ({ isWorking, onCapture, onSkip }: BagPhotoStepProps): JSX.Element => {
  const styles = useThemedStyles(createBagPhotoStepStyles);
  const { t } = useTranslation();

  if (isWorking) {
    return <LoadingState label={t(TRANSLATION_KEYS.scanPhotoReading)} />;
  }

  return (
    <View style={styles.actions}>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.scanPhotoTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.scanPhotoBody)}
      </Text>
      <Button
        label={t(TRANSLATION_KEYS.scanPhotoTake)}
        fullWidth
        onPress={(): void => {
          onCapture(BAG_PHOTO_SOURCES.camera);
        }}
      />
      <Button
        label={t(TRANSLATION_KEYS.scanPhotoChoose)}
        variant="secondary"
        fullWidth
        onPress={(): void => {
          onCapture(BAG_PHOTO_SOURCES.library);
        }}
      />
      <Button
        label={t(TRANSLATION_KEYS.scanPhotoSkip)}
        variant="tertiary"
        fullWidth
        onPress={onSkip}
      />
    </View>
  );
};
