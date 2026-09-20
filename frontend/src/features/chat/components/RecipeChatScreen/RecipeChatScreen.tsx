import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BottomNavBar,
  HEADER_SCREEN_EDGES,
  useShowsBottomNav,
} from '../../../../components/layout';
import { QueryState } from '../../../../components/ui';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../../constants';
import { useThemedStyles } from '../../../../theme';
import { BREW_MODE_PARAMS, readRouteParam } from '../../../brewing/components/BrewModeScreen';
import { useRecipe } from '../../../brewing/hooks';
import { useRecipeConversation } from '../../hooks';

import { RecipeChatBody } from './RecipeChatBody';
import { RECIPE_CHAT_PARAMS } from './recipeChatParams';
import { createRecipeChatScreenStyles } from './RecipeChatScreen.styles';

/**
 * The conversation about one recipe.
 *
 * Reached after a brew, and reachable from any recipe at any time - the second
 * is not an afterthought. Somebody who drank a cup an hour ago and only now
 * worked out what was wrong with it should be able to say so, and a chat that
 * only existed in the sixty seconds after a brew would miss most of what
 * people actually notice.
 *
 * The screen carries no title of its own. The header block says which brewer
 * and which numbers are being argued about, which is what somebody arriving
 * here needs; "Ako to dopadlo?" is the question the first bubble already asks,
 * and asking it twice in two type sizes is a screen that did not notice.
 *
 * It composes the screen itself rather than going through `Screen`, because
 * both ends are fixed: the header reaches the notch and the composer sits on
 * the bottom edge with the thread scrolling between them. The shared
 * navigation bar is still drawn, under the composer and by the same rule as
 * everywhere else - this is a screen pushed on top of the tabs, and a way out
 * of it is not optional just because it also has a box to type in.
 */
export const RecipeChatScreen = (): JSX.Element => {
  const styles = useThemedStyles(createRecipeChatScreenStyles);
  const showsBottomNav = useShowsBottomNav();
  const params = useLocalSearchParams();
  const recipeId = readRouteParam(params[BREW_MODE_PARAMS.recipeId]);
  const brewLogId = readRouteParam(params[RECIPE_CHAT_PARAMS.brewLogId]);
  const recipe = useRecipe(recipeId);
  const conversation = useRecipeConversation(recipe.data, brewLogId);

  return (
    <SafeAreaView style={styles.root} edges={HEADER_SCREEN_EDGES}>
      <KeyboardAvoidingView style={styles.root} behavior={KEYBOARD_AVOIDING_BEHAVIOR}>
        {recipe.data === undefined ? (
          <View style={styles.state}>
            <QueryState
              isPending={recipe.isPending}
              isError={recipe.isError}
              error={recipe.error}
              onRetry={(): void => {
                void recipe.refetch();
              }}
            />
          </View>
        ) : (
          <RecipeChatBody recipe={recipe.data} conversation={conversation} />
        )}
      </KeyboardAvoidingView>
      {showsBottomNav ? <BottomNavBar /> : null}
    </SafeAreaView>
  );
};
