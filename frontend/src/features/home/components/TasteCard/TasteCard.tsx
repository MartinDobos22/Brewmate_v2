import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';
import { TasteRadarChart } from '../../../tasteProfile/components';
import { CONFIDENCE_LABEL_KEYS, CONFIDENCE_LEVELS } from '../../../tasteProfile/constants';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import { hasKnownAxis, resolveConfidenceLevel } from '../../../tasteProfile/services';
import { HOME_TILE_ICONS } from '../../constants';
import { createBrewWeekCardStyles } from '../BrewWeekCard/BrewWeekCard.styles';

/**
 * What Brewmate believes about the person reading the screen.
 *
 * No chart is drawn until there is something behind it. A profile built from
 * nothing is five middles, and five middles drawn neatly stop looking like an
 * absence of evidence and start looking like a considered opinion - which is
 * the one thing this card must not claim. Until then it says so and leads to
 * the questionnaire; afterwards it is literally the same web the profile
 * screen draws, without its labels, so nobody has to recognise two pictures
 * as the same person.
 */
export const TasteCard = (): JSX.Element => {
  const styles = useThemedStyles(createBrewWeekCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const openStep = useOnboardingStepLink();
  const profile = useTasteProfile();

  const level =
    profile.data === undefined ? null : resolveConfidenceLevel(profile.data.confidenceLevel);
  /**
   * Two conditions, because they can disagree and the chart is only honest
   * when both hold. An account can carry a real confidence built entirely from
   * a roast preference and a milk habit, having said nothing about any axis -
   * and the web drawn from that is the neat pentagon this card refuses to
   * draw.
   */
  const known =
    level !== null &&
    level !== CONFIDENCE_LEVELS.none &&
    profile.data !== undefined &&
    hasKnownAxis(profile.data.axisConfidence);

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.card,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={(): void => {
        if (known) {
          router.push(ROUTES.profile);

          return;
        }

        openStep(ONBOARDING_STEPS.taste);
      }}
      accessibilityRole="button"
      accessibilityLabel={t(TRANSLATION_KEYS.homeTileTasteTitle)}
    >
      <Text variant="eyebrow" tone="muted">
        {t(TRANSLATION_KEYS.homeTileTasteTitle)}
      </Text>
      {known ? (
        <TasteRadarChart axes={profile.data} axisConfidence={profile.data.axisConfidence} compact />
      ) : (
        <MaterialCommunityIcons
          name={HOME_TILE_ICONS.taste}
          size={theme.size.methodGlyphSize}
          color={theme.colors.onSurfaceEmpty}
        />
      )}
      <Text variant="caption" tone="muted">
        {known
          ? t(TRANSLATION_KEYS.homeTileTasteCaption, { level: t(CONFIDENCE_LABEL_KEYS[level]) })
          : t(TRANSLATION_KEYS.homeTileTasteUnknown)}
      </Text>
    </Pressable>
  );
};
