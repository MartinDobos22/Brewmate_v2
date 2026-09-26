import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * The mark beside what Brewmate says, and the reason there is one.
 *
 * Two bubbles differing only in their colour and in which corner is tightened
 * read as a conversation somebody has to decode; a mark against one side of it
 * says who is speaking before a word is read. Only Brewmate gets one - the
 * person holding the phone knows which sentences are theirs, and an avatar on
 * both sides would be two marks answering a question nobody asked twice.
 */
export const CHAT_ASSISTANT_ICON: MaterialIconName = 'coffee-outline';
