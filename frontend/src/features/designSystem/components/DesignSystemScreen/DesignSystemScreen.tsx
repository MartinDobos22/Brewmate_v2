import { useState, type JSX } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STACK_SCREEN_EDGES } from '../../../../components/layout';
import { useThemedStyles, type ColorScheme } from '../../../../theme';

import { PREVIEW_MODES, SCHEMES_FOR_MODE, type PreviewMode } from '../../constants';
import { DesignSystemSections } from '../DesignSystemSections';
import { SchemePicker } from '../SchemePicker';
import { SchemePreview } from '../SchemePreview';

import { createDesignSystemScreenStyles } from './DesignSystemScreen.styles';

/**
 * Development-only. Without a screen that puts the tokens and the components
 * next to each other in both schemes, there is no way to check that they fit.
 */
export const DesignSystemScreen = (): JSX.Element => {
  const styles = useThemedStyles(createDesignSystemScreenStyles);
  const [mode, setMode] = useState<PreviewMode>(PREVIEW_MODES.both);
  const schemes = SCHEMES_FOR_MODE[mode];

  return (
    <SafeAreaView style={styles.root} edges={STACK_SCREEN_EDGES}>
      <SchemePicker mode={mode} onChange={setMode} />
      <ScrollView>
        <View style={styles.columns}>
          {schemes.map((scheme: ColorScheme): JSX.Element => (
            <SchemePreview key={scheme} scheme={scheme}>
              <DesignSystemSections />
            </SchemePreview>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
