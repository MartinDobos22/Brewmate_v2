import { useState, type JSX } from 'react';

import { PillButton, Sheet, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { SectionBlock } from '../SectionBlock';

export const SheetSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const close = (): void => {
    setVisible(false);
  };

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionSheet)}>
      <PillButton
        tone="surface"
        label={t(TRANSLATION_KEYS.dsOpenSheet)}
        onPress={(): void => {
          setVisible(true);
        }}
      />
      <Sheet
        visible={visible}
        title={t(TRANSLATION_KEYS.dsSheetTitle)}
        closeLabel={t(TRANSLATION_KEYS.actionClose)}
        onClose={close}
      >
        <Text variant="bodyMedium" tone="muted">
          {t(TRANSLATION_KEYS.dsSheetBody)}
        </Text>
        <PillButton tone="espresso" label={t(TRANSLATION_KEYS.actionClose)} onPress={close} />
      </Sheet>
    </SectionBlock>
  );
};
