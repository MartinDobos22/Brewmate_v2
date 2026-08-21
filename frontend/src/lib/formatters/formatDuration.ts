import { SECONDS_PER_MINUTE } from '../../constants/time';

const SECONDS_PAD_LENGTH = 2;
const PAD_CHARACTER = '0';
const TIME_SEPARATOR = ':';

/** A brew time as `m:ss`. Monospaced at the call site, so it never jitters. */
export const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = Math.floor(totalSeconds % SECONDS_PER_MINUTE);

  return `${String(minutes)}${TIME_SEPARATOR}${String(seconds).padStart(SECONDS_PAD_LENGTH, PAD_CHARACTER)}`;
};
