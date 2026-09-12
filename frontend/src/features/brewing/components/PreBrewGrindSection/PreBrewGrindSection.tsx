import type { BrewMethod, CoffeeBag, EquipmentSet } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useGrindGuidance } from '../../hooks/useGrindGuidance';

import { PreBrewGrindBody } from './PreBrewGrindBody';
import { createPreBrewGrindSectionStyles } from './PreBrewGrindSection.styles';

export interface PreBrewGrindSectionProps {
  readonly method: BrewMethod;
  readonly bag: CoffeeBag | null;
  readonly equipmentSet: EquipmentSet | undefined;
}

/**
 * Where to put the collar, on the screen before anybody asks for a recipe.
 *
 * The one answer this app can give for free, instantly and offline, and the
 * one people need most often: a cafe opening a bag wants a starting point
 * several times a morning, and every attempt that misses is a dose in the
 * knock box. The recipe engine works the same number out on its way to writing
 * everything else - showing it here first means somebody can grind while the
 * recipe is still being written, and can see what the recipe was built on
 * rather than only what it concluded.
 *
 * It says why, always. A number with no reasoning behind it is something to
 * obey or ignore; a number that names the roast and the days on the shelf is
 * something somebody can disagree with, and disagreeing with it correctly is
 * how they learn their own grinder.
 */
export const PreBrewGrindSection = ({
  method,
  bag,
  equipmentSet,
}: PreBrewGrindSectionProps): JSX.Element | null => {
  const styles = useThemedStyles(createPreBrewGrindSectionStyles);
  const { t } = useTranslation();
  const reading = useGrindGuidance(method, bag, equipmentSet);

  if (reading.guidance === null) {
    return null;
  }

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewGrindSection)}</Text>
      <View style={styles.rows}>
        <PreBrewGrindBody reading={reading} guidance={reading.guidance} />
      </View>
      <View style={styles.note}>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.preBrewGrindIntro)}
        </Text>
      </View>
    </Card>
  );
};
