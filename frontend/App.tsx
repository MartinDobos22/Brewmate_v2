import type { JSX } from 'react';
import { StatusBar } from 'expo-status-bar';

import { AppPlaceholder } from './src/components';

const STATUS_BAR_STYLE = 'auto';

export default function App(): JSX.Element {
  return (
    <>
      <AppPlaceholder />
      <StatusBar style={STATUS_BAR_STYLE} />
    </>
  );
}
