import type { LabelPhotoIssue } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BAG_PHOTO_ISSUE_KEYS } from '../../constants';

import { createBagPhotoIssueNoticeStyles } from './BagPhotoIssueNotice.styles';

export interface BagPhotoIssueNoticeProps {
  readonly issues: readonly LabelPhotoIssue[];
}

/**
 * Why that photograph came back with nothing on it.
 *
 * The one place in the scan where the app says no, so it is written as the one
 * place it also says what to do instead. Each reason is an instruction the
 * person can carry out without moving from where they are standing, and the
 * line under them says the form is still there - because a refusal with no way
 * past it is a dead end, and this screen exists to be used in a shop.
 *
 * No error colour. Bad light in a shop is not a mistake somebody made, and a
 * red card in front of a shelf reads as the app being broken.
 */
export const BagPhotoIssueNotice = ({ issues }: BagPhotoIssueNoticeProps): JSX.Element => {
  const styles = useThemedStyles(createBagPhotoIssueNoticeStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleSmall">{t(TRANSLATION_KEYS.scanPhotoRefused)}</Text>
      <View style={styles.reasons}>
        {issues.map((issue: LabelPhotoIssue): JSX.Element => (
          <Text key={issue} variant="bodySmall">
            {t(BAG_PHOTO_ISSUE_KEYS[issue])}
          </Text>
        ))}
      </View>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.scanPhotoRefusedHint)}
      </Text>
    </Card>
  );
};
