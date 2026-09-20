import type { JSX } from 'react';
import { View } from 'react-native';

import { EspressoHeader } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useGettingStarted, useHomeSuggestion } from '../../hooks';
import { resolveGreetingKey } from '../../services';
import { HomeStartBlock } from '../HomeStartBlock';
import { HomeSuggestion } from '../HomeSuggestion';

import { createHomeHeaderStyles } from './HomeHeader.styles';

/**
 * The block at the top of the home screen, and the rule that it is never
 * empty.
 *
 * It holds exactly one thing under the greeting, and which one is decided by
 * what the account can actually offer. An account still working through its
 * first three steps gets those; one with coffee in the cupboard gets the
 * coffee to open this morning and the numbers to brew it by. An account that
 * has dismissed the steps and owns nothing gets the greeting alone - which is
 * short, and still not a dark block announcing that it has nothing to say,
 * because the two round doors out of it live inside the recommendation and
 * the whole cupboard section below offers the same thing in words.
 *
 * The steps win over the recommendation where both could be drawn. Somebody
 * two steps into a checklist they have not dismissed is somebody the app has
 * not finished introducing itself to, and a recommendation built on one
 * questionnaire answer is worth less than the question that would fill the
 * other four axes in.
 */
export const HomeHeader = (): JSX.Element => {
  const styles = useThemedStyles(createHomeHeaderStyles);
  const { t } = useTranslation();
  const gettingStarted = useGettingStarted();
  const suggestion = useHomeSuggestion();

  return (
    <EspressoHeader>
      <View style={styles.greeting}>
        <Text variant="displayTitle" tone="onEspresso">
          {t(resolveGreetingKey())}
        </Text>
        <Text variant="bodyMuted" tone="onEspressoMuted">
          {t(TRANSLATION_KEYS.homeGreetingSubtitle)}
        </Text>
      </View>
      {gettingStarted.isVisible ? (
        <HomeStartBlock gettingStarted={gettingStarted} />
      ) : (
        <HomeSuggestion suggestion={suggestion} />
      )}
    </EspressoHeader>
  );
};
