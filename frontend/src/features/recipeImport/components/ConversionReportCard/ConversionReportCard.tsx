import type { ConversionNote, ConversionReport } from '@brewmate/shared';
import { useState, type JSX } from 'react';
import { Pressable, View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { ConversionNoteRow } from './ConversionNoteRow';
import { createConversionReportCardStyles } from './ConversionReportCard.styles';

export interface ConversionReportCardProps {
  readonly report: ConversionReport;
}

/**
 * What is exact, what is an estimate, and why.
 *
 * The one sentence that always shows is the one about the grind, because it is
 * the number that most looks like a measurement and least is one: two grinders
 * are comparable only through what they actually produce, and burr alignment
 * moves a real grind further than the difference between two published curves.
 *
 * The rest folds away. In a kitchen the numbers are wanted first and the
 * argument is what somebody opens when they want to disagree with them - the
 * same bargain the shop verdict makes with its reasoning.
 */
export const ConversionReportCard = ({ report }: ConversionReportCardProps): JSX.Element => {
  const styles = useThemedStyles(createConversionReportCardStyles);
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={t(TRANSLATION_KEYS.conversionReportTitle)}
        onPress={(): void => {
          setOpen(!isOpen);
        }}
      >
        <View style={styles.header}>
          <Text variant="titleMedium">{t(TRANSLATION_KEYS.conversionReportTitle)}</Text>
          <Text variant="labelMedium" tone="secondary">
            {t(
              isOpen
                ? TRANSLATION_KEYS.conversionReportClose
                : TRANSLATION_KEYS.conversionReportOpen,
            )}
          </Text>
        </View>
      </Pressable>
      <Text variant="bodySmall" tone="tertiary">
        {t(TRANSLATION_KEYS.conversionGrindStartingPoint)}
      </Text>
      {isOpen ? (
        <View style={styles.notes}>
          {report.notes.map((note: ConversionNote): JSX.Element => (
            <ConversionNoteRow key={`${note.field}-${note.reason}`} note={note} />
          ))}
        </View>
      ) : null}
    </Card>
  );
};
