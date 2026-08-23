import {
  CHAT_ROLES,
  EQUIPMENT_TYPES,
  TASTE_PROFILE_SOURCES,
  WATER_TYPES,
  readKettleParams,
  type BrewMethod,
  type BrewParams,
  type Recipe,
  type RecipeChatMessage,
} from '@brewmate/shared';
import { useState } from 'react';

import { useCurrentUser } from '../../auth';
import { useCreateRecipe } from '../../brewing/hooks';
import { useSendRecipeMessage } from '../../chat/hooks';
import { useAvailableBrewMethods, useEquipmentToggle } from '../../inventory/hooks';
import { useAddTasteProfileEvent } from '../../tasteProfile/hooks';
import { CALIBRATION_STAGES, type CalibrationStage } from '../constants/calibrationRecipe';
import { buildCalibrationParams, buildCalibrationRecipe } from '../services/buildCalibrationRecipe';
import { pickCalibrationMethod } from '../services/pickCalibrationMethod';
import { readCalibrationDescription } from '../services/readCalibrationDescription';
import type { CalibrationReading } from '../services/calibrationLexiconTypes';
import { findBrewerForMethod } from '../../inventory/services';

const NOTHING = 0;
const NO_READINGS: readonly CalibrationReading[] = [];

export interface CalibrationBrew {
  readonly stage: CalibrationStage;
  readonly method: BrewMethod | undefined;
  readonly params: BrewParams | undefined;
  readonly hasTemperatureControl: boolean;
  readonly hasScale: boolean;
  readonly isLoading: boolean;
  readonly isPending: boolean;
  readonly hasFailed: boolean;
  /** True once a description came back with nothing the lexicon recognised. */
  readonly notUnderstood: boolean;
  readonly readings: readonly CalibrationReading[];
  readonly start: (rationale: string) => void;
  readonly describe: (description: string) => void;
}

/**
 * One reference cup, brewed and then described.
 *
 * The description is stored as a message on the recipe, and the event that
 * teaches the profile points at that message - so what the app concluded can
 * always be traced back to the sentence somebody actually wrote, and
 * re-sending the same description counts once.
 */
export const useCalibrationBrew = (): CalibrationBrew => {
  const { data: user } = useCurrentUser();
  const available = useAvailableBrewMethods();
  const kettle = useEquipmentToggle(EQUIPMENT_TYPES.kettle);
  const scale = useEquipmentToggle(EQUIPMENT_TYPES.scale);
  const createRecipe = useCreateRecipe();
  const sendMessage = useSendRecipeMessage();
  const addEvent = useAddTasteProfileEvent();
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [stage, setStage] = useState<CalibrationStage>(CALIBRATION_STAGES.proposal);
  const [readings, setReadings] = useState<readonly CalibrationReading[]>(NO_READINGS);
  const [notUnderstood, setNotUnderstood] = useState(false);

  const method = pickCalibrationMethod(available.methods);
  const hasTemperatureControl =
    kettle.item !== undefined &&
    readKettleParams(kettle.item.params).hasTemperatureControl === true;
  const input =
    method === undefined
      ? undefined
      : {
          method,
          brewer: findBrewerForMethod(available.brewers, method.id),
          hasTemperatureControl,
          waterType: user?.waterType ?? WATER_TYPES.unknown,
        };

  const save = (description: string, message: RecipeChatMessage): void => {
    addEvent.mutate(
      {
        source: TASTE_PROFILE_SOURCES.calibrationBrew,
        sourceRef: message.id,
        payload: readCalibrationDescription(description).payload,
      },
      {
        onSuccess: (): void => {
          setStage(CALIBRATION_STAGES.saved);
        },
      },
    );
  };

  return {
    stage,
    method,
    readings,
    notUnderstood,
    hasTemperatureControl,
    hasScale: scale.item !== undefined,
    params: input === undefined ? undefined : buildCalibrationParams(input),
    isLoading: available.isLoading || kettle.isLoading || scale.isLoading,
    isPending: createRecipe.isPending || sendMessage.isPending || addEvent.isPending,
    hasFailed: createRecipe.isError || sendMessage.isError || addEvent.isError,

    start: (rationale: string): void => {
      if (input === undefined) {
        return;
      }

      createRecipe.mutate(buildCalibrationRecipe(input, rationale), {
        onSuccess: (recipe: Recipe): void => {
          setRecipeId(recipe.id);
          setStage(CALIBRATION_STAGES.describe);
        },
      });
    },

    describe: (description: string): void => {
      const understanding = readCalibrationDescription(description);

      setReadings(understanding.readings);
      setNotUnderstood(understanding.readings.length === NOTHING);

      if (understanding.readings.length === NOTHING || recipeId === null) {
        return;
      }

      sendMessage.mutate(
        {
          recipeId,
          message: { role: CHAT_ROLES.user, content: description.trim() },
        },
        {
          onSuccess: (message: RecipeChatMessage): void => {
            save(description, message);
          },
        },
      );
    },
  };
};
