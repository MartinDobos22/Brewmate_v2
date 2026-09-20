import type { CoffeeBag } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { SectionHeading } from '../../../../components/ui';
import { buildBagRoute, buildBrewRoute } from '../../../../constants/routes';
import { useTranslation } from '../../../../i18n';
import { BAG_GROUP_CAPTION_KEYS, BAG_GROUP_TITLE_KEYS } from '../../constants';
import { useArchiveCoffeeBag } from '../../hooks';
import { BAG_FRESHNESS, type BagGroup } from '../../services';
import { CoffeeBagCard } from '../CoffeeBagCard';

export interface CoffeeBagGroupProps {
  readonly group: BagGroup;
}

/**
 * One shelf of the cupboard: a heading saying what to do with these, and the
 * bags themselves.
 *
 * The heading is not the badge printed on the cards under it. A badge names
 * one bag's state, a heading names a shelf and says what it is for - and
 * reusing one for the other would produce headings reading as if the whole
 * group were a single bag.
 *
 * The bags in their window are lifted a step further off the page than the
 * rest. Depth is what this design separates cards with, so it is also what it
 * says "open this one" with - and that is a claim only the ready shelf gets to
 * make.
 */
export const CoffeeBagGroup = ({ group }: CoffeeBagGroupProps): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const archive = useArchiveCoffeeBag();

  return (
    <>
      <SectionHeading
        title={t(BAG_GROUP_TITLE_KEYS[group.freshness])}
        caption={t(BAG_GROUP_CAPTION_KEYS[group.freshness])}
      />
      {group.bags.map((bag: CoffeeBag): JSX.Element => (
        <CoffeeBagCard
          key={bag.id}
          bag={bag}
          emphasised={group.freshness === BAG_FRESHNESS.ideal}
          archiving={archive.isPending && archive.variables === bag.id}
          onOpen={(opened: CoffeeBag): void => {
            router.push(buildBagRoute(opened.id));
          }}
          onBrew={(brewed: CoffeeBag): void => {
            router.push(buildBrewRoute(brewed.id));
          }}
          onArchive={(archived: CoffeeBag): void => {
            archive.mutate(archived.id);
          }}
        />
      ))}
    </>
  );
};
