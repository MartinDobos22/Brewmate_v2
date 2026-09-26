import { useRouter } from 'expo-router';
import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { buildBagRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  BAG_FRESHNESS_DIAL_COLORS,
  BAG_FRESHNESS_LABEL_KEYS,
  BAG_FRESHNESS_TONES,
} from '../../../inventory/constants';
import { resolveBagFreshness } from '../../../inventory/services';

import { bagSpine, createHomeCupboardStyles } from './HomeCupboard.styles';

export interface HomeCupboardRowProps {
  readonly bag: CoffeeBag;
}

const STATE_SEPARATOR = ' · ';
const UNIT_GAP = ' ';

/**
 * One coffee on the shelf: what it is, what state it is in, how much is left.
 *
 * The state and the age are one line rather than two facts, because neither
 * means much alone - "39 dní" is a number and "starne" is a judgement, and the
 * pair is the reason to open this bag before the other one.
 *
 * A bag nobody weighed says so rather than printing a confident nought. Zero
 * grams and "not recorded" are different facts, and only one of them means
 * somebody has to go shopping.
 */
export const HomeCupboardRow = ({ bag }: HomeCupboardRowProps): JSX.Element => {
  const styles = useThemedStyles(createHomeCupboardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { freshness, days } = resolveBagFreshness(bag);

  const state = t(BAG_FRESHNESS_LABEL_KEYS[freshness]);
  const age = `${String(days)}${UNIT_GAP}${t(TRANSLATION_KEYS.unitDays)}`;
  const line = days === null ? state : [state, age].join(STATE_SEPARATOR);
  const grams = t(TRANSLATION_KEYS.unitGrams);
  const remaining =
    bag.remainingGrams === null
      ? `${t(TRANSLATION_KEYS.inventoryDialUnknown)}${UNIT_GAP}${grams}`
      : `${formatGrams(bag.remainingGrams)}${UNIT_GAP}${grams}`;

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.row,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={(): void => {
        router.push(buildBagRoute(bag.id));
      }}
      accessibilityRole="button"
      accessibilityLabel={`${bag.name}. ${line}`}
    >
      <View style={bagSpine(theme, theme.colors[BAG_FRESHNESS_DIAL_COLORS[freshness]])} />
      <View style={styles.body}>
        <Text variant="cardTitle" numberOfLines={1}>
          {bag.name}
        </Text>
        <Text variant="caption" tone={BAG_FRESHNESS_TONES[freshness]} numberOfLines={1}>
          {line}
        </Text>
      </View>
      <Text
        variant={bag.remainingGrams === null ? 'numericCaption' : 'numericRow'}
        tone={bag.remainingGrams === null ? 'muted' : 'default'}
        numeric
      >
        {remaining}
      </Text>
    </Pressable>
  );
};
