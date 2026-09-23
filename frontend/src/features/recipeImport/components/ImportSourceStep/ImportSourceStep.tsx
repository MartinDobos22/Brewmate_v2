import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, InfoNote, Input, PillButton, SectionHeading, Text } from '../../../../components/ui';
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
      <SectionHeading title={t(TRANSLATION_KEYS.importSourceSection)} placement="card" />
      <Input
        label={t(TRANSLATION_KEYS.importSourcePasteLabel)}
        value={source.text}
        placeholder={t(TRANSLATION_KEYS.importSourcePastePlaceholder)}
        onChangeText={source.write}
        disabled={source.isReading}
      />
      {source.camera.hasFailed ? (
        <Text variant="captionSmall" tone="error">
          {t(TRANSLATION_KEYS.importSourcePhotoError)}
        </Text>
      ) : null}
      {source.hasFailed ? (
        <Text variant="captionSmall" tone="error">
          {t(TRANSLATION_KEYS.importSourceError)}
        </Text>
      ) : null}
      <View style={styles.actions}>
        {source.camera.isSupported ? (
          <View style={styles.photoRow}>
            <PillButton
              tone="surface"
              label={t(TRANSLATION_KEYS.importSourcePhoto)}
              fullWidth
              disabled={source.isReading}
              onPress={(): void => {
                source.addPhoto(BAG_PHOTO_SOURCES.library);
              }}
            />
          </View>
        ) : null}
        <PillButton
          tone="espresso"
          label={t(
            source.isReading
              ? TRANSLATION_KEYS.importSourceReading
              : TRANSLATION_KEYS.importSourceRead,
          )}
          fullWidth
          isPending={source.isReading}
          disabled={!source.canRead || source.isReading}
          onPress={(): void => {
            source.read(recipeImport.toReview);
          }}
        />
        {source.canRead ? null : <InfoNote text={t(TRANSLATION_KEYS.importSourceEmpty)} />}
        <PillButton
          tone="surface"
          label={t(TRANSLATION_KEYS.importSourceManual)}
          fullWidth
          disabled={source.isReading}
          onPress={recipeImport.startManually}
        />
      </View>
    </Card>
  );
};
