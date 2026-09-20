import type {
  BrewConstraints,
  BrewMethod,
  CoffeeBag,
  Equipment,
  EquipmentSet,
  Recipe,
  WaterType,
} from '@brewmate/shared';

import type { BrewAmountWarning } from '../services/checkBrewAmounts';

import type { BrewAmountsControl } from './useBrewAmounts';

export interface BrewSetup extends BrewAmountsControl {
  readonly sets: readonly EquipmentSet[];
  readonly activeSet: EquipmentSet | undefined;
  readonly methods: readonly BrewMethod[];
  /** What the cupboard owns, narrowed to the set. Never what may be offered. */
  readonly brewers: readonly Equipment[];
  readonly method: BrewMethod | undefined;
  readonly bag: CoffeeBag | null;
  /**
   * Whether the coffee question has been answered at all.
   *
   * Distinct from `bag === null`, which is itself an answer - the coffee is
   * not written down anywhere. Two different facts, and a screen that read one
   * as the other would put somebody who deliberately chose "nemám ju zapísanú"
   * back on the question they just answered.
   */
  readonly hasChosenCoffee: boolean;
  readonly coffeeDescription: string;
  /**
   * The grinder this is being ground on, where they said which.
   *
   * Null is the ordinary state and means nobody said - the card below then
   * reads the numbers off whichever grinder `chooseGrinderEquipment` picks,
   * and the API falls back to the same one through the same function.
   */
  readonly grinderEquipmentId: string | null;
  readonly constraints: BrewConstraints;
  readonly waterType: WaterType;
  readonly warnings: readonly BrewAmountWarning[];
  readonly isLoading: boolean;
  readonly isPending: boolean;
  readonly hasFailed: boolean;
  /**
   * What went wrong, where something did.
   *
   * Carried as well as the flag because "Recept sa nepodarilo napísať" is the
   * same sentence whether the model is unreachable, the allowance is spent,
   * the token expired or the request never left the kitchen - and those are
   * four different things to do next. The screen reads the code and the
   * request id off this rather than making somebody describe a red rectangle.
   */
  readonly error: unknown;
  readonly chooseSet: (setId: string) => void;
  readonly chooseMethod: (method: BrewMethod) => void;
  readonly chooseBag: (bag: CoffeeBag | null) => void;
  /** Back to the coffee question, keeping every other answer on this screen. */
  readonly changeCoffee: () => void;
  readonly describeCoffee: (description: string) => void;
  readonly chooseGrinder: (equipmentId: string) => void;
  readonly toggleConstraint: (name: keyof BrewConstraints, isSet: boolean) => void;
  readonly chooseWater: (waterType: WaterType) => void;
  readonly askForRecipe: (onWritten: (recipe: Recipe) => void) => void;
}
