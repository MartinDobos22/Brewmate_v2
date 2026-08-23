import type { TasteProfile } from '@brewmate/shared';
import type { JSX } from 'react';
import { ScrollView } from 'react-native';

import { Button, Sheet, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { TasteAxisSliders } from '../../../tasteProfile/components';
import { useTasteTuning } from '../../hooks/useTasteTuning';

import { createTasteTuningSheetStyles } from './TasteTuningSheet.styles';

export interface TasteTuningSheetProps {
  readonly visible: boolean;
  readonly profile: TasteProfile;
  readonly onClose: () => void;
}

/** Five sliders and a save. What the user leaves here is what the profile says. */
export const TasteTuningSheet = ({
  visible,
  profile,
  onClose,
}: TasteTuningSheetProps): JSX.Element => {
  const styles = useThemedStyles(createTasteTuningSheetStyles);
  const { t } = useTranslation();
  const tuning = useTasteTuning(profile);

  return (
    <Sheet
      visible={visible}
      title={t(TRANSLATION_KEYS.profileTuneTitle)}
      closeLabel={t(TRANSLATION_KEYS.actionClose)}
      onClose={onClose}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text variant="bodyMedium" tone="muted">
          {t(TRANSLATION_KEYS.profileTuneBody)}
        </Text>
        <TasteAxisSliders axes={tuning.axes} onChange={tuning.setAxis} />
        {tuning.hasFailed ? (
          <Text variant="bodySmall" tone="error">
            {t(TRANSLATION_KEYS.profileTuneError)}
          </Text>
        ) : null}
        <Button
          label={t(TRANSLATION_KEYS.profileTuneSave)}
          loading={tuning.isPending}
          fullWidth
          onPress={(): void => {
            tuning.save(onClose);
          }}
        />
      </ScrollView>
    </Sheet>
  );
};
