import { ROAST_LEVEL_VALUES, type RoastLevel } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Chip, Input, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ROAST_LEVEL_LABEL_KEYS } from '../../../tasteProfile/constants';
import type { QuickBrew } from '../../hooks/useQuickBrew';

import { createQuickBrewCoffeeStepStyles } from './QuickBrewCoffeeStep.styles';

const UNKNOWN_ROAST = null;

export interface QuickBrewCoffeeStepProps {
  readonly brew: QuickBrew;
}

/**
 * Everything the drinker happens to know, and nothing they do not.
 *
 * Every field here is optional, and the note under them says so before
 * somebody starts looking for the answer on the bag. "Neviem" is a chip like
 * any other rather than the absence of a choice, so declining to guess is a
 * thing you can actively do.
 */
export const QuickBrewCoffeeStep = ({ brew }: QuickBrewCoffeeStepProps): JSX.Element => {
  const styles = useThemedStyles(createQuickBrewCoffeeStepStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.quickBrewCoffeeTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.quickBrewCoffeeBody)}
      </Text>
      <Input
        label={t(TRANSLATION_KEYS.quickBrewCoffeeNameLabel)}
        placeholder={t(TRANSLATION_KEYS.quickBrewCoffeeNamePlaceholder)}
        value={brew.coffee.name}
        onChangeText={(name: string): void => {
          brew.describeCoffee({ name });
        }}
      />
      <Text variant="labelMedium" tone="muted">
        {t(TRANSLATION_KEYS.quickBrewRoastLabel)}
      </Text>
      <View style={styles.roasts}>
        <Chip
          label={t(TRANSLATION_KEYS.quickBrewRoastUnknown)}
          selected={brew.coffee.roastLevel === UNKNOWN_ROAST}
          onPress={(): void => {
            brew.describeCoffee({ roastLevel: UNKNOWN_ROAST });
          }}
        />
        {ROAST_LEVEL_VALUES.map((roastLevel: RoastLevel): JSX.Element => (
          <Chip
            key={roastLevel}
            label={t(ROAST_LEVEL_LABEL_KEYS[roastLevel])}
            selected={brew.coffee.roastLevel === roastLevel}
            onPress={(): void => {
              brew.describeCoffee({ roastLevel });
            }}
          />
        ))}
      </View>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.quickBrewCoffeeOptionalNote)}
      </Text>
      {brew.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.quickBrewError)}
        </Text>
      ) : null}
      <Button
        label={t(TRANSLATION_KEYS.quickBrewSubmit)}
        fullWidth
        loading={brew.isPending}
        onPress={(): void => {
          brew.askForRecipe(t(TRANSLATION_KEYS.quickBrewRationale));
        }}
      />
      <Button
        label={t(TRANSLATION_KEYS.actionBack)}
        variant="tertiary"
        fullWidth
        onPress={brew.back}
      />
    </View>
  );
};
