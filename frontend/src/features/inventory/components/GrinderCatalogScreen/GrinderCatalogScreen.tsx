import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Screen } from '../../../../components/layout';
import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useGrinderCatalog } from '../../hooks';
import { AddGrinderSheet } from '../AddGrinderSheet';
import { GrinderList } from '../GrinderList';
import { GrinderSearchField } from '../GrinderSearchField';
import { GrinderUseFilter } from '../GrinderUseFilter';

import { createGrinderCatalogScreenStyles } from './GrinderCatalogScreen.styles';

/**
 * The grinder catalogue: search it, narrow it, and add the one that is not
 * there.
 *
 * The "I could not find mine" button is offered whether or not the list came
 * back empty, because somebody may recognise a near-miss and still want their
 * own entry.
 */
export const GrinderCatalogScreen = (): JSX.Element => {
  const styles = useThemedStyles(createGrinderCatalogScreenStyles);
  const { t } = useTranslation();
  const catalog = useGrinderCatalog();
  const [adding, setAdding] = useState(false);

  const closeSheet = (): void => {
    setAdding(false);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="headlineSmall">{t(TRANSLATION_KEYS.grinderCatalogTitle)}</Text>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.grinderCatalogSubtitle)}
        </Text>
        <GrinderSearchField value={catalog.search} onChange={catalog.setSearch} />
        <GrinderUseFilter selected={catalog.typicalUse} onSelect={catalog.setTypicalUse} />
      </View>
      <View style={styles.list}>
        <GrinderList
          items={catalog.items}
          isLoading={catalog.isLoading}
          isError={catalog.isError}
          isFiltered={catalog.isFiltered}
          onRetry={catalog.refetch}
          onAddOwn={(): void => {
            setAdding(true);
          }}
        />
      </View>
      <Button
        label={t(TRANSLATION_KEYS.grinderNotFoundAction)}
        variant="tertiary"
        fullWidth
        onPress={(): void => {
          setAdding(true);
        }}
      />
      <AddGrinderSheet visible={adding} onClose={closeSheet} onAdded={closeSheet} />
    </Screen>
  );
};
