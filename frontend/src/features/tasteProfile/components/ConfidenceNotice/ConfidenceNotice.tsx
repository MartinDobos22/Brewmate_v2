import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useTasteProfile } from '../../hooks';
import { resolveConfidenceNoticeKey } from '../../services';

import { createConfidenceNoticeStyles } from './ConfidenceNotice.styles';

/**
 * What the app admits about itself, next to whatever it just recommended.
 *
 * It reads the profile itself rather than taking one as a prop, so putting the
 * caveat next to a piece of advice is one line at the call site. Advice that
 * needs a disclaimer somebody has to remember to add is advice that will
 * eventually be shown without one.
 *
 * Renders nothing while the profile is loading: a caveat that flashes in after
 * the recommendation is worse than one that was always there.
 */
export const ConfidenceNotice = (): JSX.Element | null => {
  const styles = useThemedStyles(createConfidenceNoticeStyles);
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();

  if (profile === undefined) {
    return null;
  }

  const noticeKey = resolveConfidenceNoticeKey(profile);

  if (noticeKey === null) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text variant="bodySmall" tone="muted">
        {t(noticeKey)}
      </Text>
    </View>
  );
};
