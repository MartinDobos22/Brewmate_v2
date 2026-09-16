/**
 * What the one sheet behind the grinder field is showing.
 *
 * One sheet with two views rather than two sheets, because two overlays whose
 * visibility flips in the same commit is the one arrangement iOS genuinely
 * cannot present: the second is asked to appear while the first is still
 * dismissing. The views are different questions - which of mine, and which one
 * is it - so they get a title each and the same panel.
 */
export const GRINDER_PICKER_VIEWS = {
  closed: 'closed',
  owned: 'owned',
  catalogue: 'catalogue',
} as const;

export type GrinderPickerView = (typeof GRINDER_PICKER_VIEWS)[keyof typeof GRINDER_PICKER_VIEWS];
