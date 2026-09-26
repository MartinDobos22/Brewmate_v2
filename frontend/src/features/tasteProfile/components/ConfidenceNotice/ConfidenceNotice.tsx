import type { JSX } from 'react';

import { InfoNote } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { CONFIDENCE_NOTICE_ICON } from '../../constants';
import { useTasteProfile } from '../../hooks';
import { resolveConfidenceNoticeKey } from '../../services';

/**
 * What the app admits about itself, next to whatever it just recommended.
 *
 * It reads the profile itself rather than taking one as a prop, so putting the
 * caveat next to a piece of advice is one line at the call site. Advice that
 * needs a disclaimer somebody has to remember to add is advice that will
 * eventually be shown without one.
 *
 * Renders nothing while the profile is loading: a caveat that flashes in after
 * the recommendation is worse than one that was always there.
 *
 * It is the app's own aside, so it is drawn as one - a ground and a mark -
 * rather than as a sentence behind a grey rule, which is the shape every
 * other remark in this app stopped using. The glyph is the one the shop
 * verdict already uses for what it does not know about the person, because
 * that is exactly what this says.
 */
export const ConfidenceNotice = (): JSX.Element | null => {
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();

  if (profile === undefined) {
    return null;
  }

  const noticeKey = resolveConfidenceNoticeKey(profile);

  if (noticeKey === null) {
    return null;
  }

  return <InfoNote text={t(noticeKey)} icon={CONFIDENCE_NOTICE_ICON} />;
};
