import type { JSX } from 'react';

import { RecipeChatScreen } from '../features/chat';

/**
 * The conversation about one recipe.
 *
 * Route files render one screen and nothing else. Which recipe - and which
 * cup, where there is one - is read inside the screen from the route, so that
 * a deep link into a conversation works the same as arriving from a brew.
 */
export default function ChatRoute(): JSX.Element {
  return <RecipeChatScreen />;
}
