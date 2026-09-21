import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton, type PillSize } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { PREVIEW_PILL_ICON, PREVIEW_PILL_SIZE_LABELS, PREVIEW_PILL_SIZES } from '../../constants';

import { createButtonsSectionStyles } from './ButtonsSection.styles';

const noop = (): void => undefined;

/**
 * The four heights, side by side, which is the only way to check that they
 * are four rather than the seven they were.
 */
export const PillSizeRow = (): JSX.Element => {
  const styles = useThemedStyles(createButtonsSectionStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {PREVIEW_PILL_SIZES.map((size: PillSize): JSX.Element => (
        <PillButton
          key={size}
          tone="surface"
          size={size}
          icon={PREVIEW_PILL_ICON}
          label={t(PREVIEW_PILL_SIZE_LABELS[size])}
          onPress={noop}
        />
      ))}
    </View>
  );
};
