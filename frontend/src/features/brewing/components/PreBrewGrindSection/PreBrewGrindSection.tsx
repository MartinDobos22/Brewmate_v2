import {
  GRIND_GUIDANCE_SOURCES,
  type BrewMethod,
  type CoffeeBag,
  type EquipmentSet,
} from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useGrindGuidance } from '../../hooks/useGrindGuidance';

import { PreBrewGrindBody } from './PreBrewGrindBody';
import { createPreBrewGrindSectionStyles } from './PreBrewGrindSection.styles';
import { PreBrewGrinderPicker } from './PreBrewGrinderPicker';

export interface PreBrewGrindSectionProps {
  readonly method: BrewMethod;
  readonly bag: CoffeeBag | null;
  readonly equipmentSet: EquipmentSet | undefined;
  /** Null until somebody picks one, which is the usual state. */
  readonly grinderEquipmentId: string | null;
  readonly onChooseGrinder: (equipmentId: string) => void;
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
 *
 * Which grinder is asked here rather than anywhere else, because this is the
 * card the answer changes. Put on the gear screen it would be a preference
 * somebody set once and forgot; put here it sits directly above the number it
 * decides, and picking another machine redraws that number while they are
 * still standing over it - a click is ten microns on one grinder and forty on
 * another, so the band above is about a particular machine or it is about
 * nothing.
 */
export const PreBrewGrindSection = ({
  method,
  bag,
  equipmentSet,
  grinderEquipmentId,
  onChooseGrinder,
}: PreBrewGrindSectionProps): JSX.Element | null => {
  const styles = useThemedStyles(createPreBrewGrindSectionStyles);
  const { t } = useTranslation();
  const reading = useGrindGuidance(method, bag, equipmentSet, grinderEquipmentId);

  if (reading.guidance === null) {
    return null;
  }

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewGrindSection)}</Text>
      <PreBrewGrinderPicker
        candidates={reading.candidates}
        chosenId={reading.chosenId}
        onChoose={onChooseGrinder}
      />
      <View style={styles.rows}>
        <PreBrewGrindBody reading={reading} guidance={reading.guidance} />
      </View>
      <View style={styles.note}>
        <Text variant="bodySmall" tone="muted">
          {t(
            reading.guidance.source === GRIND_GUIDANCE_SOURCES.publishedRange
              ? TRANSLATION_KEYS.preBrewGrindIntroPublished
              : TRANSLATION_KEYS.preBrewGrindIntroWindow,
          )}
        </Text>
      </View>
    </Card>
  );
};
