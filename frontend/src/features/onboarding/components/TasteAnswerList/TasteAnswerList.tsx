import type { JSX } from 'react';

import { Card, ListItem } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import type { AnswerSummaryRow } from '../../services/buildAnswerSummary';

/** The first row carries no divider: there is nothing above it to divide from. */
const FIRST = 0;

export interface TasteAnswerListProps {
  readonly rows: readonly AnswerSummaryRow[];
  /**
   * How a row is opened, or null while the list is only to be read.
   *
   * Null is the guarantee rather than a styling choice: `ListItem` with no
   * press handler is not a button to the operating system either, so a row
   * nobody may change is not announced as something to activate and cannot be
   * activated by a stray tap.
   */
  readonly onSelect: ((questionIndex: number | null) => void) | null;
}

/**
 * What somebody answered, in the order they were asked.
 *
 * One card rather than a stack of them, because this is one thing - a
 * questionnaire - rather than eleven separate facts, and eleven cards of equal
 * weight is a screen nobody scans. The question is the label and the answer is
 * the value, which is the shape every other "what did I set" list in the app
 * already has.
 */
export const TasteAnswerList = ({ rows, onSelect }: TasteAnswerListProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card>
      {rows.map((row: AnswerSummaryRow, position: number): JSX.Element => (
        <ListItem
          key={row.id}
          title={t(row.promptKey)}
          subtitle={row.answerKey === null ? t(TRANSLATION_KEYS.tqUnanswered) : t(row.answerKey)}
          showDivider={position > FIRST}
          onPress={
            onSelect === null
              ? undefined
              : (): void => {
                  onSelect(row.questionIndex);
                }
          }
        />
      ))}
    </Card>
  );
};
