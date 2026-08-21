import type { JSX } from 'react';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ButtonsSection } from '../ButtonsSection';
import { ColorSection } from '../ColorSection';
import { ElevationSection } from '../ElevationSection';
import { FeedbackSection } from '../FeedbackSection';
import { FormSection } from '../FormSection';
import { MotionSection } from '../MotionSection';
import { ShapeSection } from '../ShapeSection';
import { SheetSection } from '../SheetSection';
import { SpacingSection } from '../SpacingSection';
import { SurfacesSection } from '../SurfacesSection';
import { TypographySection } from '../TypographySection';
import { ValuesSection } from '../ValuesSection';

/** Every token and every component, in one column, under one theme. */
export const DesignSystemSections = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.dsIntro)}
      </Text>
      <ColorSection />
      <TypographySection />
      <ShapeSection />
      <SpacingSection />
      <ElevationSection />
      <MotionSection />
      <ButtonsSection />
      <FormSection />
      <SurfacesSection />
      <ValuesSection />
      <FeedbackSection />
      <SheetSection />
    </>
  );
};
