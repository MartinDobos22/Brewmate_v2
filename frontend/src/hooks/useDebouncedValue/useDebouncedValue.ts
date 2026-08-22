import { useEffect, useState } from 'react';

/**
 * Follows a value, but only after it has stopped changing for `delayMs`.
 *
 * A search box changes on every keystroke and the catalogue lives on the
 * server; without this, typing "comandante" would be ten requests and nine
 * results nobody sees.
 */
export const useDebouncedValue = <TValue>(value: TValue, delayMs: number): TValue => {
  const [settled, setSettled] = useState(value);

  useEffect((): (() => void) => {
    const timeout = setTimeout((): void => {
      setSettled(value);
    }, delayMs);

    return (): void => {
      clearTimeout(timeout);
    };
  }, [value, delayMs]);

  return settled;
};
