import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import { CORRECTION_ICONS } from '../../constants';
import { TasteTuningSheet } from '../TasteTuningSheet';

import { createTasteCorrectionCardStyles } from './TasteCorrectionCard.styles';

/**
 * The two ways to disagree with the profile above.
 *
 * Answering the questionnaire again is evidence; moving the sliders is an
 * instruction. The second overrules the first, and should - which is what the
 * sentence on this card says out loud, because a person who cannot tell the
 * two apart will pick the wrong one and conclude the app ignored them.
 */
export const TasteCorrectionCard = (): JSX.Element | null => {
  const styles = useThemedStyles(createTasteCorrectionCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();
  const openStep = useOnboardingStepLink();
  const [tuning, setTuning] = useState(false);

  if (profile === undefined) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name={CORRECTION_ICONS.heading}
          size={theme.size.axisRowGlyph}
          color={theme.colors.primary}
        />
        <Text variant="sectionHeading">{t(TRANSLATION_KEYS.profileTuneTitleCard)}</Text>
      </View>
      <Text variant="bodyMuted" tone="muted">
        {t(TRANSLATION_KEYS.profileTuneCardBody)}
      </Text>
      <View style={styles.buttons}>
        <PillButton
          tone="espresso"
          size="small"
          icon={CORRECTION_ICONS.questionnaire}
          label={t(TRANSLATION_KEYS.profileRetakeAction)}
          onPress={(): void => {
            openStep(ONBOARDING_STEPS.taste);
          }}
        />
        <PillButton
          tone="surfaceLead"
          size="small"
          icon={CORRECTION_ICONS.manual}
          label={t(TRANSLATION_KEYS.profileTuneAction)}
          onPress={(): void => {
            setTuning(true);
          }}
        />
      </View>
      <TasteTuningSheet
        profile={profile}
        visible={tuning}
        onClose={(): void => {
          setTuning(false);
        }}
      />
    </View>
  );
};
