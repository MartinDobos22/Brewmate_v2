import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';

import { ThemeProvider, useThemedStyles, type ColorScheme } from '../../../../theme';

import { createSchemePreviewStyles } from './SchemePreview.styles';

export interface SchemePreviewProps {
  readonly scheme: ColorScheme;
  readonly children: ReactNode;
}

/** Renders its children under a forced scheme, so both can sit side by side. */
const PreviewSurface = ({ children }: { readonly children: ReactNode }): JSX.Element => {
  const styles = useThemedStyles(createSchemePreviewStyles);

  return (
    <View style={styles.column}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
};

export const SchemePreview = ({ scheme, children }: SchemePreviewProps): JSX.Element => (
  <ThemeProvider forcedScheme={scheme}>
    <PreviewSurface>{children}</PreviewSurface>
  </ThemeProvider>
);
