import type { JSX } from 'react';
import { View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { SectionBlock } from '../SectionBlock';

import { createFeedbackSectionStyles } from './FeedbackSection.styles';

const noop = (): void => undefined;

export const FeedbackSection = (): JSX.Element => {
  const styles = useThemedStyles(createFeedbackSectionStyles);
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionFeedback)}>
      <View style={styles.box}>
        <EmptyState
          title={t(TRANSLATION_KEYS.dsEmptyStateTitle)}
          description={t(TRANSLATION_KEYS.stateEmptyBody)}
        />
      </View>
      <View style={styles.box}>
        <LoadingState label={t(TRANSLATION_KEYS.stateLoading)} />
      </View>
      <View style={styles.box}>
        <ErrorState
          title={t(TRANSLATION_KEYS.dsErrorStateTitle)}
          description={t(TRANSLATION_KEYS.stateErrorBody)}
          retryLabel={t(TRANSLATION_KEYS.actionRetry)}
          onRetry={noop}
        />
      </View>
    </SectionBlock>
  );
};
