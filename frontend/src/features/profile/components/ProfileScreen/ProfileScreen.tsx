import type { JSX } from 'react';
import { View } from 'react-native';

import { Screen } from '../../../../components/layout';
import { SectionHeading } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { AccountCard, DeleteAccountCard } from '../../../auth';
import { AccountDataCard } from '../AccountDataCard';
import { AppearanceCard } from '../AppearanceCard';
import { DeveloperTile } from '../DeveloperTile';
import { ProfileToolTiles } from '../ProfileToolTiles';
import { TasteCorrectionCard } from '../TasteCorrectionCard';
import { TasteProfileSection } from '../TasteProfileSection';

import { createProfileScreenStyles } from './ProfileScreen.styles';
import { ProfileTasteHeader } from './ProfileTasteHeader';

/**
 * Everything the app believes about this person, and every way to change it.
 *
 * The header answers the first question - what do you know about me - and
 * answers it as a picture, because that is the one thing somebody opens this
 * screen for. What follows is what can be done about it: the same five axes in
 * words, the flavours, the two ways to disagree, and then the app and the
 * account.
 *
 * The kit left for a screen of its own behind the cog. What somebody brews
 * with is a different question from what they like, and answering both in one
 * column meant finding either by reading both.
 *
 * The export sits directly above the deletion. The two answer the same
 * question about what this account is, and somebody deciding whether to leave
 * is entitled to see what leaving takes with it.
 */
export const ProfileScreen = (): JSX.Element => {
  const styles = useThemedStyles(createProfileScreenStyles);
  const { t } = useTranslation();

  return (
    <Screen scrollable padded={false}>
      <ProfileTasteHeader />
      <View style={styles.content}>
        <TasteProfileSection />
        <TasteCorrectionCard />

        <SectionHeading
          title={t(TRANSLATION_KEYS.profileSectionAppTitle)}
          caption={t(TRANSLATION_KEYS.profileSectionAppCaption)}
        />
        <ProfileToolTiles />
        <AppearanceCard />
        <DeveloperTile />

        <SectionHeading
          title={t(TRANSLATION_KEYS.profileSectionAccountTitle)}
          caption={t(TRANSLATION_KEYS.profileSectionAccountCaption)}
        />
        <AccountCard />
        <AccountDataCard />
        <DeleteAccountCard />
      </View>
    </Screen>
  );
};
