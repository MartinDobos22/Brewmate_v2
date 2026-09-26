import type { ConversionNote, ConversionReport } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, InfoNote, SectionHeading } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { CONVERSION_ICONS } from '../../constants';

import { ConversionNoteRow } from './ConversionNoteRow';
import { createConversionReportCardStyles } from './ConversionReportCard.styles';

export interface ConversionReportCardProps {
  readonly report: ConversionReport;
}

/**
 * What is exact, what is an estimate, and why.
 *
 * Open, with no disclosure button. It used to fold away on the argument that
 * in a kitchen the numbers are wanted first and the argument is what somebody
 * opens when they want to disagree - the same bargain the shop verdict used
 * to make, and gave up for the same reason. A report whose argument is behind
 * a tap is one nobody checks, and "every number says how much it is worth" is
 * the entire claim this feature makes. Behind a tap it is a claim nobody sees
 * the evidence for.
 *
 * The sentence about the grind stays at the top rather than taking its turn
 * in the list. It is the number that most looks like a measurement and least
 * is one: two grinders are comparable only through what they actually
 * produce, and burr alignment moves a real grind further than the difference
 * between two published curves.
 */
export const ConversionReportCard = ({ report }: ConversionReportCardProps): JSX.Element => {
  const styles = useThemedStyles(createConversionReportCardStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <SectionHeading
        title={t(TRANSLATION_KEYS.conversionReportTitle)}
        icon={CONVERSION_ICONS.report}
        placement="card"
      />
      <InfoNote
        tone="caution"
        icon={CONVERSION_ICONS.grind}
        text={t(TRANSLATION_KEYS.conversionGrindStartingPoint)}
      />
      <View style={styles.notes}>
        {report.notes.map((note: ConversionNote): JSX.Element => (
          <ConversionNoteRow key={`${note.field}-${note.reason}`} note={note} />
        ))}
      </View>
    </Card>
  );
};
