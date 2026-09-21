import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton, type PillTone } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import {
  PREVIEW_ESPRESSO_TONES,
  PREVIEW_PILL_ICON,
  PREVIEW_PILL_TONE_LABELS,
  PREVIEW_PILL_TONES,
} from '../../constants';

import { createButtonsSectionStyles } from './ButtonsSection.styles';

const noop = (): void => undefined;

/**
 * Every tone the app has, each labelled with its own name.
 *
 * The two drawn for a brown ground sit on one, because a cream pill on a
 * light card is the one combination this catalogue must not make look
 * reasonable.
 */
export const PillToneRow = (): JSX.Element => {
  const styles = useThemedStyles(createButtonsSectionStyles);
  const { t } = useTranslation();

  return (
    <>
      {PREVIEW_PILL_TONES.map((tone: PillTone): JSX.Element => {
        const pill = (
          <PillButton
            tone={tone}
            icon={PREVIEW_PILL_ICON}
            label={t(PREVIEW_PILL_TONE_LABELS[tone])}
            onPress={noop}
            fullWidth
          />
        );

        return PREVIEW_ESPRESSO_TONES.includes(tone) ? (
          <View key={tone} style={styles.espressoBox}>
            {pill}
          </View>
        ) : (
          <View key={tone}>{pill}</View>
        );
      })}
    </>
  );
};
