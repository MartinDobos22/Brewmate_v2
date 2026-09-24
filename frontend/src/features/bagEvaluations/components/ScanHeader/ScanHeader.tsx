import type { JSX } from 'react';

import { FlowHeader } from '../../../../components/layout';
import { useTranslation, type TranslationKey } from '../../../../i18n';
import { SCAN_ICONS } from '../../constants';

export interface ScanHeaderProps {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
}

/**
 * The scan's own flow block, which is what it says rather than how it is
 * drawn: the badge is the same glyph the home screen's scanner button
 * carries, and the copy changes with the stage.
 *
 * The one sentence that makes this feature usable by an account that owns
 * nothing goes underneath - no cupboard and no history are needed, only the
 * label.
 */
export const ScanHeader = ({ titleKey, bodyKey }: ScanHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  return <FlowHeader icon={SCAN_ICONS.scan} title={t(titleKey)} body={t(bodyKey)} />;
};
