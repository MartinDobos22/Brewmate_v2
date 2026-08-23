/** "2 / 3" - the count beside the progress bar, built where numbers are formatted. */
export const formatStepCount = (completed: number, total: number, separator: string): string =>
  `${String(completed)}${separator}${String(total)}`;
