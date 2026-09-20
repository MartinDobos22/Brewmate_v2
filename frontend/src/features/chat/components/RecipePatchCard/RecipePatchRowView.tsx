import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { CHAT_PATCH_ICONS } from '../../constants';
import type { RecipePatchRow } from '../../services/describeRecipePatch';

import { createRecipePatchCardStyles } from './RecipePatchCard.styles';

export interface RecipePatchRowViewProps {
  readonly row: RecipePatchRow;
}

/** One value, what it was, and what it becomes. */
export const RecipePatchRowView = ({ row }: RecipePatchRowViewProps): JSX.Element => {
  const styles = useThemedStyles(createRecipePatchCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name={row.icon}
        size={theme.size.iconRow}
        color={theme.colors.onSurfaceVariant}
      />
      <View style={styles.label}>
        <Text variant="eyebrow" tone="muted">
          {t(row.labelKey)}
        </Text>
      </View>
      <Text variant="numericCaption" tone="muted" numeric replaced>
        {row.before}
      </Text>
      <MaterialCommunityIcons
        name={CHAT_PATCH_ICONS.arrow}
        size={theme.size.iconSmall}
        color={theme.colors.onSurfaceVariant}
      />
      <Text variant="numericRow" numeric>
        {row.after}
      </Text>
    </View>
  );
};
