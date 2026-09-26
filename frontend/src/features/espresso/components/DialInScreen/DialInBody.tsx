import type { BrewMethod } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { InfoNote, PillButton } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { DialInSession } from '../../hooks';
import { DIAL_IN_ICONS } from '../../constants';
import { ShotForm } from '../ShotForm';
import { ShotTimelineCard } from '../ShotTimelineCard';

import { DialInConversation } from './DialInConversation';
import { createDialInScreenStyles } from './DialInScreen.styles';

export interface DialInBodyProps {
  readonly session: DialInSession;
  /** The method the recipe is brewed on, which the run is read against. */
  readonly method: BrewMethod | undefined;
}

const NOTHING = 0;

/**
 * The dial-in, top to bottom: how the run has gone, what has been said, and
 * the box for the next shot.
 *
 * The numbers are in the header above rather than in a card here - a dial-in
 * is one conversation about one recipe, and printing its three figures twice
 * on one screen invited the reader to check whether they agreed.
 *
 * The form is last because it is what somebody comes back to between shots -
 * everything above it is what they read once and then scroll past. The two
 * sentences this screen says about itself are marked asides rather than
 * floating grey text: what this mode is and what it will do, before the first
 * shot, and that the run is over and the recipe kept.
 *
 * The opening note is the mode's own sentence rather than the one that used
 * to sit here, which told somebody to brew "podľa odhadu nižšie" - the
 * numbers are in the header above now, and a note pointing down at nothing is
 * worse than no note.
 */
export const DialInBody = ({ session, method }: DialInBodyProps): JSX.Element | null => {
  const styles = useThemedStyles(createDialInScreenStyles);
  const { t } = useTranslation();

  if (session.recipe === undefined || method === undefined) {
    return null;
  }

  return (
    <View style={styles.body}>
      <ShotTimelineCard timeline={session.timeline} />
      {session.messages.length === NOTHING ? (
        <InfoNote text={t(TRANSLATION_KEYS.dialInIntro)} icon={DIAL_IN_ICONS.opening} />
      ) : (
        <DialInConversation session={session} />
      )}
      <ShotForm session={session} />
      <View style={styles.finish}>
        {session.isFinished ? (
          <InfoNote tone="fresh" text={t(TRANSLATION_KEYS.dialInFinished)} />
        ) : (
          <PillButton
            tone="surface"
            label={t(
              session.isFinishing
                ? TRANSLATION_KEYS.dialInFinishing
                : TRANSLATION_KEYS.dialInFinish,
            )}
            fullWidth
            isPending={session.isFinishing}
            onPress={session.finish}
          />
        )}
      </View>
    </View>
  );
};
