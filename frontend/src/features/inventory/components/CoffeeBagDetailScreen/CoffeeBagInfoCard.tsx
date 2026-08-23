import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { BagFreshnessLabel, BagRemainingLabel } from '../CoffeeBagCard';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';
import { InfoRow } from './InfoRow';

const NOTES_SEPARATOR = ', ';
const NOTHING = 0;

export interface CoffeeBagInfoCardProps {
  readonly bag: CoffeeBag;
}

/**
 * Everything known about one coffee.
 *
 * Only what is actually recorded is printed. A row of dashes where a farm
 * would be tells somebody nothing except that the app has a farm field, and a
 * bag whose label said nothing is a perfectly ordinary bag.
 */
export const CoffeeBagInfoCard = ({ bag }: CoffeeBagInfoCardProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="headlineSmall">{bag.name}</Text>
      <View style={styles.meta}>
        <BagRemainingLabel bag={bag} />
        <BagFreshnessLabel bag={bag} />
      </View>
      <View style={styles.rows}>
        <InfoRow label={t(TRANSLATION_KEYS.scanRoasterLabel)} value={bag.roaster} />
        <InfoRow label={t(TRANSLATION_KEYS.scanOriginLabel)} value={bag.originCountry} />
        <InfoRow label={t(TRANSLATION_KEYS.scanRegionLabel)} value={bag.region} />
        <InfoRow label={t(TRANSLATION_KEYS.scanFarmLabel)} value={bag.farm} />
        <InfoRow label={t(TRANSLATION_KEYS.scanVarietyLabel)} value={bag.variety} />
        <InfoRow label={t(TRANSLATION_KEYS.scanProcessLabel)} value={bag.process} />
        <InfoRow label={t(TRANSLATION_KEYS.scanRoastDateLabel)} value={bag.roastDate} />
        <InfoRow
          label={t(TRANSLATION_KEYS.scanAltitudeLabel)}
          value={bag.altitude === null ? null : String(bag.altitude)}
        />
        <InfoRow
          label={t(TRANSLATION_KEYS.scanWeightLabel)}
          value={bag.weightGrams === null ? null : formatGrams(bag.weightGrams)}
        />
        <InfoRow
          label={t(TRANSLATION_KEYS.scanNotesLabel)}
          value={
            bag.tastingNotes.length === NOTHING ? null : bag.tastingNotes.join(NOTES_SEPARATOR)
          }
        />
      </View>
    </Card>
  );
};
