import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text, type TileGlyph } from '../../ui';
import { EspressoHeader } from '../EspressoHeader';

import { createFlowHeaderStyles } from './FlowHeader.styles';

export interface FlowHeaderProps {
  /** The mark of whatever sent somebody into this flow. */
  readonly icon: TileGlyph;
  readonly title: string;
  readonly body: string;
}

/**
 * The block every stage of a multi-step flow is led by.
 *
 * Two flows in this app are worked through a step at a time on the way to an
 * answer - a bag in a shop and somebody else's recipe - and both are reached
 * from somewhere else, which is why each one opens with a block saying what
 * it is rather than with a title on the page.
 *
 * It stays rather than disappearing after the first tap. Standing in a shop
 * with a bag in one hand, the thing worth keeping on screen is what this
 * screen is about, and a block that vanished would leave three stages that
 * look like three unrelated forms.
 *
 * Its title is a size below a screen's own, deliberately: this is a question
 * being asked rather than a page being named, and the handoff sets the
 * scanner's at 28/34 against a screen title's 30/36.
 */
export const FlowHeader = ({ icon, title, body }: FlowHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createFlowHeaderStyles);
  const theme = useTheme();

  return (
    <EspressoHeader>
      <View style={styles.badge}>
        <MaterialCommunityIcons
          name={icon}
          size={theme.size.iconMedium}
          color={theme.colors.accentOnEspresso}
        />
      </View>
      <View style={styles.text}>
        <Text variant="displayAnswer" tone="onEspresso">
          {title}
        </Text>
        <Text variant="bodyText" tone="onEspressoMuted">
          {body}
        </Text>
      </View>
    </EspressoHeader>
  );
};
