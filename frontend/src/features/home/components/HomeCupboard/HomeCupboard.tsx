import type { CoffeeBag } from '@brewmate/shared';
import { Fragment, type JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDecimal, formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { groupBagsByFreshness, type BagGroup } from '../../../inventory/services';
import { useCoffeeBags } from '../../../inventory/hooks';
import { HOME_CUPBOARD } from '../../constants';

import { createHomeCupboardStyles } from './HomeCupboard.styles';
import { HomeCupboardEmpty } from './HomeCupboardEmpty';
import { HomeCupboardRow } from './HomeCupboardRow';

const NOTHING = 0;
const FIRST = 0;
const SUMMARY_SEPARATOR = ' · ';
const UNIT_GAP = ' ';

/**
 * The shelf, in the order somebody standing in front of it reads it.
 *
 * The same grouping the cupboard screen uses, flattened: ready now first, then
 * what will be lost if it keeps waiting, then what is still fine, then what is
 * not ready yet. Two screens one tap apart cannot be allowed to disagree about
 * which coffee to open, so neither of them sorts its own way.
 *
 * Only the first few rows. This is a summary with a tab of its own one tap
 * below it, and a home screen that listed a whole cupboard would be the
 * cupboard with a greeting on top.
 */
export const HomeCupboard = (): JSX.Element | null => {
  const styles = useThemedStyles(createHomeCupboardStyles);
  const { t } = useTranslation();
  const bags = useCoffeeBags();

  if (!bags.isSuccess) {
    return null;
  }

  const items = bags.data.items;
  const sorted = groupBagsByFreshness(items).flatMap(
    (group: BagGroup): readonly CoffeeBag[] => group.bags,
  );
  const shown = sorted.slice(FIRST, HOME_CUPBOARD.rows);

  const remaining = items.reduce(
    (total: number | null, bag: CoffeeBag): number | null =>
      bag.remainingGrams === null ? total : (total ?? NOTHING) + bag.remainingGrams,
    null,
  );
  const summary =
    remaining === null
      ? t(TRANSLATION_KEYS.homeCupboardCount, { count: formatDecimal(items.length) })
      : [
          `${formatGrams(remaining)}${UNIT_GAP}${t(TRANSLATION_KEYS.unitGrams)}`,
          t(TRANSLATION_KEYS.homeCupboardCount, { count: formatDecimal(items.length) }),
        ].join(SUMMARY_SEPARATOR);

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View style={styles.title}>
          <Text variant="sectionHeading">{t(TRANSLATION_KEYS.homeCupboardTitle)}</Text>
        </View>
        {items.length === NOTHING ? null : (
          <Text variant="numericLabel" tone="muted" numeric>
            {summary}
          </Text>
        )}
      </View>
      {shown.length === NOTHING ? (
        <HomeCupboardEmpty />
      ) : (
        <View style={styles.list}>
          {shown.map((bag: CoffeeBag, index: number): JSX.Element => (
            <Fragment key={bag.id}>
              {index === FIRST ? null : <View style={styles.divider} />}
              <HomeCupboardRow bag={bag} />
            </Fragment>
          ))}
        </View>
      )}
    </View>
  );
};
