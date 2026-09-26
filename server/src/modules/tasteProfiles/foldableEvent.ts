import type { TasteProfileEventPayload, TasteProfileSource } from '@brewmate/shared';

/** One entry of the audit trail, as much of it as the fold reads. */
export interface FoldableEvent {
  readonly id: string;
  readonly source: TasteProfileSource;
  readonly payload: TasteProfileEventPayload;
}
