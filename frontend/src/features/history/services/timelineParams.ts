const FIRST = 0;

/**
 * The first value, whichever way the router hands it over.
 *
 * expo-router gives a repeated query parameter as an array, and there is no
 * sensible reading of two method ids: the screen is about one pair, so the
 * first one wins rather than the last, and a malformed link produces one
 * screen rather than an unhandled shape.
 */
const readOne = (value: string | readonly string[] | undefined): string | undefined =>
  typeof value === 'string' ? value : value?.[FIRST];

export interface TimelineParams {
  readonly methodId: string | undefined;
  /** Undefined is the quick-brew line, not "any bag". */
  readonly bagId: string | undefined;
}

/**
 * The pair this screen is about, taken out of the route.
 *
 * In the route rather than remembered, for the same reason brew mode's recipe
 * is: a history is opened, scrolled, left and come back to, and a screen that
 * lost its subject when the app was backgrounded would come back showing
 * somebody else's coffee.
 */
export const readTimelineParams = (
  params: Readonly<Record<string, string | readonly string[] | undefined>>,
): TimelineParams => ({
  methodId: readOne(params.methodId),
  bagId: readOne(params.bagId),
});
