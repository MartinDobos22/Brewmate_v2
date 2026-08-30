import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDateTime } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import type { BagVerdictView } from '../../services/bagVerdictView';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';

export interface VerdictProvenanceProps {
  readonly verdict: BagVerdictView;
}

/**
 * Who wrote this, and when.
 *
 * A verdict given on an earlier afternoon says which one. The card always
 * claimed the repeat - "hovorím ti to isté, čo vtedy" - without ever saying
 * when "vtedy" was, which makes the sentence unverifiable by the one person
 * who could check it. `writtenAt` was already on the view and simply never
 * printed.
 *
 * A verdict the phone wrote by itself says so plainly. This screen exists to
 * be used inside a building on one bar, and advice from three arithmetic rules
 * is worth having as long as nobody is told a model considered it.
 */
export const VerdictProvenance = ({ verdict }: VerdictProvenanceProps): JSX.Element | null => {
  const styles = useThemedStyles(createBagVerdictCardStyles);
  const { t } = useTranslation();

  if (!verdict.isFromHistory && !verdict.isLocal) {
    return null;
  }

  return (
    <View style={styles.provenance}>
      {verdict.isFromHistory ? (
        <Text variant="bodySmall" tone="muted">
          {verdict.writtenAt === null
            ? t(TRANSLATION_KEYS.scanVerdictFromHistory)
            : t(TRANSLATION_KEYS.scanVerdictFromHistoryOn, {
                date: formatDateTime(verdict.writtenAt),
              })}
        </Text>
      ) : null}
      {verdict.isLocal ? (
        <Text variant="bodySmall" tone="tertiary">
          {t(TRANSLATION_KEYS.scanVerdictLocalNotice)}
        </Text>
      ) : null}
    </View>
  );
};
