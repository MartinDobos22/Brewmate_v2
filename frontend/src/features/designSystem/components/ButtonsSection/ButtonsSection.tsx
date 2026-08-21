import { useState, type JSX } from 'react';

import { Button, Chip } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { SectionBlock } from '../SectionBlock';

const noop = (): void => undefined;

export const ButtonsSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(true);

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionButtons)} inline>
      <Button label={t(TRANSLATION_KEYS.dsButtonPrimary)} onPress={noop} />
      <Button label={t(TRANSLATION_KEYS.dsButtonSecondary)} onPress={noop} variant="secondary" />
      <Button label={t(TRANSLATION_KEYS.dsButtonTertiary)} onPress={noop} variant="tertiary" />
      <Button label={t(TRANSLATION_KEYS.dsButtonDanger)} onPress={noop} variant="danger" />
      <Button label={t(TRANSLATION_KEYS.dsButtonDisabled)} onPress={noop} disabled />
      <Button label={t(TRANSLATION_KEYS.dsButtonLoading)} onPress={noop} loading size="small" />
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
