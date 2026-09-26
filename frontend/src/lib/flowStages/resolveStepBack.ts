/**
 * The step back from one stage of a flow, or undefined where there is none.
 *
 * Every flow worked through a stage at a time - the scanner, the quick brew,
 * somebody else's recipe - answers "späť" the same way: the stage before this
 * one, which is the screen somebody was just on. The map names only the
 * stages that have one. The first has nothing behind it, and a confirmation
 * at the end has nothing worth returning to, so both leave the word to the
 * navigator.
 *
 * Undefined rather than a function that does nothing, because the screen
 * reads it as "this is not the flow's to answer" and hands the button to the
 * navigator instead.
 */
export const resolveStepBack = <TStage extends string>(
  previousStages: Partial<Record<TStage, TStage>>,
  stage: TStage,
  goTo: (previous: TStage) => void,
): (() => void) | undefined => {
  const previous = previousStages[stage];

  return previous === undefined
    ? undefined
    : (): void => {
        goTo(previous);
      };
};
