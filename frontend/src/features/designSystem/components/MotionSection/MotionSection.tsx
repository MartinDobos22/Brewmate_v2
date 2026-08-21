import type { JSX } from 'react';

import { Text } from '../../../../components/ui';
import { useReducedMotion } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { MotionTrack } from '../MotionTrack';
import { SectionBlock } from '../SectionBlock';

export const MotionSection = (): JSX.Element => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionMotion)}>
      <MotionTrack label={t(TRANSLATION_KEYS.dsMotionShort)} duration="short" />
      <MotionTrack label={t(TRANSLATION_KEYS.dsMotionMedium)} duration="medium" />
      <MotionTrack label={t(TRANSLATION_KEYS.dsMotionLong)} duration="long" />
      <Text variant="bodySmall" tone="muted">
        {t(reduceMotion ? TRANSLATION_KEYS.dsReducedMotionOn : TRANSLATION_KEYS.dsReducedMotionOff)}
      </Text>
    </SectionBlock>
  );
};
