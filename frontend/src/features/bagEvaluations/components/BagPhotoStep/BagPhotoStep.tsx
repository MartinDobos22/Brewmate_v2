import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { LabelPhotoIssue } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { LoadingState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { SCAN_ICONS } from '../../constants';
import { BAG_PHOTO_SOURCES, type BagPhotoSource } from '../../services/pickBagPhoto';
import { BagPhotoIssueNotice } from '../BagPhotoIssueNotice';

import { BagPhotoAction } from './BagPhotoAction';
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
 * The card that turns a bag into fields: photograph it, find one already
 * taken, or type it.
 *
 * A refused photograph leaves somebody here rather than sending them onwards,
 * with the reasons printed above the button that is about to be pressed again
 * and the camera relabelled. Typing it in is still underneath, the same size
 * as the library: a refusal with no way past it would be a dead end on the one
 * screen that gets used inside a building on one bar.
 */
export const BagPhotoStep = ({
  isWorking,
  issues = NO_ISSUES,
  onCapture,
  onSkip,
}: BagPhotoStepProps): JSX.Element => {
  const styles = useThemedStyles(createBagPhotoStepStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const wasRefused = issues.length > NOTHING;

  if (isWorking) {
    return <LoadingState label={t(TRANSLATION_KEYS.scanPhotoReading)} />;
  }

  return (
    <View style={styles.card}>
      <View style={styles.title}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name={SCAN_ICONS.camera}
            size={theme.size.iconRow}
            color={theme.colors.primary}
          />
          <Text variant="sectionHeading">{t(TRANSLATION_KEYS.scanPhotoTitle)}</Text>
        </View>
        <Text variant="bodyMuted" tone="muted">
          {t(TRANSLATION_KEYS.scanPhotoBody)}
        </Text>
      </View>
      {wasRefused ? <BagPhotoIssueNotice issues={issues} /> : null}
      <View style={styles.viewfinder}>
        <View style={styles.frame} />
        <MaterialCommunityIcons
          name={SCAN_ICONS.viewfinder}
          size={theme.size.emptyMarkGlyph}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="statusLabel" tone="muted">
          {t(TRANSLATION_KEYS.scanPhotoViewfinder)}
        </Text>
      </View>
      <BagPhotoAction
        icon={SCAN_ICONS.capture}
        label={t(wasRefused ? TRANSLATION_KEYS.scanPhotoRetake : TRANSLATION_KEYS.scanPhotoTake)}
        leads
        onPress={(): void => {
          onCapture(BAG_PHOTO_SOURCES.camera);
        }}
      />
      <View style={styles.alternatives}>
        <BagPhotoAction
          icon={SCAN_ICONS.library}
          label={t(TRANSLATION_KEYS.scanPhotoChoose)}
          spokenLabel={t(TRANSLATION_KEYS.scanPhotoChooseSpoken)}
          onPress={(): void => {
            onCapture(BAG_PHOTO_SOURCES.library);
          }}
        />
        <BagPhotoAction
          icon={SCAN_ICONS.manual}
          label={t(TRANSLATION_KEYS.scanPhotoSkip)}
          spokenLabel={t(TRANSLATION_KEYS.scanPhotoSkipSpoken)}
          onPress={onSkip}
        />
      </View>
    </View>
  );
};
