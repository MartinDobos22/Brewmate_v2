import type { Recipe } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HEADER_SCREEN_EDGES } from '../../../../components/layout';
import { InfoNote } from '../../../../components/ui';
import { buildBrewModeRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { EquipmentSetSwitcher } from '../../../inventory/components';
import { useBrewSetup } from '../../hooks/useBrewSetup';
import { BrewCoffeeSourceScreen } from '../BrewCoffeeSourceScreen';
import { PreBrewFootBar } from '../PreBrewFootBar';
import { PreBrewHeader } from '../PreBrewHeader';

import { PreBrewExtras } from './PreBrewExtras';
import { PreBrewSections } from './PreBrewSections';
import { createPreBrewScreenStyles } from './PreBrewScreen.styles';

export interface PreBrewScreenProps {
  /** Set when somebody arrived from a coffee's own screen wanting to brew it. */
  readonly initialBagId?: string;
}

/**
 * Everything that gets decided before a single token is spent.
 *
 * The coffee leads, in the block at the top, because everything below it is
 * written around the answer - the dose window, whether the bag is even ready,
 * the roast the recipe assumes. Then what it is being brewed in, what is
 * missing today, what water, and how much of each.
 *
 * The plan and the button live in a bar against the bottom edge rather than at
 * the end of the scroll. A recipe is written once and followed for the next
 * four minutes, and being able to read the whole decision without going
 * looking for it is the difference between committing and guessing.
 *
 * With nothing in the cupboard the screen is the same screen. The missing
 * coffee is stated in the header and the calculator stays fully usable: the
 * recipe is never blocked on an inventory entry.
 */
export const PreBrewScreen = ({ initialBagId }: PreBrewScreenProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewScreenStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const setup = useBrewSetup(initialBagId);

  /*
   * The coffee comes first, and on its own screen.
   *
   * The answer can arrive from a camera as easily as from the cupboard, and
   * asked as the first of six cards it was scrolled past. Asked here it is the
   * only thing on the screen.
   */
  if (!setup.hasChosenCoffee) {
    return <BrewCoffeeSourceScreen onChoose={setup.chooseBag} />;
  }

  return (
    <SafeAreaView style={styles.root} edges={HEADER_SCREEN_EDGES}>
      <ScrollView style={styles.scroll}>
        <PreBrewHeader
          bag={setup.bag}
          description={setup.coffeeDescription}
          hasCupboard={setup.bag !== null}
          onChange={setup.changeCoffee}
        />
        <View style={styles.content}>
          {setup.bag === null ? (
            <InfoNote tone="fresh" text={t(TRANSLATION_KEYS.preBrewNoCoffeeNote)} />
          ) : null}
          <EquipmentSetSwitcher />
          <PreBrewSections setup={setup} />
          <PreBrewExtras setup={setup} />
        </View>
      </ScrollView>
      <PreBrewFootBar
        setup={setup}
        onWritten={(recipe: Recipe): void => {
          router.replace(buildBrewModeRoute(recipe.id, setup.activeSet?.id));
        }}
      />
    </SafeAreaView>
  );
};
