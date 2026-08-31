import type { LabelPhotoIssue } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { TileRow } from '../../../../components/layout';
import { Button, LoadingState, Text, Tile } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { SCAN_ICONS } from '../../constants';
import { BAG_PHOTO_SOURCES, type BagPhotoSource } from '../../services/pickBagPhoto';
import { BagPhotoIssueNotice } from '../BagPhotoIssueNotice';

import { createBagPhotoStepStyles } from './BagPhotoStep.styles';

const NOTHING = 0;
const NO_ISSUES: readonly LabelPhotoIssue[] = [];

export interface BagPhotoStepProps {
  readonly isWorking: boolean;
  /** Why the last attempt came back with nothing, empty before there was one. */
  readonly issues?: readonly LabelPhotoIssue[];
  readonly onCapture: (source: BagPhotoSource) => void;
  readonly onSkip: () => void;
}

/**
 * A photograph of the label, or not.
 *
 * The camera and "zadám ručne" are the same size, side by side, on purpose. A
 * photograph is the fast path, not the required one: bad light, a matte bag, a
 * shop that frowns at cameras and a phone on one bar are all ordinary, and
 * none of them is a reason somebody cannot ask a question about their coffee.
 * As three stacked buttons the manual route read as the thing you fall back to
 * once the two above it have failed you.
 *
 * The library sits underneath and quieter because it is neither of those two
 * paths - it is the same photograph, taken earlier.
 */
export const BagPhotoStep = ({
  isWorking,
  issues = NO_ISSUES,
  onCapture,
  onSkip,
}: BagPhotoStepProps): JSX.Element => {
  const styles = useThemedStyles(createBagPhotoStepStyles);
  const { t } = useTranslation();
  const wasRefused = issues.length > NOTHING;

  if (isWorking) {
    return <LoadingState label={t(TRANSLATION_KEYS.scanPhotoReading)} />;
  }

  return (
    <View style={styles.actions}>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.scanPhotoTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.scanPhotoBody)}
      </Text>
      {wasRefused ? <BagPhotoIssueNotice issues={issues} /> : null}
      <TileRow>
        <Tile
          icon={SCAN_ICONS.camera}
          tone="primary"
          title={t(wasRefused ? TRANSLATION_KEYS.scanPhotoRetake : TRANSLATION_KEYS.scanPhotoTake)}
          caption={t(TRANSLATION_KEYS.scanPhotoTakeCaption)}
          onPress={(): void => {
            onCapture(BAG_PHOTO_SOURCES.camera);
          }}
        />
        <Tile
          icon={SCAN_ICONS.manual}
          tone="accent"
          title={t(TRANSLATION_KEYS.scanPhotoSkip)}
          caption={t(TRANSLATION_KEYS.scanPhotoSkipCaption)}
          onPress={onSkip}
        />
      </TileRow>
      <Button
        label={t(TRANSLATION_KEYS.scanPhotoChoose)}
        variant="tertiary"
        fullWidth
        onPress={(): void => {
          onCapture(BAG_PHOTO_SOURCES.library);
        }}
      />
    </View>
  );
};
