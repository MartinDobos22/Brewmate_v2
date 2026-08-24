import { useEffect, useState } from 'react';
import {
  WATER_TYPES,
  type BrewConstraints,
  type BrewMethod,
  type CoffeeBag,
  type EquipmentSet,
  type Recipe,
  type WaterType,
} from '@brewmate/shared';

import { useCurrentUser } from '../../auth';
import { useAvailableBrewMethods, useEquipmentSetSwitcher } from '../../inventory/hooks';
import { findBrewerForMethod } from '../../inventory/services';
import { checkBrewAmounts, type BrewAmountWarning } from '../services/checkBrewAmounts';
import { useBrewAmounts, type BrewAmountsControl } from './useBrewAmounts';
import { useGenerateRecipe } from './useGenerateRecipe';

const NO_CONSTRAINTS: BrewConstraints = {};

export interface BrewSetup extends BrewAmountsControl {
  readonly sets: readonly EquipmentSet[];
  readonly activeSet: EquipmentSet | undefined;
  readonly methods: readonly BrewMethod[];
  readonly method: BrewMethod | undefined;
  readonly bag: CoffeeBag | null;
  readonly coffeeDescription: string;
  readonly constraints: BrewConstraints;
  readonly waterType: WaterType;
  readonly warnings: readonly BrewAmountWarning[];
  readonly isLoading: boolean;
  readonly isPending: boolean;
  readonly hasFailed: boolean;
  readonly chooseSet: (setId: string) => void;
  readonly chooseMethod: (method: BrewMethod) => void;
  readonly chooseBag: (bag: CoffeeBag | null) => void;
  readonly describeCoffee: (description: string) => void;
  readonly toggleConstraint: (name: keyof BrewConstraints, isSet: boolean) => void;
  readonly chooseWater: (waterType: WaterType) => void;
  readonly askForRecipe: (onWritten: (recipe: Recipe) => void) => void;
}

/**
 * Everything the pre-brew screen decides, before a single token is spent.
 *
 * The order of the questions is the order somebody standing in a kitchen can
 * answer them: where they are, what they are brewing in, what they are
 * brewing, what is missing today, and how much of each. Nothing is asked twice
 * and nothing is asked that the app could read for itself.
 */
export const useBrewSetup = (): BrewSetup => {
  const { data: user } = useCurrentUser();
  const switcher = useEquipmentSetSwitcher();
  const [chosenSetId, setChosenSetId] = useState<string | null>(null);
  const activeSet =
    switcher.sets.find((set: EquipmentSet): boolean => set.id === chosenSetId) ??
    switcher.defaultSet;
  const available = useAvailableBrewMethods(activeSet);
  const [method, setMethod] = useState<BrewMethod | undefined>(undefined);
  const [bag, setBag] = useState<CoffeeBag | null>(null);
  const [coffeeDescription, setCoffeeDescription] = useState('');
  const [constraints, setConstraints] = useState<BrewConstraints>(NO_CONSTRAINTS);
  const [waterType, setWaterType] = useState<WaterType | null>(null);
  const generate = useGenerateRecipe();
  const brewer =
    method === undefined ? undefined : findBrewerForMethod(available.brewers, method.id);
  const amounts = useBrewAmounts(method, brewer);

  /**
   * The constraints follow the set, because that is what a set is for: the
   * cabin is where there is no scale, and saying so once should not have to be
   * said again every weekend. They stay editable afterwards - this is what is
   * usually true of the place, not what is true this morning.
   */
  const setId = activeSet?.id;

  useEffect((): void => {
    setConstraints(activeSet?.defaultConstraints ?? NO_CONSTRAINTS);
    // Only when the place changes; a tick the user just made must survive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setId]);

  return {
    ...amounts,
    sets: switcher.sets,
    activeSet,
    methods: available.methods,
    method,
    bag,
    coffeeDescription,
    constraints,
    waterType: waterType ?? user?.waterType ?? WATER_TYPES.unknown,
    warnings: checkBrewAmounts({ amounts: amounts.amounts, brewer, bag }),
    isLoading: switcher.isLoading || available.isLoading,
    isPending: generate.isPending,
    hasFailed: generate.isError,

    chooseSet: (nextId: string): void => {
      setChosenSetId(nextId);
      setMethod(undefined);
    },
    chooseMethod: setMethod,
    chooseBag: (next: CoffeeBag | null): void => {
      setBag(next);
    },
    describeCoffee: setCoffeeDescription,
    toggleConstraint: (name: keyof BrewConstraints, isSet: boolean): void => {
      setConstraints({ ...constraints, [name]: isSet });
    },
    chooseWater: setWaterType,

    askForRecipe: (onWritten: (recipe: Recipe) => void): void => {
      if (method === undefined) {
        return;
      }

      generate.mutate(
        {
          methodId: method.id,
          bagId: bag?.id ?? null,
          coffeeDescription: coffeeDescription === '' ? null : coffeeDescription,
          equipmentSetId: activeSet?.id ?? null,
          constraints,
          waterType: waterType ?? user?.waterType ?? WATER_TYPES.unknown,
          doseGrams: amounts.amounts.doseGrams,
          waterGrams: amounts.amounts.waterGrams,
          ratio: amounts.amounts.ratio,
        },
        {
          onSuccess: ({ recipe }): void => {
            onWritten(recipe);
          },
        },
      );
    },
  };
};
