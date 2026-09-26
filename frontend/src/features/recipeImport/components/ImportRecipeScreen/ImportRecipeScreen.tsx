import type { JSX } from 'react';
import { View } from 'react-native';

import { FlowHeader, HEADER_SCREEN_EDGES, Screen } from '../../../../components/layout';
import { StepProgress } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { IMPORT_ICONS } from '../../constants';
import { useRecipeImport } from '../../hooks';
import { resolveImportSteps } from '../../services';

import { ImportStageContent } from './ImportStageContent';
import { createImportRecipeScreenStyles } from './ImportRecipeScreen.styles';

/**
 * Somebody else's recipe, on this person's equipment.
 *
 * Four stages, and the order is the order a person can answer in: what the
 * recipe says, whether that is really what it says, what they will brew it in,
 * and then the numbers. Nothing is computed until the middle question has been
 * answered, because everything after it is arithmetic over that answer.
 *
 * It is led by the same block the scanner is, because it is the same kind of
 * thing: a flow reached from somewhere else and worked through a stage at a
 * time. What the block says stays put while the stages change under it - each
 * stage asks its own question in its own heading, and the block is what says
 * which errand all four belong to.
 *
 * The step strip counts three of them. The result is the flow's answer rather
 * than a step in it, and numbering it would tell somebody they were one step
 * from the end at the moment they already had what they came for - the same
 * rule the scanner and the quick brew follow.
 */
export const ImportRecipeScreen = (): JSX.Element => {
  const styles = useThemedStyles(createImportRecipeScreenStyles);
  const { t } = useTranslation();
  const recipeImport = useRecipeImport();
  const steps = resolveImportSteps(recipeImport.stage);

  return (
    <Screen scrollable padded={false} edges={HEADER_SCREEN_EDGES}>
      <FlowHeader
        icon={IMPORT_ICONS.flow}
        title={t(TRANSLATION_KEYS.importRecipeTitle)}
        body={t(TRANSLATION_KEYS.importRecipeIntro)}
      />
      <View style={styles.content}>
        <StepProgress current={steps.current} total={steps.total} />
        <ImportStageContent recipeImport={recipeImport} />
      </View>
    </Screen>
  );
};
