import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Chip, PillButton } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { DS_CHIP_ICON, PREVIEW_PILL_ICON } from '../../constants';
import { SectionBlock } from '../SectionBlock';

import { createButtonsSectionStyles } from './ButtonsSection.styles';
import { PillSizeRow } from './PillSizeRow';
import { PillToneRow } from './PillToneRow';

const noop = (): void => undefined;

/** Every pressable the app has, which since `Button` was retired is two. */
export const ButtonsSection = (): JSX.Element => {
  const styles = useThemedStyles(createButtonsSectionStyles);
  const { t } = useTranslation();
  const [selected, setSelected] = useState(true);

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionButtons)}>
      <PillToneRow />
      <PillSizeRow />
      <View style={styles.row}>
        <PillButton
          tone="espresso"
          icon={PREVIEW_PILL_ICON}
          label={t(TRANSLATION_KEYS.dsButtonDisabled)}
          onPress={noop}
          disabled
        />
        <PillButton
          tone="espresso"
          label={t(TRANSLATION_KEYS.dsButtonLoading)}
          onPress={noop}
          isPending
        />
        <PillButton tone="surface" icon={PREVIEW_PILL_ICON} onPress={noop} />
      </View>
      <View style={styles.row}>
        <Chip
          label={t(TRANSLATION_KEYS.dsChipSelected)}
          selected={selected}
          onPress={(): void => {
            setSelected(!selected);
          }}
        />
        <Chip label={t(TRANSLATION_KEYS.dsChipDefault)} selected={false} onPress={noop} />
        <Chip label={t(TRANSLATION_KEYS.dsChipDisabled)} selected={false} onPress={noop} disabled />
        <Chip label={t(TRANSLATION_KEYS.dsChipFact)} size="small" />
        <Chip label={t(TRANSLATION_KEYS.dsChipNeutral)} icon={DS_CHIP_ICON} />
        <Chip label={t(TRANSLATION_KEYS.dsChipFresh)} icon={DS_CHIP_ICON} tone="fresh" />
        <Chip label={t(TRANSLATION_KEYS.dsChipLifted)} icon={DS_CHIP_ICON} tone="lifted" />
        <Chip label={t(TRANSLATION_KEYS.dsChipShortcut)} icon={DS_CHIP_ICON} onPress={noop} />
      </View>
    </SectionBlock>
  );
};
