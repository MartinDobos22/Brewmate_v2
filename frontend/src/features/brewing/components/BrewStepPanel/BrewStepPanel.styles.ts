import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewStepPanelStyleMap = ViewStyles<'wrapper' | 'instruction'>;

export const createBrewStepPanelStyles = (theme: Theme): BrewStepPanelStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.sm, alignItems: 'center' },
    /**
     * An instruction is read in one go, so it is held to a width that breaks
     * into two or three even lines rather than one that runs the width of the
     * phone and has to be tracked back across.
     */
    instruction: { maxWidth: theme.size.brewInstructionMaxWidth },
  });
