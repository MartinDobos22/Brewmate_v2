import type { BrewMethod } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createPreBrewMethodSectionStyles } from './PreBrewMethodSection.styles';

export interface PreBrewMethodSectionProps {
  readonly methods: readonly BrewMethod[];
  readonly method: BrewMethod | undefined;
  readonly onChoose: (method: BrewMethod) => void;
}

const NOTHING = 0;

/**
 * What this is being brewed in - and only what it can be brewed in.
 *
 * The list is already narrowed to the active set, which is the point of
 * switching sets at all: at the cabin the dripper is at home, so the dripper
 * is not on this list. Offering a method somebody cannot carry out is not
 * advice, it is a shopping list they did not ask for.
 */
export const PreBrewMethodSection = ({
  methods,
  method,
  onChoose,
}: PreBrewMethodSectionProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewMethodSectionStyles);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewMethodSection)}</Text>
      {methods.length === NOTHING ? (
        <View style={styles.empty}>
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.preBrewMethodEmpty)}
          </Text>
          <Button
            label={t(TRANSLATION_KEYS.preBrewMethodEmptyAction)}
            variant="secondary"
            fullWidth
            onPress={(): void => {
              router.push(ROUTES.inventory);
            }}
          />
        </View>
      ) : (
        <>
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.preBrewMethodHint)}
          </Text>
          <View style={styles.chips}>
            {methods.map((item: BrewMethod): JSX.Element => (
              <Chip
                key={item.id}
                label={item.nameSk}
                selected={method?.id === item.id}
                onPress={(): void => {
                  onChoose(item);
                }}
              />
            ))}
          </View>
        </>
      )}
    </Card>
  );
};
