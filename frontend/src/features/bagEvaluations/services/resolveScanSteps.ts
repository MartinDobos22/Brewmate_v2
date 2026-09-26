import {
  BAG_SCAN_MODES,
  BAG_SCAN_STAGES,
  type BagScanMode,
  type BagScanStage,
} from '../constants/bagScan';

const NOT_FOUND = -1;

export interface ScanSteps {
  /** The stages this particular scan will pass through, in order. */
  readonly stages: readonly BagScanStage[];
  /** Which one is current, counting from one. Zero once the scan is over. */
  readonly current: number;
  readonly total: number;
}

/**
 * How far through a scan somebody is, and how far there is left.
 *
 * The flow is not one fixed list, so this cannot be a constant: a bag being
 * written down rather than asked about never reaches a verdict, so a fixed
 * "krok 2 z 3" would be wrong for the cupboard's camera.
 *
 * The final screen is deliberately outside the count. It is what happened
 * rather than a step somebody has to get through, and numbering it would make
 * the flow look one step longer than it is every time somebody starts one.
 */
export const resolveScanSteps = (stage: BagScanStage, mode: BagScanMode): ScanSteps => {
  const stages: readonly BagScanStage[] = [
    BAG_SCAN_STAGES.capture,
    BAG_SCAN_STAGES.label,
    ...(mode === BAG_SCAN_MODES.verdict ? [BAG_SCAN_STAGES.verdict] : []),
  ];

  const index = stages.indexOf(stage);

  return {
    stages,
    current: index === NOT_FOUND ? 0 : index + 1,
    total: stages.length,
  };
};
