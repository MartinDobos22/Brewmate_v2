import type { BrewMethod } from '@brewmate/shared';
import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { HEADER_SCREEN_EDGES, Screen, TAB_SCREEN_EDGES } from '../../../../components/layout';
import { QueryState } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';
import { BREW_MODE_PARAMS, readRouteParam } from '../../../brewing/components/BrewModeScreen';
import { RecipeChatHeader } from '../../../chat/components';
import { useBrewMethods } from '../../../brewing/hooks';
import { useDialInSession } from '../../hooks';

import { DialInBody } from './DialInBody';
import { createDialInScreenStyles } from './DialInScreen.styles';

/**
 * A new coffee on a lever machine, dialled in over as few shots as possible.
 *
 * A separate mode rather than the general chat, because the shape of the
 * conversation is different: the question is always the same three numbers and
 * a taste, and the answer is always exactly one change. Everything on this
 * screen is a narrowing of the recipe chat towards converging quickly, because
 * every attempt costs a dose out of a bag somebody has just paid for.
 *
 * It is led by the conversation's own header rather than by a title and a
 * card underneath it. This *is* that conversation - the header already says
 * which machine, which version and what the three numbers currently are, and
 * the dial-in printed the same three in a card below a title repeating the
 * screen's name. Two screens holding one conversation should not be two
 * objects to recognise.
 *
 * Until the recipe has arrived there is no header, so the screen claims the
 * top inset and the way back is drawn above the waiting state instead of
 * inside a block that is not there yet.
 */
export const DialInScreen = (): JSX.Element => {
  const styles = useThemedStyles(createDialInScreenStyles);
  const params = useLocalSearchParams();
  const session = useDialInSession(readRouteParam(params[BREW_MODE_PARAMS.recipeId]));
  const methods = useBrewMethods();
  const method = methods.data?.items.find(
    (item: BrewMethod): boolean => item.id === session.recipe?.methodId,
  );

  return (
    <Screen
      scrollable
      padded={false}
      edges={session.recipe === undefined ? TAB_SCREEN_EDGES : HEADER_SCREEN_EDGES}
    >
      {session.recipe === undefined ? null : <RecipeChatHeader recipe={session.recipe} />}
      {session.isLoading || session.isError ? (
        <View style={styles.state}>
          <QueryState
            isPending={session.isLoading}
            isError={session.isError}
            error={session.error}
            onRetry={session.retry}
          />
        </View>
      ) : null}
      <DialInBody session={session} method={method} />
    </Screen>
  );
};
