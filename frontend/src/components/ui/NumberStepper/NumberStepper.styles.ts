import { StyleSheet } from 'react-native';

import type { TextStyles, Theme, ViewStyles } from '../../../theme';

type NumberStepperStyleMap = ViewStyles<
  | 'wrapper'
  | 'row'
  | 'button'
  | 'pressed'
  | 'disabled'
  | 'value'
  | 'editable'
  | 'calculatorRow'
  | 'calculatorButton'
  | 'calculatorDecrease'
  | 'calculatorIncrease'
  | 'calculatorValue'
  | 'calculatorLabel'
> &
  TextStyles<'field' | 'calculatorField'>;

export const createNumberStepperStyles = (theme: Theme): NumberStepperStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    button: {
      width: theme.size.stepperButtonSize,
      height: theme.size.stepperButtonSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.smallButton,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surface,
    },
    pressed: { backgroundColor: theme.colors.surfaceContainer },
    disabled: { opacity: theme.opacity.disabled },
    /**
     * A real width, not only a flex weight. `flex: 1` alone contributes
     * nothing to a row that is sizing itself to its content, so the number
     * came out zero points wide - wrapped one character per line and clipped
     * out of sight - and the control resized itself on every tap.
     */
    value: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
      minWidth: theme.size.stepperValueMinWidth,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** The typed number and its unit, kept on one baseline. */
    editable: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: theme.spacing.xs,
    },
    /**
     * A field that does not look like one until it is touched.
     *
     * The border and the surface belong to `Input`, which is a question being
     * asked. This is a value being reported that happens to be editable, and
     * boxing it would put a third rectangle inside a row that already has two
     * buttons in it.
     */
    field: {
      ...theme.typography.numericLarge,
      color: theme.colors.onSurface,
      padding: theme.spacing.none,
      minWidth: theme.size.stepperFieldMinWidth,
      textAlign: 'right',
    },

    /**
     * The calculator arrangement: two round buttons with the figure between
     * them and its name underneath.
     *
     * The label moved below the number because on this screen the number is
     * the largest thing on the page and a caption above it read as a heading
     * for the whole card. The minus is quiet and the plus is not, which is the
     * honest asymmetry: more coffee is the ordinary direction to move in.
     */
    calculatorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    calculatorButton: {
      width: theme.size.calculatorButtonSize,
      height: theme.size.calculatorButtonSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
    },
    calculatorDecrease: { backgroundColor: theme.colors.surfaceVariant },
    calculatorIncrease: { backgroundColor: theme.colors.espresso },
    calculatorValue: { flex: 1, alignItems: 'center' },
    calculatorLabel: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    calculatorField: {
      ...theme.typography.numericCalculator,
      color: theme.colors.onSurface,
      padding: theme.spacing.none,
      minWidth: theme.size.stepperFieldMinWidth,
      textAlign: 'center',
    },
  });
