import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';

import { CoffeeBagDetailScreen } from '../../features/inventory/components';

/** One coffee's own screen, reached from a card in the cupboard. */
export default function CoffeeBagRoute(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <CoffeeBagDetailScreen bagId={id} />;
}
