import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { TileRow } from '../../../../components/layout';
import { Text, Tile } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';
import { HOME_HINTS, HOME_HINT_IDS, type HomeHintPresentation } from '../../constants';
import { useHomeHint } from '../../hooks';

/**
 * The one thing worth saying today.
 *
 * One hint rather than a list of them: five pieces of advice at once is five
 * nobody reads. Which one it is comes from the account - a bag going off, a
 * profile nobody has filled in, a fortnight without a cup - and only when
 * there is genuinely nothing to report does it teach something instead.
 *
 * It renders nothing until every query behind it has answered. A hint is
 * advice about a particular cupboard, and one written from half the evidence
 * would announce that cupboard is empty a second before it fills in.
 */
export const HomeHintTile = (): JSX.Element | null => {
  const { t } = useTranslation();
  const router = useRouter();
  const openStep = useOnboardingStepLink();
  const { hint, isReady } = useHomeHint();

  if (!isReady) {
    return null;
  }

  const presentation: HomeHintPresentation = HOME_HINTS[hint.id];

  const open = (): void => {
    if (hint.id === HOME_HINT_IDS.taste) {
      openStep(ONBOARDING_STEPS.taste);

      return;
    }

    if (presentation.route !== null) {
      router.push(presentation.route);
    }
  };

  return (
    <TileRow>
      <Tile
        icon={presentation.icon}
        tone="accent"
        title={t(presentation.titleKey, hint.values)}
        onPress={presentation.route === null ? undefined : open}
      >
        <Text variant="bodySmall">{t(presentation.bodyKey, hint.values)}</Text>
      </Tile>
    </TileRow>
  );
};
