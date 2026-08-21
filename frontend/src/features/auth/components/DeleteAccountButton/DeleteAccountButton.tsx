import type { JSX } from 'react';
import { Alert } from 'react-native';

import { Button } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useDeleteAccount } from '../../hooks';
import { AuthErrorMessage } from '../AuthErrorMessage';

const CANCEL_STYLE = 'cancel';
const DESTRUCTIVE_STYLE = 'destructive';

/**
 * Deleting the account from inside the app, which Apple has required since
 * 2022 of any app that can create one.
 *
 * The confirmation is a native alert on purpose: it is the dialog the platform
 * uses for exactly this, and it cannot be dismissed by accident.
 */
export const DeleteAccountButton = (): JSX.Element => {
  const { t } = useTranslation();
  const { run, isPending, errorKey } = useDeleteAccount();

  const confirm = (): void => {
    Alert.alert(
      t(TRANSLATION_KEYS.authDeleteConfirmTitle),
      t(TRANSLATION_KEYS.authDeleteConfirmBody),
      [
        { text: t(TRANSLATION_KEYS.actionCancel), style: CANCEL_STYLE },
        {
          text: t(TRANSLATION_KEYS.authDeleteConfirmAction),
          style: DESTRUCTIVE_STYLE,
          onPress: (): void => {
            run();
          },
        },
      ],
    );
  };

  return (
    <>
      <Button
        label={t(TRANSLATION_KEYS.authDeleteAccountAction)}
        onPress={confirm}
        variant="danger"
        loading={isPending}
        fullWidth
      />
      <AuthErrorMessage errorKey={errorKey} />
    </>
  );
};
