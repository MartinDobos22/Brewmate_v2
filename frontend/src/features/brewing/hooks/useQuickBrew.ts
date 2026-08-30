import {
  EQUIPMENT_TYPES,
  WATER_TYPES,
  readKettleParams,
  type BrewMethod,
  type BrewParams,
  type Recipe,
} from '@brewmate/shared';
import { useState } from 'react';

import { useCurrentUser } from '../../auth';
import {
  useAvailableBrewMethods,
  useCreateCoffeeBag,
  useEquipmentToggle,
} from '../../inventory/hooks';
import {
  EMPTY_COFFEE_BAG_FORM,
  findBrewerForMethod,
  toCreateCoffeeBagRequest,
  type CoffeeBagFormValues,
} from '../../inventory/services';
import { QUICK_BREW_STAGES, type QuickBrewStage } from '../constants/quickBrew';
import { buildQuickBrewRecipe } from '../services/buildQuickBrewRecipe';
import { buildReferenceParams, type ReferenceRecipeInput } from '../services/buildReferenceRecipe';
import { useCreateRecipe } from './useCreateRecipe';

export interface QuickBrew {
  readonly stage: QuickBrewStage;
  readonly methods: readonly BrewMethod[];
  readonly method: BrewMethod | undefined;
  readonly coffee: CoffeeBagFormValues;
  readonly params: BrewParams | undefined;
  /**
   * The stored recipe, once there is one.
   *
   * Kept because everything downstream needs an id: brew mode logs against it
   * and the conversation afterwards hangs off it. The flow was writing a
   * recipe to the database and then throwing away the only handle on it, which
   * left the screen able to show a recipe but not to brew it.
   */
  readonly recipe: Recipe | undefined;
  readonly hasTemperatureControl: boolean;
  readonly hasScale: boolean;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: unknown;
  readonly isPending: boolean;
  readonly hasFailed: boolean;
  readonly retry: () => void;
  readonly selectMethod: (method: BrewMethod) => void;
  readonly describeCoffee: (patch: Partial<CoffeeBagFormValues>) => void;
  readonly askForRecipe: (rationale: string) => void;
  readonly keepCoffee: (fallbackName: string) => void;
  readonly back: () => void;
}

/**
 * A cup for beans that are not written down anywhere.
 *
 * The order is the whole design: the method first, because it is the only
 * thing Brewmate genuinely needs, then whatever the drinker happens to know
 * about the coffee, then the recipe. The middle step can be answered with
 * nothing at all - a person standing in their kitchen with a bag they bought
 * yesterday should not have to fill in a form to be told a dose.
 *
 * The recipe is stored without a bag, and the cupboard is offered afterwards
 * rather than demanded first.
 */
export const useQuickBrew = (): QuickBrew => {
  const { data: user } = useCurrentUser();
  const available = useAvailableBrewMethods();
  const kettle = useEquipmentToggle(EQUIPMENT_TYPES.kettle);
  const scale = useEquipmentToggle(EQUIPMENT_TYPES.scale);
  const createRecipe = useCreateRecipe();
  const createBag = useCreateCoffeeBag();
  const [stage, setStage] = useState<QuickBrewStage>(QUICK_BREW_STAGES.method);
  const [method, setMethod] = useState<BrewMethod | undefined>(undefined);
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [coffee, setCoffee] = useState<CoffeeBagFormValues>(EMPTY_COFFEE_BAG_FORM);

  const hasTemperatureControl =
    kettle.item !== undefined &&
    readKettleParams(kettle.item.params).hasTemperatureControl === true;

  const input: ReferenceRecipeInput | undefined =
    method === undefined
      ? undefined
      : {
          method,
          brewer: findBrewerForMethod(available.brewers, method.id),
          hasTemperatureControl,
          waterType: user?.waterType ?? WATER_TYPES.unknown,
          roastLevel: coffee.roastLevel,
        };

  return {
    stage,
    coffee,
    method,
    methods: available.methods,
    hasTemperatureControl,
    hasScale: scale.item !== undefined,
    params: input === undefined ? undefined : buildReferenceParams(input),
    recipe,
    isLoading: available.isLoading || kettle.isLoading || scale.isLoading,
    isError: available.isError,
    error: available.error,
    isPending: createRecipe.isPending || createBag.isPending,
    hasFailed: createRecipe.isError || createBag.isError,
    retry: available.refetch,

    selectMethod: (next: BrewMethod): void => {
      setMethod(next);
      setStage(QUICK_BREW_STAGES.coffee);
    },

    describeCoffee: (patch: Partial<CoffeeBagFormValues>): void => {
      setCoffee({ ...coffee, ...patch });
    },

    askForRecipe: (rationale: string): void => {
      if (input === undefined) {
        return;
      }

      createRecipe.mutate(buildQuickBrewRecipe(input, rationale), {
        onSuccess: (written: Recipe): void => {
          setRecipe(written);
          setStage(QUICK_BREW_STAGES.recipe);
        },
      });
    },

    keepCoffee: (fallbackName: string): void => {
      createBag.mutate(toCreateCoffeeBagRequest(coffee, fallbackName), {
        onSuccess: (): void => {
          setStage(QUICK_BREW_STAGES.saved);
        },
      });
    },

    back: (): void => {
      setStage(QUICK_BREW_STAGES.method);
    },
  };
};
