import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

const REDUCE_MOTION_EVENT = 'reduceMotionChanged';

/**
 * Whether the system asks for reduced motion. Every animation in the app reads
 * this and collapses to `DURATION.instant` when it is true.
 */
export const useReducedMotion = (): boolean => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect((): (() => void) => {
    let active = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((enabled: boolean): void => {
      if (active) {
        setReduceMotion(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      REDUCE_MOTION_EVENT,
      (enabled: boolean): void => {
        setReduceMotion(enabled);
      },
    );

    return (): void => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
};
