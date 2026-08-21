import { useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type PanResponderInstance,
} from 'react-native';

import { fromRatio, type StepRange } from './clampToStep';

export interface SliderGesture {
  readonly panHandlers: PanResponderInstance['panHandlers'];
  readonly onLayout: (event: LayoutChangeEvent) => void;
  readonly trackWidth: number;
}

export interface SliderGestureOptions {
  readonly range: StepRange;
  readonly onChange: (value: number) => void;
  readonly disabled: boolean;
}

/**
 * Turns a touch anywhere on the track into a stepped value. Kept out of the
 * component so the component only renders.
 */
export const useSliderGesture = ({
  range,
  onChange,
  disabled,
}: SliderGestureOptions): SliderGesture => {
  const [trackWidth, setTrackWidth] = useState(0);
  const widthRef = useRef(0);
  const rangeRef = useRef(range);
  const changeRef = useRef(onChange);
  const disabledRef = useRef(disabled);

  rangeRef.current = range;
  changeRef.current = onChange;
  disabledRef.current = disabled;

  const handleTouch = (event: GestureResponderEvent): void => {
    const width = widthRef.current;

    if (width === 0 || disabledRef.current) {
      return;
    }

    const ratio = Math.min(1, Math.max(0, event.nativeEvent.locationX / width));
    changeRef.current(fromRatio(ratio, rangeRef.current));
  };

  const panResponder = useMemo(
    (): PanResponderInstance =>
      PanResponder.create({
        onStartShouldSetPanResponder: (): boolean => !disabledRef.current,
        onMoveShouldSetPanResponder: (): boolean => !disabledRef.current,
        onPanResponderGrant: (event: GestureResponderEvent): void => {
          handleTouch(event);
        },
        onPanResponderMove: (event: GestureResponderEvent): void => {
          handleTouch(event);
        },
      }),
    [],
  );

  return {
    panHandlers: panResponder.panHandlers,
    trackWidth,
    onLayout: (event: LayoutChangeEvent): void => {
      widthRef.current = event.nativeEvent.layout.width;
      setTrackWidth(event.nativeEvent.layout.width);
    },
  };
};
