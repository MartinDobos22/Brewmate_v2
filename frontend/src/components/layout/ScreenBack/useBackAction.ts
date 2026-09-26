import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { BackHandler } from 'react-native';

import type { BackAction } from './backAction';

const HARDWARE_BACK_EVENT = 'hardwareBackPress';

/**
 * Where "späť" leads from this screen, or null where it leads nowhere.
 *
 * Two answers, in this order. A screen worked through a stage at a time - the
 * scanner, the question before a brew, somebody else's recipe - goes back a
 * stage first: from inside the flow, the camera somebody just left *is* the
 * previous screen, and sending them out of the whole flow instead would throw
 * away what they had answered. Everything else asks the navigator, which is
 * the screen underneath on a stack and the home tab from any other tab.
 *
 * A stage is honoured by the phone's own back button as well, while the screen
 * is in front. The button on the screen and the one on the phone saying two
 * different things about the same word is how somebody learns to trust
 * neither.
 */
export const useBackAction = (stageBack?: BackAction): BackAction | null => {
  const navigation = useNavigation();
  const router = useRouter();
  const latestStageBack = useRef(stageBack);
  const hasStage = stageBack !== undefined;

  latestStageBack.current = stageBack;

  useFocusEffect(
    useCallback((): (() => void) | undefined => {
      if (!hasStage) {
        return undefined;
      }

      const subscription = BackHandler.addEventListener(HARDWARE_BACK_EVENT, (): boolean => {
        latestStageBack.current?.();

        return true;
      });

      return (): void => {
        subscription.remove();
      };
    }, [hasStage]),
  );

  if (stageBack !== undefined) {
    return stageBack;
  }

  return navigation.canGoBack()
    ? (): void => {
        router.back();
      }
    : null;
};
