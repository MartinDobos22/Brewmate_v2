import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { SectionHeading } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { AccountCard, DeleteAccountCard } from '../../../auth';
import { AccountDataCard } from '../AccountDataCard';
import { AppearanceCard } from '../AppearanceCard';
import { DeveloperTile } from '../DeveloperTile';
import { EquipmentSection } from '../EquipmentSection';
import { ProfileHeader } from '../ProfileHeader';
import { ProfileToolTiles } from '../ProfileToolTiles';
import { SetsSection } from '../SetsSection';
import { TasteCorrectionCard } from '../TasteCorrectionCard';
import { TasteProfileSection } from '../TasteProfileSection';
import { WaterSection } from '../WaterSection';

/**
 * Everything the app believes about this person, and every way to change it.
 *
 * Four questions, in the order somebody comes here to ask them: what do you
 * know about me, what have you got written down about my kit, what is the app
 * itself doing, and what is my account. Before they were labelled this was
 * eight cards of identical weight in one column, and finding any one of them
 * meant reading all eight titles.
 *
 * Each group is a heading and the cards under it - the heading has no surface
 * of its own, because a label that looks like the content it labels is not a
 * label. The two navigational destinations are tiles, the same ones the home
 * screen is built from: both are places to go rather than things to read.
 *
 * The export sits directly above the deletion. The two answer the same
 * question about what this account is, and somebody deciding whether to leave
 * is entitled to see what leaving takes with it.
 */
export const ProfileScreen = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Screen scrollable>
      <ProfileHeader />

      <SectionHeading
        title={t(TRANSLATION_KEYS.profileSectionTasteTitle)}
        caption={t(TRANSLATION_KEYS.profileSectionTasteCaption)}
      />
      <TasteProfileSection />
      <TasteCorrectionCard />

      <SectionHeading
        title={t(TRANSLATION_KEYS.profileSectionGearTitle)}
        caption={t(TRANSLATION_KEYS.profileSectionGearCaption)}
      />
      <EquipmentSection />
      <WaterSection />
      <SetsSection />

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
    </Screen>
  );
};
