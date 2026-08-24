import { CONVERSION_PRECISIONS, type ConversionNote } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TextTone } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import {
  CONVERSION_FIELD_KEYS,
  CONVERSION_PRECISION_KEYS,
  CONVERSION_REASON_KEYS,
} from '../../services';

import { createConversionReportCardStyles } from './ConversionReportCard.styles';

export interface ConversionNoteRowProps {
  readonly note: ConversionNote;
}

/**
 * How much one number is worth, said in three words and a sentence.
 *
 * The tone carries the same information as the word, because a list where
 * everything is grey is a list nobody reads twice: what came across exactly is
 * quiet, what was estimated is marked, and what nobody knew is marked hardest.
 */
const PRECISION_TONES: Record<ConversionNote['precision'], TextTone> = {
  [CONVERSION_PRECISIONS.exact]: 'secondary',
  [CONVERSION_PRECISIONS.estimated]: 'tertiary',
  [CONVERSION_PRECISIONS.unknown]: 'tertiary',
};

export const ConversionNoteRow = ({ note }: ConversionNoteRowProps): JSX.Element => {
  const styles = useThemedStyles(createConversionReportCardStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.note}>
      <Text variant="labelMedium" tone={PRECISION_TONES[note.precision]}>
        {t(TRANSLATION_KEYS.conversionNoteHeading, {
          field: t(CONVERSION_FIELD_KEYS[note.field]),
          precision: t(CONVERSION_PRECISION_KEYS[note.precision]),
        })}
      </Text>
      <Text variant="bodySmall" tone="muted">
        {t(CONVERSION_REASON_KEYS[note.reason])}
      </Text>
    </View>
  );
};
