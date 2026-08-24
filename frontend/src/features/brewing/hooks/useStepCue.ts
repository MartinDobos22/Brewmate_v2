import * as Haptics from 'expo-haptics';
import { useAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

import stepCueSound from '../../../../assets/audio/step-cue.wav';

const START_OF_SOUND = 0;

export interface StepCue {
  /** A step has ended and the next one starts now. */
  readonly announce: () => void;
  /** The current step is about to end. */
  readonly warn: () => void;
  /** The brew is over. */
  readonly finish: () => void;
}

/**
 * Telling somebody the step has changed without them looking at the screen.
 *
 * Both channels, always, because neither is reliable on its own here. A phone
 * propped against a kettle transmits nothing to a hand holding a pouring
 * kettle, and a kitchen with an extractor fan running swallows a sound. The
 * cost of doubling up is a buzz somebody hears twice; the cost of missing it
 * is water in the wrong place.
 *
 * The warning is a light tap rather than the full cue. Something is about to
 * happen and something is happening are different messages, and a phone that
 * makes the same noise for both is one that gets ignored for both.
 */
export const useStepCue = (): StepCue => {
  const player: AudioPlayer = useAudioPlayer(stepCueSound);

  const play = useCallback((): void => {
    void player.seekTo(START_OF_SOUND);
    player.play();
  }, [player]);

  return {
    announce: (): void => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      play();
    },

    warn: (): void => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },

    finish: (): void => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      play();
    },
  };
};
