import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { PillButton, type PillTone } from '../PillButton';
import {
  DEFAULT_STATE_GROUND,
  StateMark,
  STATE_BODY_TONES,
  STATE_TITLE_TONES,
  type StateGround,
} from '../StateMark';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import { createEmptyStateStyles } from './EmptyState.styles';

/**
 * The quiet tone, because most empty screens offer two or three ways forward
 * and none of them is the answer. A caller names the loud one where there is
 * genuinely a first choice.
 */
const DEFAULT_ACTION_TONE: PillTone = 'surface';

export interface EmptyStateAction {
  readonly label: string;
  readonly onPress: () => void;
  readonly tone?: PillTone;
}

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  /**
   * The thing that is not there yet, drawn inside the app's own rings.
   *
   * Optional because several screens use this shape to confirm something
   * rather than to report an absence - a bag written into the cupboard, a
   * coffee bought, a coffee left on the shelf - and those have nothing that
   * is missing to draw. The alternative would be a tick, which on the scan's
   * two endings would grade the decision somebody had just made.
   */
  readonly icon?: TileGlyph;
  readonly ground?: StateGround;
  /**
   * The ways out, in the order they deserve attention. An empty screen with
   * nothing to press is a dead end, so a state that can offer one, does.
   */
  readonly actions?: readonly EmptyStateAction[];
}

const NO_ACTIONS: readonly EmptyStateAction[] = [];

/** Shown when a list has nothing in it yet. */
export const EmptyState = ({
  title,
  description,
  icon,
  ground = DEFAULT_STATE_GROUND,
  actions = NO_ACTIONS,
}: EmptyStateProps): JSX.Element => {
  const styles = useThemedStyles(createEmptyStateStyles);

  return (
    <View style={styles.wrapper}>
      {icon === undefined ? null : <StateMark icon={icon} ground={ground} />}
      <View style={styles.text}>
        <Text variant="displayCompact" tone={STATE_TITLE_TONES[ground]} align="center">
          {title}
        </Text>
        <Text variant="bodyText" tone={STATE_BODY_TONES[ground]} align="center">
          {description}
        </Text>
      </View>
      <View style={styles.actions}>
        {actions.map((action: EmptyStateAction): JSX.Element => (
          <PillButton
            key={action.label}
            tone={action.tone ?? DEFAULT_ACTION_TONE}
            label={action.label}
            onPress={action.onPress}
            fullWidth
          />
        ))}
      </View>
    </View>
  );
};
