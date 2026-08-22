import { TASTE_PROFILE_SOURCES, type TasteAxes, type TasteProfile } from '@brewmate/shared';
import { useState } from 'react';

import { useAddTasteProfileEvent } from '../../tasteProfile/hooks';
import type { TasteAxisName } from '../../tasteProfile/constants';
import { buildManualSourceRef } from '../services/buildManualSourceRef';

const FULL_WEIGHT = 1;
const NO_AFFINITY_CHANGE = {};

export interface TasteTuning {
  readonly axes: TasteAxes;
  readonly setAxis: (axis: TasteAxisName, value: number) => void;
  readonly save: (onSaved: () => void) => void;
  readonly isPending: boolean;
  readonly hasFailed: boolean;
}

const readAxes = (profile: TasteProfile): TasteAxes => ({
  acidity: profile.acidity,
  sweetness: profile.sweetness,
  body: profile.body,
  bitterness: profile.bitterness,
  intensity: profile.intensity,
});

/**
 * The user overruling Brewmate.
 *
 * Sent at full weight and from the most trusted source there is, so what they
 * leave on the sliders is what the profile says afterwards. Anything less
 * would be an app arguing with somebody about their own taste.
 */
export const useTasteTuning = (profile: TasteProfile): TasteTuning => {
  const [axes, setAxes] = useState<TasteAxes>((): TasteAxes => readAxes(profile));
  const submit = useAddTasteProfileEvent();

  return {
    axes,
    isPending: submit.isPending,
    hasFailed: submit.isError,

    setAxis: (axis: TasteAxisName, value: number): void => {
      setAxes((current: TasteAxes): TasteAxes => ({ ...current, [axis]: value }));
    },

    save: (onSaved: () => void): void => {
      submit.mutate(
        {
          source: TASTE_PROFILE_SOURCES.manual,
          sourceRef: buildManualSourceRef(axes),
          payload: { axes, flavorAffinities: NO_AFFINITY_CHANGE, weight: FULL_WEIGHT },
        },
        { onSuccess: onSaved },
      );
    },
  };
};
