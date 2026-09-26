import type { BagRating } from '@brewmate/shared';
import type { JSX } from 'react';

import { Sheet } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BAG_RATING_STAGE_TITLE_KEYS } from '../../constants';

import { BagRatingBody } from './BagRatingBody';
import type { BagRatingRequest } from '../../services';

export interface BagRatingSheetProps {
  /** The bag and the moment being asked about; null keeps the sheet closed. */
  readonly request: BagRatingRequest | null;
  /** The answer already given for this bag and stage, to start from. */
  readonly existing: BagRating | null;
  /** Leaving without answering - nothing is saved and nothing else happens. */
  readonly onClose: () => void;
  readonly onDone: () => void;
}

/**
 * "Ako ti chutí?", asked about one bag.
 *
 * The body is keyed on the bag and the stage, so opening the sheet for another
 * coffee starts from that coffee's own answer rather than from whatever was
 * tapped for the last one.
 */
export const BagRatingSheet = ({
  request,
  existing,
  onClose,
  onDone,
}: BagRatingSheetProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Sheet
      visible={request !== null}
      title={request === null ? '' : t(BAG_RATING_STAGE_TITLE_KEYS[request.stage])}
      closeLabel={t(TRANSLATION_KEYS.bagRatingClose)}
      onClose={onClose}
    >
      {request === null ? null : (
        <BagRatingBody
          key={[request.bag.id, request.stage].join()}
          request={request}
          existing={existing}
          onDone={onDone}
        />
      )}
    </Sheet>
  );
};
