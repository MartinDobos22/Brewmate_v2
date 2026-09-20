import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { Recipe } from '@brewmate/shared';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { useIsOnline } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_METHOD_CATEGORY_ICONS, CALCULATOR_ICONS, FOOT_BAR_ICONS } from '../../constants';
import type { BrewSetup } from '../../hooks/brewSetup';
import { PreBrewFailureNotice } from '../PreBrewScreen/PreBrewFailureNotice';

import { createPreBrewFootBarStyles } from './PreBrewFootBar.styles';

const EMPTY = '';
const PLAN_SEPARATOR = ' · ';
const AMOUNT_SEPARATOR = ' / ';

export interface PreBrewFootBarProps {
  readonly setup: BrewSetup;
  readonly onWritten: (recipe: Recipe) => void;
}

/** What is about to be brewed, and the one button that commits to it. */
export const PreBrewFootBar = ({ setup, onWritten }: PreBrewFootBarProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewFootBarStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const { amounts } = setup;
  const isBlocked = setup.method === undefined || !isOnline || setup.isPending;

  const grams = t(TRANSLATION_KEYS.unitGrams);
  const plan = [
    `${formatGrams(amounts.doseGrams)}${AMOUNT_SEPARATOR}${formatGrams(amounts.waterGrams)} ${grams}`,
    formatRatio(amounts.ratio),
  ].join(PLAN_SEPARATOR);

  const coffee =
    setup.bag?.name ??
    (setup.coffeeDescription.trim() === EMPTY
      ? t(TRANSLATION_KEYS.preBrewFootNoCoffee)
      : setup.coffeeDescription);

  const subject =
    setup.method === undefined ? coffee : [setup.method.nameSk, coffee].join(PLAN_SEPARATOR);

  const submitStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.submit,
    pressed && styles.pressed,
    isBlocked && styles.disabled,
  ];

  return (
    <>
      {isOnline && !setup.hasFailed && setup.method !== undefined ? null : (
        <View style={styles.notices}>
          {isOnline ? null : (
            <Text variant="bodyMuted" tone="caution">
              {t(TRANSLATION_KEYS.preBrewOffline)}
            </Text>
          )}
          {setup.method === undefined ? (
            <Text variant="bodyMuted" tone="muted">
              {t(TRANSLATION_KEYS.preBrewMissingMethod)}
            </Text>
          ) : null}
          {setup.hasFailed ? (
            <PreBrewFailureNotice error={setup.error} isOnline={isOnline} />
          ) : null}
        </View>
      )}
      <View style={styles.bar}>
        <View style={styles.plan}>
          <View style={styles.line}>
            <MaterialCommunityIcons
              name={FOOT_BAR_ICONS.amounts}
              size={theme.size.iconSmall}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="numericFoot" numberOfLines={1} numeric>
              {plan}
            </Text>
          </View>
          <View style={styles.line}>
            <MaterialCommunityIcons
              name={
                setup.method === undefined
                  ? CALCULATOR_ICONS.section
                  : BREW_METHOD_CATEGORY_ICONS[setup.method.category]
              }
              size={theme.size.iconTiny}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="captionSmall" tone="muted" numberOfLines={1}>
              {subject}
            </Text>
          </View>
        </View>
        <Pressable
          style={submitStyle}
          disabled={isBlocked}
          onPress={(): void => {
            setup.askForRecipe(onWritten);
          }}
          accessibilityRole="button"
          accessibilityState={{ disabled: isBlocked }}
          accessibilityLabel={t(TRANSLATION_KEYS.preBrewSubmit)}
        >
          <Text variant="rowTitle" tone="onCream" numberOfLines={1}>
            {t(
              setup.isPending ? TRANSLATION_KEYS.preBrewSubmitting : TRANSLATION_KEYS.preBrewSubmit,
            )}
          </Text>
          <MaterialCommunityIcons
            name={FOOT_BAR_ICONS.submit}
            size={theme.size.iconSmall}
            color={theme.colors.cream}
          />
        </Pressable>
      </View>
    </>
  );
};
