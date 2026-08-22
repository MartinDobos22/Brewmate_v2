import type { JSX } from 'react';

import { Input } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

export interface GrinderSearchFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

/** The catalogue's search box; the debounce lives in the hook behind it. */
export const GrinderSearchField = ({ value, onChange }: GrinderSearchFieldProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Input
      label={t(TRANSLATION_KEYS.grinderSearchLabel)}
      placeholder={t(TRANSLATION_KEYS.grinderSearchPlaceholder)}
      value={value}
      onChangeText={onChange}
      autoCapitalize="none"
    />
  );
};
