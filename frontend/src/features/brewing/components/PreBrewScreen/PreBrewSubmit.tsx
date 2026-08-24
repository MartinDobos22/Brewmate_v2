import type { Recipe } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useIsOnline } from '../../../../hooks';
import { useThemedStyles } from '../../../../theme';
import type { BrewSetup } from '../../hooks/useBrewSetup';

import { createPreBrewScreenStyles } from './PreBrewScreen.styles';

export interface PreBrewSubmitProps {
  readonly setup: BrewSetup;
  readonly onWritten: (recipe: Recipe) => void;
}

/**
 * The one button, and everything standing between it and a recipe.
 *
 * Being offline is said before the attempt rather than after it. A request
 * that never leaves the phone fails for a reason somebody can see out of the
 * window, and telling them the server had a problem would send them looking in
 * the wrong place.
 */
export const PreBrewSubmit = ({ setup, onWritten }: PreBrewSubmitProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewScreenStyles);
  const { t } = useTranslation();
  const isOnline = useIsOnline();

  return (
    <View style={styles.submit}>
      {isOnline ? null : (
        <Text variant="bodySmall" tone="tertiary">
          {t(TRANSLATION_KEYS.preBrewOffline)}
        </Text>
      )}
      {setup.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.preBrewError)}
        </Text>
      ) : null}
      {setup.method === undefined ? (
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.preBrewMissingMethod)}
        </Text>
      ) : null}
      <Button
        label={t(
          setup.isPending ? TRANSLATION_KEYS.preBrewSubmitting : TRANSLATION_KEYS.preBrewSubmit,
        )}
        fullWidth
        loading={setup.isPending}
        disabled={setup.method === undefined || !isOnline}
        onPress={(): void => {
          setup.askForRecipe(onWritten);
        }}
      />
    </View>
  );
};
