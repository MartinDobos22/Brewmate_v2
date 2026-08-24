import {
  EMPTY_SOURCE_RECIPE,
  WATER_TYPES,
  type BrewConstraints,
  type BrewMethod,
  type Recipe,
  type SourceRecipe,
} from '@brewmate/shared';
import { useState } from 'react';

import { useCurrentUser } from '../../auth';
import { useAvailableBrewMethods, useEquipmentSetSwitcher } from '../../inventory/hooks';
import { IMPORT_STAGES, type ImportStage } from '../constants';
import { toSourceRecipe, toSourceRecipeForm, type SourceRecipeFormValues } from '../services';

import { useConvertRecipe } from './useConvertRecipe';
import { useImportSource, type ImportSource } from './useImportSource';

const NO_CONSTRAINTS: BrewConstraints = {};

export interface RecipeImport {
  readonly stage: ImportStage;
  readonly source: ImportSource;
  readonly parsed: SourceRecipe;
  readonly form: SourceRecipeFormValues;
  readonly methods: readonly BrewMethod[];
  readonly method: BrewMethod | undefined;
  readonly constraints: BrewConstraints;
  readonly recipe: Recipe | null;
  readonly isConverting: boolean;
  readonly convertFailed: boolean;
  readonly edit: (patch: Partial<SourceRecipeFormValues>) => void;
  readonly startManually: () => void;
  readonly toReview: (source: SourceRecipe, form: SourceRecipeFormValues) => void;
  readonly toTarget: () => void;
  readonly chooseMethod: (method: BrewMethod) => void;
  readonly toggleConstraint: (name: keyof BrewConstraints, isSet: boolean) => void;
  readonly convert: () => void;
  readonly back: () => void;
}

/**
 * Bringing somebody else's recipe in, one answerable question at a time.
 *
 * The stages are the order a person can actually answer in: what the recipe
 * says, whether that is really what it says, and what they are going to brew
 * it in. The middle one is not a formality - a conversion multiplies its
 * inputs into each other, so a dose misread by a factor of ten comes out the
 * other end as a grind setting with nothing pointing at where it went wrong.
 */
export const useRecipeImport = (): RecipeImport => {
  const { data: user } = useCurrentUser();
  const switcher = useEquipmentSetSwitcher();
  const available = useAvailableBrewMethods(switcher.defaultSet);
  const source = useImportSource();
  const convertRecipe = useConvertRecipe();

  const [stage, setStage] = useState<ImportStage>(IMPORT_STAGES.source);
  const [parsed, setParsed] = useState<SourceRecipe>(EMPTY_SOURCE_RECIPE);
  const [form, setForm] = useState<SourceRecipeFormValues>(toSourceRecipeForm(EMPTY_SOURCE_RECIPE));
  const [method, setMethod] = useState<BrewMethod | undefined>(undefined);
  const [constraints, setConstraints] = useState<BrewConstraints>(NO_CONSTRAINTS);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  return {
    stage,
    source,
    parsed,
    form,
    method,
    constraints,
    recipe,
    methods: available.methods,
    isConverting: convertRecipe.isPending,
    convertFailed: convertRecipe.isError,

    edit: (patch: Partial<SourceRecipeFormValues>): void => {
      setForm({ ...form, ...patch });
    },

    startManually: (): void => {
      setParsed(EMPTY_SOURCE_RECIPE);
      setForm(toSourceRecipeForm(EMPTY_SOURCE_RECIPE));
      setStage(IMPORT_STAGES.review);
    },

    toReview: (read: SourceRecipe, values: SourceRecipeFormValues): void => {
      setParsed(read);
      setForm(values);
      setStage(IMPORT_STAGES.review);
    },

    toTarget: (): void => {
      setStage(IMPORT_STAGES.target);
    },

    chooseMethod: setMethod,

    toggleConstraint: (name: keyof BrewConstraints, isSet: boolean): void => {
      setConstraints({ ...constraints, [name]: isSet });
    },

    convert: (): void => {
      if (method === undefined) {
        return;
      }

      convertRecipe.mutate(
        {
          source: toSourceRecipe(form, parsed),
          methodId: method.id,
          equipmentSetId: switcher.defaultSet?.id ?? null,
          constraints,
          waterType: user?.waterType ?? WATER_TYPES.unknown,
        },
        {
          onSuccess: ({ recipe: written }): void => {
            setRecipe(written);
            setStage(IMPORT_STAGES.result);
          },
        },
      );
    },

    back: (): void => {
      setStage(stage === IMPORT_STAGES.target ? IMPORT_STAGES.review : IMPORT_STAGES.source);
    },
  };
};
