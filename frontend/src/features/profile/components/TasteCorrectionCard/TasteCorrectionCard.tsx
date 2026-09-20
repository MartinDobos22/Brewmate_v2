import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
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

  const primaryStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.primary,
    pressed && styles.pressed,
  ];

  const secondaryStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.secondary,
    pressed && styles.pressed,
  ];

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
        <Pressable
          style={primaryStyle}
          onPress={(): void => {
            openStep(ONBOARDING_STEPS.taste);
          }}
          accessibilityRole="button"
          accessibilityLabel={t(TRANSLATION_KEYS.profileRetakeAction)}
        >
          <MaterialCommunityIcons
            name={CORRECTION_ICONS.questionnaire}
            size={theme.size.iconSmall}
            color={theme.colors.cream}
          />
          <Text variant="actionLabel" tone="onCream">
            {t(TRANSLATION_KEYS.profileRetakeAction)}
          </Text>
        </Pressable>
        <Pressable
          style={secondaryStyle}
          onPress={(): void => {
            setTuning(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={t(TRANSLATION_KEYS.profileTuneAction)}
        >
          <MaterialCommunityIcons
            name={CORRECTION_ICONS.manual}
            size={theme.size.iconSmall}
            color={theme.colors.primary}
          />
          <Text variant="actionLabel">{t(TRANSLATION_KEYS.profileTuneAction)}</Text>
        </Pressable>
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
