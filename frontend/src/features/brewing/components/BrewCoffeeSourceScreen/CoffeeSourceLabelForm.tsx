import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { CoffeeBagFormFields } from '../../../inventory/components';
import type { CoffeeSource } from '../../hooks/useCoffeeSource';

import { createBrewCoffeeSourceStyles } from './BrewCoffeeSourceScreen.styles';

const NOTHING = 0;

export interface CoffeeSourceLabelFormProps {
  readonly source: CoffeeSource;
}

/**
 * What was read off the bag, before it becomes a coffee in the cupboard.
 *
 * "Rozumiem tomu takto", the same offer the calibration brew and the recipe
 * import both make. Everything below this point multiplies these numbers into
 * each other - a roast date decides whether the coffee is ready, a roast level
 * moves the recipe - so a misreading caught here costs one glance, and the
 * same misreading caught after the cup costs the bag.
 *
 * Nothing is required, and what the camera read badly is marked rather than
 * corrected: the app does not know better than the person holding the bag, it
 * only knows which boxes it squinted at.
 */
export const CoffeeSourceLabelForm = ({ source }: CoffeeSourceLabelFormProps): JSX.Element => {
  const styles = useThemedStyles(createBrewCoffeeSourceStyles);
  const { t } = useTranslation();
  const hasUncertainFields = source.unverified.length > NOTHING;

  return (
    <View style={styles.options}>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewSourceLabelTitle)}</Text>
      <Text variant="bodySmall" tone={hasUncertainFields ? 'tertiary' : 'muted'}>
        {t(
          hasUncertainFields
            ? TRANSLATION_KEYS.scanLabelCheckUncertain
            : TRANSLATION_KEYS.preBrewSourceLabelHint,
        )}
      </Text>
      {source.photo.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.scanPhotoFailed)}
        </Text>
      ) : null}
      <CoffeeBagFormFields
        values={source.label}
        unverified={source.unverified}
        disabled={source.isSaving}
        onChange={source.describeLabel}
      />
      {source.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.scanError)}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <Button
          label={t(TRANSLATION_KEYS.preBrewSourceKeep)}
          fullWidth
          loading={source.isSaving}
          onPress={(): void => {
            source.keepLabel(t(TRANSLATION_KEYS.inventoryUnnamedCoffee));
          }}
        />
        <Button
          label={t(TRANSLATION_KEYS.preBrewSourceBack)}
          variant="tertiary"
          fullWidth
          disabled={source.isSaving}
          onPress={source.back}
        />
      </View>
    </View>
  );
};
