import { useState, type JSX } from 'react';

import { Chip, PillButton } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { SectionBlock } from '../SectionBlock';

const noop = (): void => undefined;

export const ButtonsSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(true);

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionButtons)} inline>
      <PillButton tone="espresso" label={t(TRANSLATION_KEYS.dsButtonPrimary)} onPress={noop} />
      <PillButton tone="surface" label={t(TRANSLATION_KEYS.dsButtonSecondary)} onPress={noop} />
      <PillButton tone="surface" label={t(TRANSLATION_KEYS.dsButtonTertiary)} onPress={noop} />
      <PillButton tone="danger" label={t(TRANSLATION_KEYS.dsButtonDanger)} onPress={noop} />
      <PillButton
        tone="espresso"
        label={t(TRANSLATION_KEYS.dsButtonDisabled)}
        onPress={noop}
        disabled
      />
      <PillButton
        tone="espresso"
        label={t(TRANSLATION_KEYS.dsButtonLoading)}
        onPress={noop}
        isPending
        size="small"
      />
      <Chip
        label={t(TRANSLATION_KEYS.dsChipSelected)}
        selected={selected}
        onPress={(): void => {
          setSelected(!selected);
        }}
      />
      <Chip label={t(TRANSLATION_KEYS.dsChipDefault)} onPress={noop} />
      <Chip label={t(TRANSLATION_KEYS.dsChipDisabled)} onPress={noop} disabled />
    </SectionBlock>
  );
};
