import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Input, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BAG_PHOTO_SOURCES } from '../../../bagEvaluations/services';
import type { RecipeImport } from '../../hooks';

import { createImportSourceStepStyles } from './ImportSourceStep.styles';

export interface ImportSourceStepProps {
  readonly recipeImport: RecipeImport;
}

/**
 * Where the recipe came from, offered as three equal doors.
 *
 * Pasting text is first because it is what somebody standing in front of a
 * video description can actually do. The camera sits beside it rather than
 * above it, and "zadám to ručne" sits beside both - a build with no storage
 * bucket simply hides the camera instead of failing when it is pressed.
 */
export const ImportSourceStep = ({ recipeImport }: ImportSourceStepProps): JSX.Element => {
  const styles = useThemedStyles(createImportSourceStepStyles);
  const { t } = useTranslation();
  const { source } = recipeImport;

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.importSourceSection)}</Text>
      <Input
        label={t(TRANSLATION_KEYS.importSourcePasteLabel)}
        value={source.text}
        placeholder={t(TRANSLATION_KEYS.importSourcePastePlaceholder)}
        onChangeText={source.write}
        disabled={source.isReading}
      />
      {source.photo.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.importSourcePhotoError)}
        </Text>
      ) : null}
      {source.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.importSourceError)}
        </Text>
      ) : null}
      <View style={styles.actions}>
        {source.photo.isSupported ? (
          <View style={styles.photoRow}>
            <Button
              label={t(TRANSLATION_KEYS.importSourcePhoto)}
              variant="secondary"
              fullWidth
              disabled={source.isReading}
              onPress={(): void => {
                source.addPhoto(BAG_PHOTO_SOURCES.library);
              }}
            />
          </View>
        ) : null}
        <Button
          label={t(
            source.isReading
              ? TRANSLATION_KEYS.importSourceReading
              : TRANSLATION_KEYS.importSourceRead,
          )}
          fullWidth
          loading={source.isReading}
          disabled={!source.canRead || source.isReading}
          onPress={(): void => {
            source.read(recipeImport.toReview);
          }}
        />
        {source.canRead ? null : (
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.importSourceEmpty)}
          </Text>
        )}
        <Button
          label={t(TRANSLATION_KEYS.importSourceManual)}
          variant="tertiary"
          fullWidth
          disabled={source.isReading}
          onPress={recipeImport.startManually}
        />
      </View>
    </Card>
  );
};
