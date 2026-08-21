import type { JSX } from 'react';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import type { TypographyToken } from '../../../../theme';
import { PREVIEW_TYPOGRAPHY_TOKENS, isNumericToken } from '../../constants';
import { SectionBlock } from '../SectionBlock';

export const TypographySection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionTypography)}>
      {PREVIEW_TYPOGRAPHY_TOKENS.map((token: TypographyToken): JSX.Element => (
        <Text key={token} variant={token} numeric={isNumericToken(token)}>
          {token}
        </Text>
      ))}
    </SectionBlock>
  );
};
