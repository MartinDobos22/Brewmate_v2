import type { BrewMethod, Equipment } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, OptionCard, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BREW_METHOD_CATEGORY_LABEL_KEYS } from '../../constants';
import type { BrewerSelection } from '../../hooks';
import type { BrewMethodGroup } from '../../services';

import { createBrewMethodGroupSectionStyles } from './BrewMethodGroupSection.styles';

export interface BrewMethodGroupSectionProps {
  readonly group: BrewMethodGroup;
  readonly selection: BrewerSelection;
  readonly onOpenDetails: (method: BrewMethod, brewer: Equipment) => void;
}

/** One family of brewing methods, each a card that can be ticked. */
export const BrewMethodGroupSection = ({
  group,
  selection,
  onOpenDetails,
}: BrewMethodGroupSectionProps): JSX.Element => {
  const styles = useThemedStyles(createBrewMethodGroupSectionStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.group}>
      <Text variant="labelMedium" tone="muted">
        {t(BREW_METHOD_CATEGORY_LABEL_KEYS[group.category])}
      </Text>
      {group.methods.map((method: BrewMethod): JSX.Element => {
        const brewer = selection.brewerFor(method);

        return (
          <View key={method.id} style={styles.item}>
            <OptionCard
              label={method.nameSk}
              selected={brewer !== undefined}
              disabled={selection.isPending}
              onPress={(): void => {
                selection.toggle(method);
              }}
            />
            {brewer === undefined ? null : (
              <Button
                label={t(TRANSLATION_KEYS.setupBrewersDetailAction)}
                variant="tertiary"
                size="small"
                onPress={(): void => {
                  onOpenDetails(method, brewer);
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};
