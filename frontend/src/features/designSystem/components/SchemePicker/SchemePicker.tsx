import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { PREVIEW_MODE_OPTIONS, type PreviewMode, type PreviewModeOption } from '../../constants';

import { createSchemePickerStyles } from './SchemePicker.styles';

export interface SchemePickerProps {
  readonly mode: PreviewMode;
  readonly onChange: (mode: PreviewMode) => void;
}

/** Chooses whether the sheet below shows light, dark, or both at once. */
export const SchemePicker = ({ mode, onChange }: SchemePickerProps): JSX.Element => {
  const styles = useThemedStyles(createSchemePickerStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {PREVIEW_MODE_OPTIONS.map((option: PreviewModeOption): JSX.Element => (
        <Chip
          key={option.mode}
          label={t(option.labelKey)}
          selected={mode === option.mode}
          onPress={(): void => {
            onChange(option.mode);
          }}
        />
      ))}
    </View>
  );
};
