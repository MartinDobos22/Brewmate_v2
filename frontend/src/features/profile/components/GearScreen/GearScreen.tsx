import type { JSX } from 'react';
import { View } from 'react-native';

import { EspressoHeader, HEADER_SCREEN_EDGES, Screen } from '../../../../components/layout';
import { ScreenIntro } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { EquipmentSection } from '../EquipmentSection';
import { SetsSection } from '../SetsSection';
import { WaterSection } from '../WaterSection';

import { createGearScreenStyles } from './GearScreen.styles';

/**
 * What somebody brews with, on a screen of its own.
 *
 * It used to be three cards in the middle of the profile, between what the app
 * believes about a person's taste and what it is doing with their money -
 * which are three different questions, and answering them in one column meant
 * finding any of them by reading all of them.
 *
 * Reached from the cog above the profile, because that is where somebody looks
 * for settings about their kit rather than about themselves.
 */
export const GearScreen = (): JSX.Element => {
  const styles = useThemedStyles(createGearScreenStyles);
  const { t } = useTranslation();

  return (
    <Screen scrollable padded={false} edges={HEADER_SCREEN_EDGES}>
      <EspressoHeader>
        <ScreenIntro
          ground="espresso"
          title={t(TRANSLATION_KEYS.profileGearTitle)}
          lead={t(TRANSLATION_KEYS.profileSectionGearCaption)}
        />
      </EspressoHeader>
      <View style={styles.content}>
        <EquipmentSection />
        <WaterSection />
        <SetsSection />
      </View>
    </Screen>
  );
};
