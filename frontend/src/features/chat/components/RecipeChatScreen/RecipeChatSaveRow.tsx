import type { Recipe } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useUpdateRecipe } from '../../../brewing/hooks';

import { createRecipeChatScreenStyles } from './RecipeChatScreen.styles';

export interface RecipeChatSaveRowProps {
  readonly recipe: Recipe;
}

const SAVED = true;

/**
 * "Uložiť recept" - keeping this version for this coffee and this brewer.
 *
 * A recipe generated for one morning is not automatically worth keeping, so it
 * arrives unsaved and this is where somebody says otherwise. It saves whatever
 * version is current: if a patch was applied a moment ago, that is the recipe
 * being kept, not the one it replaced.
 */
export const RecipeChatSaveRow = ({ recipe }: RecipeChatSaveRowProps): JSX.Element => {
  const styles = useThemedStyles(createRecipeChatScreenStyles);
  const { t } = useTranslation();
  const update = useUpdateRecipe();

  return (
    <View style={styles.save}>
      {recipe.isSaved ? (
        <Text variant="bodySmall" tone="secondary">
          {t(TRANSLATION_KEYS.recipeSavedNotice)}
        </Text>
      ) : (
        <>
          {update.isError ? (
            <Text variant="bodySmall" tone="error">
              {t(TRANSLATION_KEYS.recipeSaveError)}
            </Text>
          ) : null}
          <Button
            label={t(TRANSLATION_KEYS.recipeSaveAction)}
            variant="secondary"
            fullWidth
            loading={update.isPending}
            onPress={(): void => {
              update.mutate({ id: recipe.id, changes: { isSaved: SAVED } });
            }}
          />
        </>
      )}
    </View>
  );
};
