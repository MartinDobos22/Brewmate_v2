import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Tile } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';
import { CONFIDENCE_LABEL_KEYS, CONFIDENCE_LEVELS } from '../../../tasteProfile/constants';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import { resolveConfidenceLevel } from '../../../tasteProfile/services';
import { HOME_TILE_ICONS } from '../../constants';

import { TasteMiniChart } from './TasteMiniChart';

/**
 * What Brewmate believes about the person reading the screen.
 *
 * No chart is drawn until there is something behind it. A profile built from
 * nothing is a row of neutral bars, and neutral bars drawn neatly stop looking
 * like an absence of evidence and start looking like a considered opinion -
 * which is the one thing this tile must not claim. Until then it says so and
 * leads to the questionnaire; afterwards it leads to the full chart.
 */
export const TasteProfileTile = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const openStep = useOnboardingStepLink();
  const profile = useTasteProfile();

  const level =
    profile.data === undefined ? null : resolveConfidenceLevel(profile.data.confidenceLevel);
  const known = level !== null && level !== CONFIDENCE_LEVELS.none;

  return (
    <Tile
      icon={HOME_TILE_ICONS.taste}
      title={t(TRANSLATION_KEYS.homeTileTasteTitle)}
      caption={
        known
          ? t(TRANSLATION_KEYS.homeTileTasteCaption, { level: t(CONFIDENCE_LABEL_KEYS[level]) })
          : t(TRANSLATION_KEYS.homeTileTasteUnknown)
      }
      onPress={(): void => {
        if (known) {
          router.push(ROUTES.profile);

          return;
        }

        openStep(ONBOARDING_STEPS.taste);
      }}
    >
      {known && profile.data !== undefined ? <TasteMiniChart axes={profile.data} /> : null}
    </Tile>
  );
};
