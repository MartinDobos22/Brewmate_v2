import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDateTime } from '../../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../../theme';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import { resolveConfidenceNoticeKey } from '../../../tasteProfile/services';
import { PROVENANCE_ICONS } from '../../constants';
import type { BagVerdictView } from '../../services/bagVerdictView';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';

export interface VerdictProvenanceProps {
  readonly verdict: BagVerdictView;
}

/**
 * Who wrote this, when, and how much it knew about the person it was written
 * for.
 *
 * A verdict given on an earlier afternoon says which one - the card always
 * claimed the repeat without ever saying when "vtedy" was, which makes the
 * sentence unverifiable by the one person who could check it. A verdict the
 * phone wrote by itself says so plainly: this screen exists to be used inside
 * a building on one bar, and advice from four arithmetic rules is worth having
 * as long as nobody is told a model considered it.
 *
 * The confidence caveat lives here rather than under the card because on this
 * screen it is the same kind of statement as the other two: something about
 * how much the advice above is worth. Below `medium` there is no caveat at
 * all - one that never goes away is read as boilerplate, and then the honest
 * ones stop being read too.
 */
export const VerdictProvenance = ({ verdict }: VerdictProvenanceProps): JSX.Element | null => {
  const styles = useThemedStyles(createBagVerdictCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();
  const confidenceKey = profile === undefined ? null : resolveConfidenceNoticeKey(profile);

  if (!verdict.isFromHistory && !verdict.isLocal && confidenceKey === null) {
    return null;
  }

  return (
    <View style={styles.provenance}>
      {verdict.isFromHistory ? (
        <View style={styles.line}>
          <MaterialCommunityIcons
            name={PROVENANCE_ICONS.history}
            size={theme.size.iconSmall}
            color={theme.colors.onEspressoVariant}
          />
          <Text variant="captionSmall" tone="onEspressoMuted">
            {verdict.writtenAt === null
              ? t(TRANSLATION_KEYS.scanVerdictFromHistory)
              : t(TRANSLATION_KEYS.scanVerdictFromHistoryOn, {
                  date: formatDateTime(verdict.writtenAt),
                })}
          </Text>
        </View>
      ) : null}
      {confidenceKey === null ? null : (
        <View style={styles.line}>
          <MaterialCommunityIcons
            name={PROVENANCE_ICONS.confidence}
            size={theme.size.iconSmall}
            color={theme.colors.onEspressoVariant}
          />
          <Text variant="captionSmall" tone="onEspressoMuted">
            {t(confidenceKey)}
          </Text>
        </View>
      )}
      {verdict.isLocal ? (
        <View style={styles.line}>
          <MaterialCommunityIcons
            name={PROVENANCE_ICONS.offline}
            size={theme.size.iconSmall}
            color={theme.colors.onEspressoVariant}
          />
          <Text variant="captionSmall" tone="onEspressoMuted">
            {t(TRANSLATION_KEYS.scanVerdictLocalNotice)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
