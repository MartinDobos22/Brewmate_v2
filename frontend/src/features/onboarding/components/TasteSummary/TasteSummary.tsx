import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { TasteRadarChart } from '../../../tasteProfile/components';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import type { TasteQuestionnaire } from '../../hooks/tasteQuestionnaireTypes';
import { TasteAnswerList } from '../TasteAnswerList';

import { TasteSummaryActions } from './TasteSummaryActions';
import { readSummaryHeadingKeys } from './readSummaryHeadingKeys';

export interface TasteSummaryProps {
  readonly questionnaire: TasteQuestionnaire;
  /** True when the questionnaire was opened on its own, rather than in the flow. */
  readonly isSingleStep: boolean;
}

/**
 * The questionnaire held still: what was answered, and what it produced.
 *
 * This screen is two things the flow never had. It is the acknowledgement -
 * tapping the last card used to send the answers and slide straight on, so the
 * one moment the questionnaire exists for was the one moment nothing was said.
 * And it is the safe state: everything here is read until somebody presses
 * "upraviť", because the way back into the questionnaire is also the way to
 * overwrite what it taught, and a stray tap must not be able to do that.
 *
 * The profile is drawn rather than described, for the reason the closing
 * screen draws it too: the answers came back as a shape, and the vertices it
 * has not earned are the honest way of saying how much of this is still a
 * guess.
 */
export const TasteSummary = ({ questionnaire, isSingleStep }: TasteSummaryProps): JSX.Element => {
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();
  const headings = readSummaryHeadingKeys(questionnaire);

  return (
    <>
      <Text variant="headlineSmall">{t(headings.titleKey)}</Text>
      <Text variant="bodyMedium" tone={questionnaire.isDirty ? 'error' : 'default'}>
        {t(headings.bodyKey)}
      </Text>
      {questionnaire.isEditing || profile === undefined ? null : (
        <TasteRadarChart axes={profile} axisConfidence={profile.axisConfidence} />
      )}
      <TasteAnswerList
        rows={questionnaire.rows}
        onSelect={questionnaire.isEditing ? questionnaire.openRow : null}
      />
      {questionnaire.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.tqSaveFailed)}
        </Text>
      ) : null}
      <TasteSummaryActions questionnaire={questionnaire} isSingleStep={isSingleStep} />
      {questionnaire.isEditing ? null : (
        <Button
          label={t(TRANSLATION_KEYS.tqEditAnswers)}
          variant="secondary"
          onPress={questionnaire.edit}
          fullWidth
        />
      )}
    </>
  );
};
