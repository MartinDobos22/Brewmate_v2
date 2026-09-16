import type { WaterType } from '@brewmate/shared';
import type { JSX } from 'react';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { WaterTypeDropdown } from '../../../inventory/components';

export interface PreBrewWaterSectionProps {
  readonly waterType: WaterType;
  readonly onChoose: (waterType: WaterType) => void;
}

/**
 * The water, as a card like every other question on this screen.
 *
 * It used to be five bare option cards with no heading at all, which read as a
 * list that had lost its question. Wrapped and closed into one line it says
 * what it is, says where the answer came from, and takes a tap to change -
 * which is the right weight for something that is already correct almost every
 * morning.
 */
export const PreBrewWaterSection = ({
  waterType,
  onChoose,
}: PreBrewWaterSectionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewWaterSection)}</Text>
      <WaterTypeDropdown selected={waterType} onSelect={onChoose} />
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.preBrewWaterHint)}
      </Text>
    </Card>
  );
};
