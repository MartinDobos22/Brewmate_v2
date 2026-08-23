import type { CoffeeBag } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { buildBagRoute } from '../../../../constants/routes';
import { useThemedStyles } from '../../../../theme';
import { useArchiveCoffeeBag } from '../../hooks';
import { CoffeeBagCard } from '../CoffeeBagCard';

import { createCoffeeBagListStyles } from './CoffeeBagList.styles';

export interface CoffeeBagListProps {
  readonly bags: readonly CoffeeBag[];
}

/** The cupboard, newest bag first, as the API returns it. */
export const CoffeeBagList = ({ bags }: CoffeeBagListProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagListStyles);
  const router = useRouter();
  const archive = useArchiveCoffeeBag();

  return (
    <View style={styles.list}>
      {bags.map((bag: CoffeeBag): JSX.Element => (
        <CoffeeBagCard
          key={bag.id}
          bag={bag}
          archiving={archive.isPending && archive.variables === bag.id}
          onOpen={(opened: CoffeeBag): void => {
            router.push(buildBagRoute(opened.id));
          }}
          onArchive={(archived: CoffeeBag): void => {
            archive.mutate(archived.id);
          }}
        />
      ))}
    </View>
  );
};
