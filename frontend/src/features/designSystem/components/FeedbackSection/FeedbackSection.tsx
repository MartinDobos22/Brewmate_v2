import type { JSX } from 'react';
import { View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { DS_EMPTY_STATE_ICON, DS_STATE_GROUND } from '../../constants';
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
          icon={DS_EMPTY_STATE_ICON}
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
      <View style={styles.espressoBox}>
        <LoadingState label={t(TRANSLATION_KEYS.stateLoading)} ground={DS_STATE_GROUND} />
      </View>
      <View style={styles.espressoBox}>
        <ErrorState
          title={t(TRANSLATION_KEYS.dsErrorStateTitle)}
          description={t(TRANSLATION_KEYS.stateErrorBody)}
          retryLabel={t(TRANSLATION_KEYS.actionRetry)}
          onRetry={noop}
          ground={DS_STATE_GROUND}
        />
      </View>
    </SectionBlock>
  );
};
